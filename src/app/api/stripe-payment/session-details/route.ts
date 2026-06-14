import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
import { apiRateLimiter, checkRateLimit, getClientIp } from "@/lib/rate-limit";

const SAFE_SESSION_ID = /^cs_[a-zA-Z0-9_-]{10,100}$/;

function maskEmail(email: string | null): string | null {
	if (!email) return null;
	const [local, domain] = email.split("@");
	if (!local || !domain) return email;
	if (local.length <= 2) {
		return `${local[0]}***@${domain}`;
	}
	return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

function maskName(name: string | null): string | null {
	if (!name) return null;
	const parts = name.split(" ");
	return parts
		.map((part) => {
			if (part.length <= 2) return `${part[0]}*`;
			return `${part[0]}${"*".repeat(part.length - 2)}${part[part.length - 1]}`;
		})
		.join(" ");
}

/**
 * GET /api/stripe-payment/session-details?session_id=cs_xxx
 *
 * Retrieves Stripe checkout session details for the thank-you page.
 * Returns the donation amount, donor email, and payment ID.
 */
export async function GET(request: Request) {
	// Rate limiting check
	const ip = getClientIp(request);
	const { success, remaining } = await checkRateLimit(apiRateLimiter, ip);

	if (!success) {
		return NextResponse.json(
			{ error: "Too many requests. Please try again later." },
			{
				status: 429,
				headers: {
					"Retry-After": "60",
					"X-RateLimit-Remaining": String(remaining ?? 0),
				},
			}
		);
	}

	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("session_id");

		if (!sessionId || !SAFE_SESSION_ID.test(sessionId)) {
			return NextResponse.json(
				{ error: "Missing or invalid session ID" },
				{ status: 400 }
			);
		}

		const stripe = getStripe();
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Only return safe, non-sensitive details with masked customer info
		return NextResponse.json({
			id: session.id,
			payment_intent: typeof session.payment_intent === "string"
				? session.payment_intent
				: session.payment_intent?.id ?? null,
			amount_total: session.amount_total
				? (session.amount_total / 100).toFixed(2)
				: null,
			currency: session.currency?.toUpperCase() ?? "USD",
			customer_email: maskEmail(session.customer_details?.email ?? null),
			customer_name: maskName(session.customer_details?.name ?? null),
			payment_status: session.payment_status,
			created: session.created,
		});
	} catch (error) {
		console.error("Error retrieving session details:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve session details" },
			{ status: 500 }
		);
	}
}
