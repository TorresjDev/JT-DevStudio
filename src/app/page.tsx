// src/app/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Rocket, FileText, ArrowRight, Code2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
	Briefcase,
	Rocket,
	FileText,
};

const services = [
	{
		icon: Code2,
		title: "Web Development",
		desc: "Full-stack Next.js applications with auth, databases, and modern UI.",
	},
	{
		icon: Zap,
		title: "Automation & AI",
		desc: "Scripts, data pipelines, and AI API integrations that save time and money.",
	},
	{
		icon: Shield,
		title: "Tech Consulting",
		desc: "Strategy calls, roadmap sessions, and tech stack guidance for your project.",
	},
];

const featuredProjects = [
	{
		name: "FintelliSense",
		status: "In Progress",
		desc: "AI-powered personal finance and investment platform.",
		href: "/studio",
	},
	{
		name: "JT Dev Studio",
		status: "Live",
		desc: "This platform — a working technology development studio.",
		href: "/studio",
	},
	{
		name: "Trading Bot",
		status: "Planned",
		desc: "Automated trading logic with configurable strategies.",
		href: "/studio",
	},
];

const statusColors: Record<string, string> = {
	Live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
	"In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
	Planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.12, duration: 0.6 },
	}),
};

export default function LandingPage() {
	return (
		<main className="space-y-32 px-4 md:px-10 py-16 text-foreground max-w-7xl mx-auto">
			{/* ═══════════════ HERO ═══════════════ */}
			<section className="text-center pt-8 md:pt-16">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				>
					<p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#DAA520]/80 mb-4">
						Just Technology Development Studio
					</p>
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
						We build{" "}
						<span className="bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
							tools, apps,
						</span>
						<br />
						and experiences that{" "}
						<span className="bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] to-amber-500">
							solve real problems.
						</span>
					</h1>
					<p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
						Freelance web development, original SaaS products, and technology services
						— built with discipline, shipped with care.
					</p>
					<div className="mt-8 flex justify-center gap-4 flex-wrap">
						<Button asChild size="lg" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-8 py-6 text-base rounded-xl">
							<Link href="/contact">
								Let&apos;s Work Together <ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="px-8 py-6 text-base rounded-xl border-border hover:border-[#DAA520]/50 hover:text-[#DAA520]">
							<Link href="/studio">
								View Our Work
							</Link>
						</Button>
					</div>
				</motion.div>
			</section>

			{/* ═══════════════ SERVICES SNAPSHOT ═══════════════ */}
			<section>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="text-center mb-12"
				>
					<motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">
						What We Do
					</motion.h2>
					<motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-lg mx-auto">
						Professional technology services for businesses and creators.
					</motion.p>
				</motion.div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map((service, i) => (
						<motion.div
							key={service.title}
							variants={fadeUp}
							custom={i + 2}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-60px" }}
						>
							<Link
								href="/services"
								className="group block p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/30 hover:shadow-xl hover:shadow-[#DAA520]/5 transition-all duration-300"
							>
								<div className="p-3 rounded-xl bg-[#DAA520]/10 w-fit mb-5 group-hover:bg-[#DAA520]/20 transition-colors">
									<service.icon className="w-7 h-7 text-[#DAA520]" />
								</div>
								<h3 className="text-xl font-bold mb-2 group-hover:text-[#DAA520] transition-colors">
									{service.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{service.desc}
								</p>
							</Link>
						</motion.div>
					))}
				</div>

				<div className="text-center mt-8">
					<Button asChild variant="ghost" className="text-[#DAA520] hover:text-[#DAA520]/80 hover:bg-[#DAA520]/5">
						<Link href="/services">
							View All Services & Pricing <ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</section>

			{/* ═══════════════ FEATURED PROJECTS ═══════════════ */}
			<section>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="text-center mb-12"
				>
					<motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">
						Featured Builds
					</motion.h2>
					<motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-lg mx-auto">
						Original products and tools — designed, built, and shipped by JT Dev Studio.
					</motion.p>
				</motion.div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuredProjects.map((project, i) => (
						<motion.div
							key={project.name}
							variants={fadeUp}
							custom={i + 2}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-60px" }}
						>
							<Link
								href={project.href}
								className="group block p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/30 hover:shadow-xl hover:shadow-[#DAA520]/5 transition-all duration-300 h-full flex flex-col"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xl font-bold group-hover:text-[#DAA520] transition-colors">
										{project.name}
									</h3>
									<span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[project.status]}`}>
										{project.status}
									</span>
								</div>
								<p className="text-muted-foreground text-sm leading-relaxed flex-1">
									{project.desc}
								</p>
								<div className="mt-4 flex items-center text-xs text-muted-foreground group-hover:text-[#DAA520] transition-colors">
									<span>Built by JT</span>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</section>

			{/* ═══════════════ ABOUT THE STUDIO ═══════════════ */}
			<section>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="relative p-8 md:p-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden"
				>
					<div className="absolute -inset-1 bg-linear-to-r from-[#DAA520]/5 to-amber-500/5 rounded-3xl blur-xl"></div>
					<div className="relative max-w-3xl mx-auto text-center">
						<motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-6">
							About the Studio
						</motion.h2>
						<motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg leading-relaxed mb-4">
							JT Dev Studio is a one-person technology company founded by Jesus Torres —
							a U.S. Army veteran (82nd & 173rd Airborne), software developer, and former
							coding bootcamp instructor. The studio offers freelance development services,
							builds original software products, and operates as a launchpad for independent
							tech ventures.
						</motion.p>
						<motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-8">
							We value discipline, reliability, and clear communication —
							and we ship work that speaks for itself.
						</motion.p>
						<motion.div variants={fadeUp} custom={3}>
							<Button asChild variant="outline" className="border-[#DAA520]/30 text-[#DAA520] hover:bg-[#DAA520]/10 rounded-xl px-6 py-5 h-auto">
								<Link href="/profile">
									Meet the Developer <ArrowRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</section>

			{/* ═══════════════ CTA ═══════════════ */}
			<section className="text-center pb-8">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
				>
					<motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">
						Ready to build something?
					</motion.h2>
					<motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-md mx-auto">
						Whether you need a website, a custom tool, or a strategy session —
						let&apos;s talk about what you&apos;re building.
					</motion.p>
					<motion.div variants={fadeUp} custom={2} className="mt-8">
						<Button asChild size="lg" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-10 py-6 text-lg rounded-xl">
							<Link href="/contact">
								Let&apos;s Work Together <ArrowRight className="w-5 h-5 ml-2" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</section>
		</main>
	);
}
