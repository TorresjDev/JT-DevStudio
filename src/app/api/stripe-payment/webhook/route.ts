import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
import { recordDonation, requireWebhookSecret } from "@/lib/donations";
import Stripe from "stripe";

/**
 * Stripe Webhook endpoint
 *
 * Handles `checkout.session.completed` events to verify
 * that donation payments were actually completed.
 *
 * Setup:
 * 1. Add this URL as a webhook in Stripe Dashboard:
 *    https://your-domain.com/api/stripe-payment/webhook
 * 2. Select the `checkout.session.completed` event
 * 3. Copy the signing secret and set it as STRIPE_WEBHOOK_SECRET env var
 *
 * For local testing with Stripe CLI:
 *   stripe listen --forward-to localhost:3000/api/stripe-payment/webhook
 */
export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature");

	if (!sig) {
		return NextResponse.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 }
		);
	}

	const secretResult = requireWebhookSecret(
		process.env.STRIPE_WEBHOOK_SECRET,
		"STRIPE_WEBHOOK_SECRET"
	);

	if (secretResult instanceof Response) {
		return secretResult;
	}

	if (!secretResult) {
		return NextResponse.json({ received: true }, { status: 200 });
	}

	let event: Stripe.Event;

	try {
		const stripe = getStripe();
		event = stripe.webhooks.constructEvent(body, sig, secretResult);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error(`Webhook signature verification failed: ${message}`);
		return NextResponse.json(
			{ error: `Webhook Error: ${message}` },
			{ status: 400 }
		);
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			const amountTotal = session.amount_total
				? session.amount_total / 100
				: null;

			try {
				const { duplicate } = await recordDonation({
					provider: "stripe",
					provider_event_id: event.id,
					amount: amountTotal,
					currency: session.currency ?? null,
					status: session.payment_status ?? "completed",
					email: session.customer_details?.email ?? null,
				});

				if (!duplicate) {
					console.log(
						`Donation recorded: $${amountTotal ?? "unknown"} ${session.currency ?? "USD"} (Session: ${session.id})`
					);
				}
			} catch (err) {
				console.error("Failed to persist Stripe donation:", err);
				return NextResponse.json(
					{ error: "Failed to persist donation" },
					{ status: 500 }
				);
			}
			break;
		}
		default:
			console.log(`Unhandled Stripe event type: ${event.type}`);
	}

	return NextResponse.json({ received: true }, { status: 200 });
}
