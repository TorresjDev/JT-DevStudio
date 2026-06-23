// src/app/studio/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowRight,
	ExternalLink,
	Github,
	Play,
	X,
	Gamepad2,
	BarChart2,
	ClipboardList,
	Cpu,
	Globe,
	Bot,
	Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Live" | "In Progress" | "Planned" | "Concept";
type Category = "Product" | "Open Source";

interface Project {
	id: string;
	name: string;
	category: Category;
	status: Status;
	desc: string;
	tech: string[];
	github: string | null;
	live: string | null;
	playable?: boolean;
	icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
	{
		id: "fintellisense",
		name: "FintelliSense",
		category: "Product",
		status: "In Progress",
		desc: "AI-powered personal finance and investment platform. Aggregates financial data, runs analysis through Gemini, and surfaces actionable insights and predictions.",
		tech: ["Next.js", "Python / FastAPI", "Gemini API", "Supabase", "Tailwind CSS"],
		github: null,
		live: null,
		icon: "cpu",
	},
	{
		id: "jt-devstudio",
		name: "JT Dev Studio",
		category: "Product",
		status: "Live",
		desc: "This platform — a full-stack development studio with OAuth auth, user-generated content, rate limiting, Stripe and crypto payments, and a rich text editor.",
		tech: ["Next.js 14", "TypeScript", "Supabase", "Stripe", "Tailwind CSS", "Framer Motion"],
		github: "https://github.com/TorresjDev/Nextjs-App",
		live: "https://jt-devstudio.tech",
		icon: "globe",
	},
	{
		id: "jumper",
		name: "Jumper",
		category: "Open Source",
		status: "Live",
		desc: "A fully playable TypeScript platformer. Collect coins, dodge bombs, beat the clock. Leaderboard, pause menu, mobile controls, and GitHub Actions CI/CD to GitHub Pages.",
		tech: ["TypeScript", "Phaser 3", "Webpack", "GitHub Pages"],
		github: "https://github.com/TorresjDev/TS-Phaser-Game-Jumper",
		live: "https://torresjdev.github.io/TS-Phaser-Game-Jumper/",
		playable: true,
		icon: "gamepad",
	},
	{
		id: "sound-wave",
		name: "Sound Wave Analyzer",
		category: "Open Source",
		status: "Live",
		desc: "Real-time audio signal processing and visualization. Upload WAV, MP3, or FLAC and get waveforms, spectrograms, FFT spectrum, harmonic detection, and CSV exports.",
		tech: ["Python", "Streamlit", "NumPy", "SciPy", "Plotly"],
		github: "https://github.com/TorresjDev/Python-Sound-Wave-Analysis",
		live: "https://python-sound-wave-analysis.streamlit.app/",
		icon: "chart",
	},
	{
		id: "dtm",
		name: "Developer Task Manager",
		category: "Open Source",
		status: "In Progress",
		desc: "Full-stack task management for developers. Create projects, assign tasks, set priorities, and track status across a connected database. Built on ASP.NET Core with Azure deployment.",
		tech: ["C#", ".NET 8", "ASP.NET Razor Pages", "SQLite", "Azure"],
		github: "https://github.com/TorresjDev/Developer-Task-Manager",
		live: null,
		icon: "clipboard",
	},
	{
		id: "trading-bot",
		name: "Trading Bot",
		category: "Product",
		status: "Planned",
		desc: "Automated trading logic with configurable strategies, backtesting, and real-time execution. Built for personal use first, with plans to productize.",
		tech: ["Python", "REST APIs", "Data Analysis"],
		github: null,
		live: null,
		icon: "bot",
	},
];

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<Status, { color: string; dot: string }> = {
	Live: {
		color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
		dot: "bg-emerald-400",
	},
	"In Progress": {
		color: "bg-amber-500/15 text-amber-400 border-amber-500/25",
		dot: "bg-amber-400",
	},
	Planned: {
		color: "bg-blue-500/15 text-blue-400 border-blue-500/25",
		dot: "bg-blue-400",
	},
	Concept: {
		color: "bg-purple-500/15 text-purple-400 border-purple-500/25",
		dot: "bg-purple-400",
	},
};

