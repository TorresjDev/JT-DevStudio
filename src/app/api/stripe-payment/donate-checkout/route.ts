import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
import { paymentRateLimiter, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

// Validation schema for donation amount
const donationSchema = z.object({
	amount: z
		.number({ message: "Amount must be a number" })
		.positive("Amount must be positive")
		.min(1, "Minimum donation is $1")
		.max(10000, "Maximum donation is $10,000"),
});

export async function POST(req: Request) {
	// Rate limiting check
	const ip = getClientIp(req);
	const { success, remaining } = await checkRateLimit(paymentRateLimiter, ip);

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
		// Parse and validate request body
		const body = await req.json();
		const validation = donationSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					error: "Invalid donation amount",
					details: validation.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { amount } = validation.data;
		const stripe = getStripe();

		const session = await stripe.checkout.sessions.create({
			submit_type: "donate",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Support My Journey",
							description:
								"A contribution to support my development projects and open-source work.",
						},
						unit_amount: Math.round(amount * 100), // Convert dollars to cents
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${process.env.SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.SITE_URL}/support/donations`,
		});

		return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });
	} catch (error) {
		console.error("Error creating Stripe checkout session:", error);
		return NextResponse.json(
			{ error: "Failed to create Stripe session" },
			{ status: 500 }
		);
	}
}
