import { NextResponse } from "next/server";
import crypto from "crypto";
import { recordDonation } from "@/lib/donations";
import { requireWebhookSecret } from "@/lib/webhook-secrets";

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

	const secretResult = requireWebhookSecret(
		process.env.COINBASE_WEBHOOK_SECRET,
		"COINBASE_WEBHOOK_SECRET"
	);

	if (secretResult instanceof Response) {
		return secretResult;
	}

	if (!secretResult) {
		return NextResponse.json({ received: true }, { status: 200 });
	}

	const expectedSig = crypto
		.createHmac("sha256", secretResult)
		.update(body)
		.digest("hex");

	// Constant-time comparison to avoid leaking the signature via timing.
	const sigBuf = Buffer.from(sig);
	const expectedBuf = Buffer.from(expectedSig);
	const signatureValid =
		sigBuf.length === expectedBuf.length &&
		crypto.timingSafeEqual(sigBuf, expectedBuf);

	if (!signatureValid) {
		console.error("Coinbase webhook signature verification failed");
		return NextResponse.json(
			{ error: "Invalid webhook signature" },
			{ status: 400 }
		);
	}

	try {
		const payload = JSON.parse(body);
		const eventType = payload?.event?.type;
		const eventId = payload?.id as string | undefined;

		switch (eventType) {
			case "charge:confirmed": {
				const charge = payload.event.data;
				const amount = charge?.pricing?.local?.amount ?? null;
				const currency = charge?.pricing?.local?.currency ?? null;

				if (!eventId) {
					return NextResponse.json(
						{ error: "Missing event id" },
						{ status: 400 }
					);
				}

				try {
					const { duplicate } = await recordDonation({
						provider: "coinbase",
						provider_event_id: eventId,
						amount: amount !== null ? Number(amount) : null,
						currency,
						status: "confirmed",
						email: charge?.metadata?.email ?? null,
					});

					if (!duplicate) {
						console.log(
							`Crypto donation recorded: $${amount ?? "unknown"} ${currency ?? "USD"} (Charge: ${charge?.code})`
						);
					}
				} catch (err) {
					console.error("Failed to persist Coinbase donation:", err);
					return NextResponse.json(
						{ error: "Failed to persist donation" },
						{ status: 500 }
					);
				}
				break;
			}
			case "charge:failed": {
				const charge = payload.event.data;
				console.log(`Crypto donation failed (Charge: ${charge?.code})`);
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