const FILTERS = ["All", "Live", "In Progress", "Planned"] as const;
type Filter = (typeof FILTERS)[number];

// ─── Icon helper ──────────────────────────────────────────────────────────────

function ProjectIcon({ icon }: { icon: string }) {
	const cls = "w-5 h-5 text-[#DAA520]";
	switch (icon) {
		case "cpu":       return <Cpu className={cls} />;
		case "globe":     return <Globe className={cls} />;
		case "gamepad":   return <Gamepad2 className={cls} />;
		case "chart":     return <BarChart2 className={cls} />;
		case "clipboard": return <ClipboardList className={cls} />;
		case "bot":       return <Bot className={cls} />;
		default:          return <Lightbulb className={cls} />;
	}
}

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
	}),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudioPage() {
	const [activeGame, setActiveGame] = useState<string | null>(null);
	const [filter, setFilter] = useState<Filter>("All");

	const liveCount     = projects.filter((p) => p.status === "Live").length;
	const osCount       = projects.filter((p) => p.category === "Open Source").length;

	const filtered = projects.filter((p) => {
		if (filter === "All")     return true;
		if (filter === "Planned") return p.status === "Planned" || p.status === "Concept";
		return p.status === filter;
	});

	const filterCount = (f: Filter) => {
		if (f === "All")     return projects.length;
		if (f === "Planned") return projects.filter((p) => p.status === "Planned" || p.status === "Concept").length;
		return projects.filter((p) => p.status === f).length;
	};

	return (
		<>
			{/* ── Fullscreen Game Modal ─────────────────────────────────────── */}
			<AnimatePresence>
				{activeGame && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.18 }}
						className="fixed inset-0 z-50 flex flex-col bg-black"
					>
						{/* Slim top bar */}
						<div className="flex items-center justify-between px-5 py-2.5 bg-black/80 border-b border-white/8 backdrop-blur-sm shrink-0">
							<span className="text-xs text-muted-foreground font-medium tracking-wide select-none">
								Arrow keys / WASD to move &nbsp;·&nbsp; Space to jump
							</span>
							<button
								onClick={() => setActiveGame(null)}
								className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 transition-all"
							>
								<X className="w-3.5 h-3.5" />
								Close
							</button>
						</div>
						{/* iframe fills everything below the bar */}
						<iframe
							src={activeGame}
							title="Jumper Game"
							className="w-full flex-1 border-0"
							allow="autoplay; fullscreen"
							loading="lazy"
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Page ─────────────────────────────────────────────────────── */}
			<section className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen">

				{/* Header */}
				<motion.div
					initial="hidden"
					animate="visible"
					className="text-center max-w-3xl mx-auto space-y-4"
				>
					<motion.p
						variants={fadeUp}
						custom={0}
						className="text-sm font-semibold tracking-[0.25em] uppercase text-[#DAA520]/70"
					>
						The Studio
					</motion.p>
					<motion.h1
						variants={fadeUp}
						custom={1}
						className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]"
					>
						Work
					</motion.h1>
					<motion.p
						variants={fadeUp}
						custom={2}
						className="text-base text-muted-foreground font-light leading-relaxed"
					>
						Products, tools, and experiments — designed and shipped independently.
					</motion.p>

					{/* Stats strip */}
					<motion.div
						variants={fadeUp}
						custom={3}
						className="flex items-center justify-center gap-8 pt-2"
					>
						{[
							{ value: liveCount,          label: "Live" },
							{ value: projects.length,    label: "Total" },
							{ value: osCount,            label: "Open Source" },
						].map(({ value, label }, i) => (
							<div key={label} className="flex items-center gap-8">
								{i > 0 && <div className="h-8 w-px bg-border" />}
								<div className="text-center">
									<div className="text-2xl font-bold">{value}</div>
									<div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
								</div>
							</div>
						))}
					</motion.div>
				</motion.div>

				{/* Filter Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.28, duration: 0.4 }}
					className="flex justify-center"
				>
					<div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
						{FILTERS.map((f) => {
							const active = filter === f;
							return (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
										active
											? "bg-[#DAA520] text-black shadow-sm"
											: "text-muted-foreground hover:text-foreground hover:bg-white/5"
									}`}
								>
									{f}
									<span className={`ml-1.5 text-xs font-semibold tabular-nums ${active ? "text-black/55" : "text-muted-foreground/40"}`}>
										{filterCount(f)}
									</span>
								</button>
							);
						})}
					</div>
				</motion.div>

				{/* Project Grid */}
				<AnimatePresence mode="wait">
					<motion.div
						key={filter}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.22 }}
						className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{filtered.map((project, i) => {
							const status  = statusConfig[project.status];
							const isDim   = project.status === "Planned" || project.status === "Concept";
							const isLive  = project.status === "Live";

							return (
								<motion.div
									key={project.id}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
									className="group relative"
								>
									{/* Hover glow — only on live projects */}
									{isLive && (
										<div className="absolute -inset-0.5 bg-linear-to-br from-[#DAA520]/10 to-amber-500/5 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
									)}

									<div
										className={`relative flex flex-col h-full p-6 rounded-2xl border bg-card/60 backdrop-blur-sm transition-all duration-300 ${
											isDim
												? "border-border/40 opacity-60 hover:opacity-75"
												: "border-border hover:border-[#DAA520]/30"
										}`}
									>
										{/* Top row */}
										<div className="flex items-start justify-between mb-4 gap-2">
											<div className="p-2 rounded-lg bg-[#DAA520]/10 border border-[#DAA520]/15 shrink-0">
												<ProjectIcon icon={project.icon} />
											</div>
											<div className="flex items-center gap-1.5 flex-wrap justify-end">
												<span className="text-xs px-2 py-0.5 rounded-md border font-medium text-muted-foreground/60 bg-white/3 border-white/8">
													{project.category}
												</span>
												<span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${status.color}`}>
													<span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${isLive ? "animate-pulse" : ""}`} />
													{project.status}
												</span>
											</div>
										</div>

										{/* Name */}
										<h3 className="text-xl font-bold mb-2 group-hover:text-[#DAA520] transition-colors duration-200">
											{project.name}
										</h3>

										{/* Desc */}
										<p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
											{project.desc}
										</p>

										{/* Tech Tags */}
										<div className="flex flex-wrap gap-1.5 mb-5">
											{project.tech.map((t) => (
												<span
													key={t}
													className="text-xs px-2 py-0.5 rounded-md bg-accent/20 text-muted-foreground border border-border/60"
												>
													{t}
												</span>
											))}
										</div>

										{/* Footer */}
										<div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-auto">
											{project.github && (
												<a
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													aria-label="View source on GitHub"
													className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#DAA520]/25 transition-all"
												>
													<Github className="w-4 h-4 text-muted-foreground group-hover:text-[#DAA520] transition-colors" />
												</a>
											)}

											<div className="ml-auto">
												{project.playable && project.live ? (
													<button
														onClick={() => setActiveGame(project.live!)}
														className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#DAA520] hover:bg-[#DAA520]/85 text-black transition-all active:scale-95"
													>
														<Play className="w-3.5 h-3.5 fill-black" />
														Play Now
													</button>
												) : project.live ? (
													<a
														href={project.live}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-[#DAA520]/30 text-muted-foreground hover:text-[#DAA520] transition-all"
													>
														<ExternalLink className="w-3.5 h-3.5" />
														View Live
													</a>
												) : (
													<span className="text-xs text-muted-foreground/35 italic">
														{project.status === "Concept" ? "Exploring ideas" : "In development"}
													</span>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				</AnimatePresence>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.5 }}
					className="text-center p-8 md:p-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm max-w-3xl mx-auto"
				>
					<h2 className="text-2xl md:text-3xl font-bold mb-3">Want something built?</h2>
					<p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto text-sm">
						Custom tools, websites, or integrations — designed and shipped to production.
					</p>
					<div className="flex justify-center gap-4 flex-wrap">
						<Button
							asChild
							size="lg"
							className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-8 py-6 text-base rounded-xl"
						>
							<Link href="/contact">
								Start a Project <ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="px-8 py-6 text-base rounded-xl border-border hover:border-[#DAA520]/50 hover:text-[#DAA520]"
						>
							<Link href="/services">View Services</Link>
						</Button>
					</div>
				</motion.div>
			</section>
		</>
	);
}
