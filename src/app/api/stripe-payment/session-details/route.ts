import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";

/**
 * GET /api/stripe-payment/session-details?session_id=cs_xxx
 *
 * Retrieves Stripe checkout session details for the thank-you page.
 * Returns the donation amount, donor email, and payment ID.
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("session_id");

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 }
			);
		}

		const stripe = getStripe();
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Only return safe, non-sensitive details
		return NextResponse.json({
			id: session.id,
			payment_intent: typeof session.payment_intent === "string"
				? session.payment_intent
				: session.payment_intent?.id ?? null,
			amount_total: session.amount_total
				? (session.amount_total / 100).toFixed(2)
				: null,
			currency: session.currency?.toUpperCase() ?? "USD",
			customer_email: session.customer_details?.email ?? null,
			customer_name: session.customer_details?.name ?? null,
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
