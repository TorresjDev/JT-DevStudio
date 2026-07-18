// src/app/services/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Globe,
	Code2,
	Zap,
	Brain,
	MessageSquare,
	ClipboardCheck,
	BarChart3,
	PenLine,
	ArrowRight,
	CheckCircle,
} from "lucide-react";
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
	{
		icon: ClipboardCheck,
		title: "QA & Testing Services",
		desc: "Manual and automated testing to catch bugs before your users do.",
		price: "$400 – $2,000",
		features: [
			"Test plan & strategy",
			"Automated test suites (unit/integration/e2e)",
			"Manual QA & bug reports",
			"CI/CD test integration",
		],
	},
	{
		icon: BarChart3,
		title: "Data Analysis & Reporting",
		desc: "Turn raw data into decisions with custom analysis and dashboards.",
		price: "$500 – $2,500",
		features: [
			"Data cleaning & processing",
			"Custom dashboards & visualizations",
			"Actionable insights & reports",
			"Excel/SQL/Python analysis",
		],
	},
	{
		icon: PenLine,
		title: "Digital Content Creation",
		desc: "Technical writing, documentation, and digital assets for your product or brand.",
		price: "$150 – $750",
		features: [
			"Blog & technical writing",
			"Product/marketing copy",
			"Documentation & guides",
			"Social & digital assets",
		],
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
			className="w-full mx-auto max-w-7xl px-4 py-6 md:py-8 md:px-8 space-y-10 md:space-y-12 overflow-y-auto"
		>
			{/* Header */}
			<motion.div
				initial="hidden"
				animate="visible"
				className="text-center max-w-3xl mx-auto space-y-3"
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

			{/* Service Cards — 2×4 on md, 4×2 on xl so 8 cards never leave a lopsided row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
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
						<div className="relative p-5 md:p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-[#DAA520]/30 transition-all duration-300 h-full flex flex-col">
							<div className="p-3 rounded-xl bg-[#DAA520]/10 w-fit mb-3 group-hover:bg-[#DAA520]/20 transition-colors">
								<service.icon className="w-7 h-7 text-[#DAA520]" />
							</div>

							<h3 className="text-xl font-bold mb-2 group-hover:text-[#DAA520] transition-colors">
								{service.title}
							</h3>

							<p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
								{service.desc}
							</p>

							<div className="space-y-2 mb-4">
								{service.features.map((feature) => (
									<div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
										<CheckCircle className="w-4 h-4 text-[#DAA520]/60 shrink-0 mt-0.5" />
										<span>{feature}</span>
									</div>
								))}
							</div>

							<div className="mt-auto pt-4 border-t border-border">
								<p className="text-xl md:text-2xl font-bold text-[#DAA520]">{service.price}</p>
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
				className="relative p-6 md:p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm text-center max-w-3xl mx-auto"
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
