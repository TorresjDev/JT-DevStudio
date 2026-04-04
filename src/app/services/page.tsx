// src/app/services/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Code2, Zap, Brain, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
	{
		icon: Globe,
		title: "Landing Pages",
		desc: "Single-page sites for small businesses, events, or products. Clean design, fast delivery, mobile-first.",
		price: "$300 – $800",
		features: ["Responsive design", "SEO optimized", "Contact forms", "Hosting setup"],
	},
	{
		icon: Code2,
		title: "Full Web Applications",
		desc: "Next.js applications with authentication, database, CRUD functionality, and polished UI.",
		price: "$1,000 – $3,500",
		features: ["User auth & roles", "Database design", "API integration", "Admin dashboard"],
	},
	{
		icon: Zap,
		title: "Automation & Scripts",
		desc: "Excel automation, data pipelines, task schedulers, and workflow tools that save hours of manual work.",
		price: "$150 – $500",
		features: ["Data processing", "Report generation", "Task scheduling", "API connectors"],
	},
	{
		icon: Brain,
		title: "AI Tool Integration",
		desc: "Plug Claude, OpenAI, or Gemini APIs into existing tools and workflows for intelligent automation.",
		price: "$500 – $2,000",
		features: ["LLM integration", "Custom prompts", "Data analysis", "Chatbot interfaces"],
	},
	{
		icon: MessageSquare,
		title: "Tech Consulting",
		desc: "1-hour strategy calls, roadmap sessions, tech stack advice, and architecture reviews.",
		price: "$75 – $150/hr",
		features: ["Stack evaluation", "Architecture review", "Roadmap planning", "Code audits"],
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.1, duration: 0.6 },
	}),
};

export default function ServicesPage() {
	return (
		<section
			id="services"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-16 min-h-screen overflow-y-auto"
		>
			{/* Header */}
			<motion.div
				initial="hidden"
				animate="visible"
				className="text-center max-w-3xl mx-auto space-y-4"
			>
				<motion.p variants={fadeUp} custom={0} className="text-sm font-semibold tracking-[0.25em] uppercase text-[#DAA520]/80">
					Services
				</motion.p>
				<motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
					What We Offer
				</motion.h1>
				<motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground font-light leading-relaxed">
					Professional technology services with clear pricing. No hidden fees, no scope creep — just honest work delivered on time.
				</motion.p>
			</motion.div>

			{/* Service Cards */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{services.map((service, i) => (
					<motion.div
						key={service.title}
						variants={fadeUp}
						custom={i}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-60px" }}
						className="group relative"
					>
						<div className="absolute -inset-0.5 bg-linear-to-r from-[#DAA520]/10 to-amber-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div className="relative p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-[#DAA520]/30 transition-all duration-300 h-full flex flex-col">
							<div className="p-3 rounded-xl bg-[#DAA520]/10 w-fit mb-5 group-hover:bg-[#DAA520]/20 transition-colors">
								<service.icon className="w-7 h-7 text-[#DAA520]" />
							</div>

							<h3 className="text-xl font-bold mb-2 group-hover:text-[#DAA520] transition-colors">
								{service.title}
							</h3>

							<p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
								{service.desc}
							</p>

							<div className="space-y-2 mb-6">
								{service.features.map((feature) => (
									<div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
										<CheckCircle className="w-4 h-4 text-[#DAA520]/60 shrink-0" />
										<span>{feature}</span>
									</div>
								))}
							</div>

							<div className="mt-auto pt-4 border-t border-border">
								<p className="text-2xl font-bold text-[#DAA520]">{service.price}</p>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Not Sure CTA */}
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-80px" }}
				className="relative p-8 md:p-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm text-center max-w-3xl mx-auto"
			>
				<motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold mb-4">
					Not sure what you need?
				</motion.h2>
				<motion.p variants={fadeUp} custom={1} className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
					That&apos;s completely fine. Drop a message with a brief description of your project or idea, and I&apos;ll
					get back to you with a recommendation and a quote — no obligation.
				</motion.p>
				<motion.div variants={fadeUp} custom={2}>
					<Button asChild size="lg" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-8 py-6 text-base rounded-xl">
						<Link href="/contact">
							Let&apos;s Talk <ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</motion.div>
			</motion.div>
		</section>
	);
}
