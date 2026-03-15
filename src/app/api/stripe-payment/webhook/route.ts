import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
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

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	// If webhook secret is not configured, skip signature verification
	// This allows the endpoint to exist without blocking deployment
	if (!webhookSecret) {
		console.warn(
			"STRIPE_WEBHOOK_SECRET is not configured. Webhook signature verification is disabled."
		);
		return NextResponse.json({ received: true }, { status: 200 });
	}

	let event: Stripe.Event;

	try {
		const stripe = getStripe();
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error(`Webhook signature verification failed: ${message}`);
		return NextResponse.json(
			{ error: `Webhook Error: ${message}` },
			{ status: 400 }
		);
	}

	// Handle the event
	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			const amountTotal = session.amount_total
				? (session.amount_total / 100).toFixed(2)
				: "unknown";

			console.log(
				`✅ Donation received: $${amountTotal} USD (Session: ${session.id})`
			);

			// Future: Save donation to database, send thank-you email, etc.
			break;
		}
		default:
			// Unexpected event type — log but don't error
			console.log(`Unhandled Stripe event type: ${event.type}`);
	}

	return NextResponse.json({ received: true }, { status: 200 });
}
