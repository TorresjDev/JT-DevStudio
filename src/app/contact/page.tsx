"use client";

import React, { useState } from "react";
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const SERVICE_OPTIONS = [
	"Landing Page",
	"Full Web Application",
	"Automation & Scripts",
	"AI Tool Integration",
	"Tech Consulting",
	"Other / Not Sure",
];

const BUDGET_OPTIONS = [
	"Under $500",
	"$500 – $1,500",
	"$1,500 – $5,000",
	"Let's discuss",
];

const TIMELINE_OPTIONS = [
	"ASAP",
	"1 month",
	"2–3 months",
	"Flexible",
];

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		service: "",
		budget: "",
		timeline: "",
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		try {
			// 1. Save to Supabase DB (Backup)
			const messageWithCompany = formData.company
				? `Company: ${formData.company}\n\n${formData.message}`
				: formData.message;

			const { error } = await supabase
				.from("contact_messages")
				.insert([
					{
						name: formData.name,
						email: formData.email,
						message: messageWithCompany,
						service: formData.service,
						budget: formData.budget,
						timeline: formData.timeline,
					}
				]);

			if (error) throw error;

			// 2. Trigger Resend Email API
			const emailResponse = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					message: `Service: ${formData.service}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nCompany: ${formData.company || "N/A"}\n\n${formData.message}`,
				}),
			});

			if (!emailResponse.ok) {
				console.warn("API Email response failed, but message saved to database.");
			}

			setStatus("success");
			setFormData({ name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" });
		} catch (e) {
			console.error("Error sending message:", e);
			setStatus("error");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const selectClasses = "w-full p-3 rounded-xl bg-background/50 border border-border focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/40 outline-none transition-all duration-200 text-sm appearance-none cursor-pointer";
	const inputClasses = "w-full p-3 rounded-xl bg-background/50 border border-border focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/40 outline-none transition-all duration-200 text-sm";

	return (
		<section
			id="contact"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen overflow-y-auto animate-in fade-in duration-500"
		>
			{/* Header */}
			<div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
				<p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#DAA520]/80">
					Contact
				</p>
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
					Let&apos;s Work Together
				</h1>
				<p className="text-lg text-muted-foreground font-light">
					Tell us about your project and we&apos;ll get back to you with a plan and a quote.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{/* Contact Info Sidebar */}
				<div className="space-y-6 flex flex-col justify-start">
					<div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-4 shadow-xl hover:border-[#DAA520]/20 transition-all duration-300">
						<h3 className="text-xl font-bold text-[#DAA520]">Connect Directly</h3>
						<p className="text-sm text-muted-foreground">
							Prefer to reach out another way? Use any of these channels.
						</p>

						<div className="flex flex-col gap-3">
							<Link href="mailto:j.torres3.dev@gmail.com" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 border border-white/5 hover:border-[#DAA520]/30 transition-all duration-300 group">
								<div className="p-2 rounded-lg bg-[#DAA520]/10 text-[#DAA520]">
									<Mail className="w-5 h-5" />
								</div>
								<div>
									<p className="text-sm font-semibold">Email</p>
									<p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">j.torres3.dev@gmail.com</p>
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

							<Link href="https://linkedin.com/in/torresjdev" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 border border-white/5 hover:border-[#DAA520]/30 transition-all duration-300 group">
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
									Thank you for reaching out. We&apos;ll review your inquiry and get back to you within 48 hours.
								</p>
								<Button onClick={() => setStatus("idle")} className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-6">
									Send Another
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-5 relative">
								{/* Row 1: Name + Email */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name *</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className={inputClasses}
											placeholder="Your Name"
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email *</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className={inputClasses}
											placeholder="your@email.com"
										/>
									</div>
								</div>

								{/* Row 2: Company + Service */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label htmlFor="company" className="text-sm font-medium text-muted-foreground">Company / Project Name</label>
										<input
											type="text"
											id="company"
											name="company"
											value={formData.company}
											onChange={handleChange}
											className={inputClasses}
											placeholder="Optional"
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="service" className="text-sm font-medium text-muted-foreground">Service Needed *</label>
										<select
											id="service"
											name="service"
											value={formData.service}
											onChange={handleChange}
											required
											className={selectClasses}
										>
											<option value="" disabled>Select a service</option>
											{SERVICE_OPTIONS.map((s) => (
												<option key={s} value={s}>{s}</option>
											))}
										</select>
									</div>
								</div>

								{/* Row 3: Budget + Timeline */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label htmlFor="budget" className="text-sm font-medium text-muted-foreground">Budget Range *</label>
										<select
											id="budget"
											name="budget"
											value={formData.budget}
											onChange={handleChange}
											required
											className={selectClasses}
										>
											<option value="" disabled>Select a range</option>
											{BUDGET_OPTIONS.map((b) => (
												<option key={b} value={b}>{b}</option>
											))}
										</select>
									</div>
									<div className="space-y-2">
										<label htmlFor="timeline" className="text-sm font-medium text-muted-foreground">Timeline *</label>
										<select
											id="timeline"
											name="timeline"
											value={formData.timeline}
											onChange={handleChange}
											required
											className={selectClasses}
										>
											<option value="" disabled>Select timeline</option>
											{TIMELINE_OPTIONS.map((t) => (
												<option key={t} value={t}>{t}</option>
											))}
										</select>
									</div>
								</div>

								{/* Message */}
								<div className="space-y-2">
									<label htmlFor="message" className="text-sm font-medium text-muted-foreground">Project Description *</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={5}
										className={`${inputClasses} resize-none`}
										placeholder="Tell us about your project — what you need, the problem it solves, and any important details."
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
											Send It <Send className="w-4 h-4 ml-1" />
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
