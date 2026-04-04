// src/app/studio/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const builds = [
	{
		name: "FintelliSense",
		status: "In Progress",
		desc: "AI-powered personal finance and investment platform. Aggregates financial data, runs analysis through Gemini, and generates actionable insights and predictions.",
		tech: ["Next.js", "Python/FastAPI", "Gemini API", "Supabase", "Tailwind CSS"],
		link: null,
		github: null,
	},
	{
		name: "JT Dev Studio",
		status: "Live",
		desc: "This platform — a professional technology development studio with user-generated content, OAuth authentication, Stripe/crypto payments, rate limiting, and a rich text editor.",
		tech: ["Next.js 16", "TypeScript", "Supabase", "Stripe", "Tailwind CSS", "Framer Motion"],
		link: "https://jt-devstudio.tech",
		github: "https://github.com/TorresjDev/Nextjs-App",
	},
	{
		name: "Trading Bot",
		status: "Planned",
		desc: "Automated trading logic with configurable strategies, backtesting, and real-time execution. Designed for personal use first, with plans to productize.",
		tech: ["Python", "REST APIs", "Data Analysis"],
		link: null,
		github: null,
	},
	{
		name: "Game Project",
		status: "Concept",
		desc: "First game project — idea to be scoped and started. Exploring genres, engines, and distribution options.",
		tech: ["TBD"],
		link: null,
		github: null,
	},
];

const statusConfig: Record<string, { color: string; dot: string }> = {
	Live: {
		color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
		dot: "bg-emerald-400",
	},
	"In Progress": {
		color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
		dot: "bg-amber-400",
	},
	Planned: {
		color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
		dot: "bg-blue-400",
	},
	Concept: {
		color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
		dot: "bg-purple-400",
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.12, duration: 0.6 },
	}),
};

export default function StudioPage() {
	return (
		<section
			id="studio"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-16 min-h-screen overflow-y-auto"
		>
			{/* Header */}
			<motion.div
				initial="hidden"
				animate="visible"
				className="text-center max-w-3xl mx-auto space-y-4"
			>
				<motion.p variants={fadeUp} custom={0} className="text-sm font-semibold tracking-[0.25em] uppercase text-[#DAA520]/80">
					The Studio
				</motion.p>
				<motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
					Original Builds
				</motion.h1>
				<motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground font-light leading-relaxed">
					Products, tools, and experiments — designed, built, and shipped independently.
					This is where freelance revenue funds future ventures.
				</motion.p>
			</motion.div>

			{/* Build Cards */}
			<div className="grid md:grid-cols-2 gap-8">
				{builds.map((build, i) => {
					const status = statusConfig[build.status] || statusConfig.Concept;
					return (
						<motion.div
							key={build.name}
							variants={fadeUp}
							custom={i}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-60px" }}
							className="group relative"
						>
							<div className="absolute -inset-0.5 bg-linear-to-r from-[#DAA520]/5 to-amber-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<div className="relative p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-[#DAA520]/30 transition-all duration-300 h-full flex flex-col">
								{/* Title + Status */}
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-2xl font-bold group-hover:text-[#DAA520] transition-colors">
										{build.name}
									</h3>
									<span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
										<span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
										{build.status}
									</span>
								</div>

								{/* Description */}
								<p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
									{build.desc}
								</p>

								{/* Tech Tags */}
								<div className="flex flex-wrap gap-2 mb-6">
									{build.tech.map((t) => (
										<span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-accent/20 text-muted-foreground border border-border">
											{t}
										</span>
									))}
								</div>

								{/* Actions */}
								<div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
									<span className="text-xs text-muted-foreground font-medium">Built by JT</span>
									<div className="ml-auto flex items-center gap-2">
										{build.github && (
											<Link
												href={build.github}
												target="_blank"
												className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#DAA520]/30 transition-all"
											>
												<Github className="w-4 h-4 text-muted-foreground hover:text-[#DAA520]" />
											</Link>
										)}
										{build.link ? (
											<Link
												href={build.link}
												target="_blank"
												className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#DAA520]/30 transition-all"
											>
												<ExternalLink className="w-4 h-4 text-muted-foreground hover:text-[#DAA520]" />
											</Link>
										) : (
											<span className="text-xs text-muted-foreground/50 italic">Coming Soon</span>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* CTA */}
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-80px" }}
				className="text-center p-8 md:p-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm max-w-3xl mx-auto"
			>
				<motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold mb-4">
					Want something built?
				</motion.h2>
				<motion.p variants={fadeUp} custom={1} className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
					If you need a custom tool, website, or integration — we can build it for you.
					Check out our services or reach out directly.
				</motion.p>
				<motion.div variants={fadeUp} custom={2} className="flex justify-center gap-4 flex-wrap">
					<Button asChild size="lg" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-8 py-6 text-base rounded-xl">
						<Link href="/contact">
							Start a Project <ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="px-8 py-6 text-base rounded-xl border-border hover:border-[#DAA520]/50 hover:text-[#DAA520]">
						<Link href="/services">
							View Services
						</Link>
					</Button>
				</motion.div>
			</motion.div>
		</section>
	);
}
