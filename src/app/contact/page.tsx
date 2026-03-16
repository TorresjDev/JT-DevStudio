"use client";

import React, { useState } from "react";
import { Mail, Github, Globe, Linkedin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		try {
			const { error } = await supabase
				.from("contact_messages")
				.insert([
					{ name: formData.name, email: formData.email, message: formData.message }
				]);

			if (error) throw error;

			setStatus("success");
			setFormData({ name: "", email: "", message: "" });
		} catch (e) {
			console.error("Error sending message:", e);
			setStatus("error");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<section
			id="contact"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen overflow-y-auto animate-in fade-in duration-500"
		>
			<div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
					Get In Touch
				</h1>
				<p className="text-lg text-muted-foreground font-light">
					Have a question, proposed project, or just want to say hi? Drop me a message below or connect via socials.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{/* Contact Info */}
				<div className="space-y-6 flex flex-col justify-center">
					<div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-4 shadow-xl hover:border-[#DAA520]/20 transition-all duration-300">
						<h3 className="text-xl font-bold text-[#DAA520]">Connect With Me</h3>
						<p className="text-sm text-muted-foreground">
							Feel free to reach out through any of these platforms.
						</p>
						
						<div className="flex flex-col gap-3">
							<Link href="mailto:jtorres3.dev@gmail.com" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 border border-white/5 hover:border-[#DAA520]/30 transition-all duration-300 group">
								<div className="p-2 rounded-lg bg-[#DAA520]/10 text-[#DAA520]">
									<Mail className="w-5 h-5" />
								</div>
								<div>
									<p className="text-sm font-semibold">Email</p>
									<p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">jtorres3.dev@gmail.com</p>
								</div>
							</Link>


							<Link href="https://github.com/torresjdev" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 border border-white/5 hover:border-[#DAA520]/30 transition-all duration-300 group">
								<div className="p-2 rounded-lg bg-[#DAA520]/10 text-[#DAA520]">
									<Github className="w-5 h-5" />
								</div>
								<div>
									<p className="text-sm font-semibold">GitHub</p>
									<p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">github.com/torresjdev</p>
								</div>
							</Link>

							<Link href="https://linkedin.com/in/torresk" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 border border-white/5 hover:border-[#DAA520]/30 transition-all duration-300 group">
								<div className="p-2 rounded-lg bg-[#DAA520]/10 text-[#DAA520]">
									<Linkedin className="w-5 h-5" />
								</div>
								<div>
									<p className="text-sm font-semibold">LinkedIn</p>
									<p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">linkedin.com/in/torresjdev</p>
								</div>
							</Link>
						</div>
					</div>
				</div>

				{/* Contact Form */}
				<div className="lg:col-span-2">
					<div className="p-6 md:p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-2xl relative overflow-hidden group hover:border-[#DAA520]/20 transition-all duration-300">
						<div className="absolute -inset-1 bg-linear-to-r from-[#DAA520] to-yellow-600 rounded-2xl blur opacity-5 group-hover:opacity-10 transition duration-500"></div>
						
						{status === "success" ? (
							<div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in zoom-in duration-300">
								<CheckCircle className="w-16 h-16 text-green-500" />
								<h2 className="text-2xl font-bold text-[#DAA520]">Message Sent!</h2>
								<p className="text-muted-foreground max-w-sm">
									Thank you for reaching out. I'll get back to you as soon as possible.
								</p>
								<Button onClick={() => setStatus("idle")} className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-6">
									Send Another
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6 relative">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full p-3 rounded-xl bg-background/50 border border-border focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/40 outline-none transition-all duration-200 text-sm"
											placeholder="Your Name"
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full p-3 rounded-xl bg-background/50 border border-border focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/40 outline-none transition-all duration-200 text-sm"
											placeholder="your@email.com"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={5}
										className="w-full p-3 rounded-xl bg-background/50 border border-border focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/40 outline-none transition-all duration-200 text-sm resize-none"
										placeholder="How can I help you?"
									/>
								</div>

								<Button 
									type="submit" 
									disabled={status === "loading"}
									className="w-full bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-6 py-6 h-auto text-base rounded-xl flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
								>
									{status === "loading" ? (
										<span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
									) : (
										<>
											Send Message <Send className="w-4 h-4 ml-1" />
										</>
									)}
								</Button>

								{status === "error" && (
									<div className="flex items-center gap-2 text-red-500 text-sm mt-2">
										<AlertCircle className="w-4 h-4" />
										<span>Something went wrong. Please try again.</span>
									</div>
								)}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
