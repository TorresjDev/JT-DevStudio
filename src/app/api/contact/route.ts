import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiRateLimiter, checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Validation schema for the contact form
const contactSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100),
	email: z.string().trim().email("Invalid email").max(200),
	message: z.string().trim().min(1, "Message is required").max(5000),
});

// Escape user input before embedding it in HTML email bodies.
function escapeHtml(input: string): string {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
	// Rate limit by IP to prevent inbox spam and Resend quota abuse.
	const ip = getClientIp(request);
	const { success, remaining } = await checkRateLimit(apiRateLimiter, ip);

	if (!success) {
		return NextResponse.json(
			{ success: false, error: "Too many requests. Please try again later." },
			{
				status: 429,
				headers: {
					"Retry-After": "60",
					"X-RateLimit-Remaining": String(remaining ?? 0),
				},
			}
		);
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	try {
		const body = await request.json();
		const validation = contactSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ success: false, error: "Missing or invalid required fields" },
				{ status: 400 }
			);
		}

		const { name, email, message } = validation.data;

		// Escaped, HTML-safe copies for use in email markup.
		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

		// 1. Email to YOU (j.torres3.dev@gmail.com)
		const { error: adminError } = await resend.emails.send({
			from: "Contact Form <contact@jt-devstudio.tech>",
			to: "j.torres3.dev@gmail.com",
			replyTo: email,
			subject: `New Contact Message from ${name}`,
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-top: 4px solid #DAA520; border-radius: 8px; background: #ffffff; color: #1a202c;">
                    <h2 style="color: #DAA520; margin-top: 0;">New Contact Message</h2>
                    <p style="margin-bottom: 5px;"><strong>From:</strong> ${safeName}</p>
                    <p style="margin-bottom: 15px;"><strong>Email:</strong> ${safeEmail}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
                    <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
                    <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-style: italic; color: #4a5568;">
                        ${safeMessage}
                    </div>
                </div>
            `,
		});

		if (adminError) throw adminError;

		// 2. Auto-Responder Email TO the Sender (visitor)
		// NOTE: Sending to arbitrary emails requires a verified Domain on Resend.
		// If using 'onboarding@resend.dev', this might only send to you or fails for others until verified.
		const { error: autoError } = await resend.emails.send({
			from: "Jesus Torres <contact@jt-devstudio.tech>",
			to: email,
			subject: "Thanks for reaching out!",
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-top: 4px solid #DAA520; border-radius: 8px; background: #ffffff; color: #1a202c;">
                    <h2 style="color: #DAA520; margin-top: 0;">Thanks for reaching out!</h2>
                    <p>Hi <strong>${safeName}</strong>,</p>
                    <p>We've received your message regarding: </p>
                    <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-style: italic; color: #4a5568; margin-bottom: 15px;">
                        "${safeMessage}"
                    </div>
                    <p>I'll get back to you as soon as I can.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
                    <p style="font-size: 14px; text-align: center; color: #a0aec0; margin-bottom: 0;">
                        Best regards,<br />
                        <strong>Jesus Torres</strong>
                    </p>
                </div>
            `,
		});

		if (autoError) {
			console.warn("Auto-responder failed (usually requires verified domain):", autoError);
			// We don't throw error to avoid blocking the main contact alert to the user.
		}

		return NextResponse.json({ success: true });
	} catch (e) {
		// Log full detail server-side, return a generic message to the client.
		console.error("Resend API Error:", e);
		return NextResponse.json(
			{ success: false, error: "Failed to send message. Please try again later." },
			{ status: 500 }
		);
	}
}
