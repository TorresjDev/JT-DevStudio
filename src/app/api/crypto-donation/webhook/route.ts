import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Coinbase Commerce Webhook endpoint
 *
 * Handles `charge:confirmed` events to verify that
 * crypto donation payments were completed.
 *
 * Setup:
 * 1. Go to Coinbase Commerce Dashboard → Settings → Webhook subscriptions
 * 2. Add endpoint URL: https://your-domain.com/api/crypto-donation/webhook
 * 3. Copy the shared secret and set it as COINBASE_WEBHOOK_SECRET env var
 */
export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("x-cc-webhook-signature");

	if (!sig) {
		return NextResponse.json(
			{ error: "Missing webhook signature header" },
			{ status: 400 }
		);
	}

	const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

	// If webhook secret is not configured, skip signature verification
	if (!webhookSecret) {
		console.warn(
			"COINBASE_WEBHOOK_SECRET is not configured. Webhook signature verification is disabled."
		);
		return NextResponse.json({ received: true }, { status: 200 });
	}

	// Verify the webhook signature
	const expectedSig = crypto
		.createHmac("sha256", webhookSecret)
		.update(body)
		.digest("hex");

	if (sig !== expectedSig) {
		console.error("Coinbase webhook signature verification failed");
		return NextResponse.json(
			{ error: "Invalid webhook signature" },
			{ status: 400 }
		);
	}

	try {
		const event = JSON.parse(body);
		const eventType = event?.event?.type;

		switch (eventType) {
			case "charge:confirmed": {
				const charge = event.event.data;
				const amount = charge?.pricing?.local?.amount ?? "unknown";
				const currency = charge?.pricing?.local?.currency ?? "USD";

				console.log(
					`✅ Crypto donation confirmed: $${amount} ${currency} (Charge: ${charge?.code})`
				);

				// Future: Save donation to database, send thank-you email, etc.
				break;
			}
			case "charge:failed": {
				const charge = event.event.data;
				console.log(
					`❌ Crypto donation failed (Charge: ${charge?.code})`
				);
				break;
			}
			default:
				console.log(`Unhandled Coinbase event type: ${eventType}`);
		}

		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("Error processing Coinbase webhook:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}
