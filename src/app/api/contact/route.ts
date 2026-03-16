import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	try {
		const { name, email, message } = await request.json();

		if (!name || !email || !message) {
			return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
		}

		// 1. Email to YOU (j.torres3.dev@gmail.com)
		const { error: adminError } = await resend.emails.send({
			from: "Contact Form <onboarding@resend.dev>",
			to: "j.torres3.dev@gmail.com",
			subject: `New Contact Message from ${name}`,
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-top: 4px solid #DAA520; border-radius: 8px; background: #ffffff; color: #1a202c;">
                    <h2 style="color: #DAA520; margin-top: 0;">New Contact Message</h2>
                    <p style="margin-bottom: 5px;"><strong>From:</strong> ${name}</p>
                    <p style="margin-bottom: 15px;"><strong>Email:</strong> ${email}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
                    <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
                    <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-style: italic; color: #4a5568;">
                        ${message.replace(/\n/g, "<br />")}
                    </div>
                </div>
            `,
		});

		if (adminError) throw adminError;

		// 2. Auto-Responder Email TO the Sender (visitor)
		// NOTE: Sending to arbitrary emails requires a verified Domain on Resend.
		// If using 'onboarding@resend.dev', this might only send to you or fails for others until verified.
		const { error: autoError } = await resend.emails.send({
			from: "Jesus Torres <onboarding@resend.dev>", // Or update once domain is verified
			to: email,
			subject: "Thanks for reaching out!",
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-top: 4px solid #DAA520; border-radius: 8px; background: #ffffff; color: #1a202c;">
                    <h2 style="color: #DAA520; margin-top: 0;">Thanks for reaching out!</h2>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>We've received your message regarding: </p>
                    <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-style: italic; color: #4a5568; margin-bottom: 15px;">
                        "${message.replace(/\n/g, "<br />")}"
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
		console.error("Resend API Error:", e);
		return NextResponse.json({ success: false, error: e }, { status: 500 });
	}
}
