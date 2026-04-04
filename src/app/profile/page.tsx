/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getGitHubProfile, getGitHubRepos } from "../services/github";
import { env } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";
import { Github, Globe, FileText, Star, GitFork, Mail, ExternalLink, Shield, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechStackDisplay } from "@/components/tech-stack";

const timeline = [
	{
		role: "U.S. Army — Airborne Infantry",
		org: "82nd Airborne Division · 173rd Airborne Brigade (1-503 PIR, Vicenza, Italy)",
		icon: Shield,
		period: "Military Service",
	},
	{
		role: "Coding Bootcamp Instructor",
		org: "Teaching full-stack web development",
		icon: GraduationCap,
		period: "Education",
	},
	{
		role: "CIS Tutor",
		org: "West Texas A&M University",
		icon: GraduationCap,
		period: "Education",
	},
	{
		role: "President — BuffTeks",
		org: "West Texas A&M University Computer Science Club",
		icon: Briefcase,
		period: "Leadership",
	},
	{
		role: "Founder — JT Dev Studio",
		org: "Just Technology Development Studio · Freelance & SaaS",
		icon: Briefcase,
		period: "Current",
	},
];

const highlightProjects = [
	{
		name: "FintelliSense",
		desc: "AI-powered personal finance and investment platform built with Next.js, Python, and Gemini.",
		status: "In Progress",
		href: "/studio",
	},
	{
		name: "JT Dev Studio",
		desc: "This platform — a working technology development studio with auth, UGC, payments, and more.",
		status: "Live",
		href: "/",
	},
];

const statusColors: Record<string, string> = {
	Live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
	"In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default async function ProfilePage() {
	const githubUsername = env.NEXT_GITHUB_USERNAME || "torresjdev";

	let profile = null;
	let repos: any[] = [];

	try {
		profile = await getGitHubProfile(githubUsername);
		if (profile) {
			repos = await getGitHubRepos(githubUsername);
		}
	} catch (e) {
		console.error("Error fetching github profile:", e);
	}

	return (
		<section
			id="profile"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-16 min-h-screen overflow-y-auto"
		>
			{/* ═══════════════ PROFILE HEADER ═══════════════ */}
			<div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 animate-in fade-in zoom-in duration-500">
				{profile && (
					<div className="relative group shrink-0">
						<div className="absolute -inset-1.5 bg-linear-to-r from-[#DAA520] to-amber-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
						<Image
							src={profile.avatar_url}
							alt="Jesus Torres"
							className="relative rounded-full border-2 border-[#DAA520]/20 shadow-2xl object-cover"
							width={160}
							height={160}
							priority
						/>
					</div>
				)}

				<div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-2xl">
					<div>
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
							Jesus Torres
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground mt-2 font-light">
							Full-Stack Developer · U.S. Army Veteran · Studio Founder
						</p>
					</div>

					<p className="text-muted-foreground leading-relaxed max-w-xl">
						I build web applications, SaaS tools, and automation systems for businesses and personal projects.
						Former Airborne Infantry (82nd & 173rd), coding bootcamp instructor, and computer science club president.
						I value discipline, clear communication, and shipping work that speaks for itself.
					</p>

					<div className="flex flex-wrap gap-3 items-center">
						{profile && (
							<Link
								href={profile.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5 hover:border-[#DAA520]/50"
							>
								<Github className="w-5 h-5 text-[#DAA520]/80" />
							</Link>
						)}
						{profile?.blog && (
							<Link
								href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5 hover:border-[#DAA520]/50"
							>
								<Globe className="w-5 h-5 text-[#DAA520]/80" />
							</Link>
						)}

						<Button asChild size="sm" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold h-10 px-4 rounded-xl">
							<Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
								<FileText className="w-4 h-4 mr-2" />
								Resume
							</Link>
						</Button>

						<Button asChild size="sm" variant="outline" className="h-10 px-4 rounded-xl border-[#DAA520]/30 text-[#DAA520] hover:bg-[#DAA520]/10">
							<Link href="/contact">
								<Mail className="w-4 h-4 mr-2" />
								Hire Me
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* ═══════════════ TECH STACK ═══════════════ */}
			<section className="space-y-6 animate-in slide-in-from-bottom-5 duration-700 delay-100">
				<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">Tech Stack</h2>
				<div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-xl">
					<TechStackDisplay />
				</div>
			</section>

			{/* ═══════════════ EXPERIENCE TIMELINE ═══════════════ */}
			<section className="space-y-6 animate-in slide-in-from-bottom-5 duration-700 delay-200">
				<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">Experience</h2>
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-[19px] top-0 bottom-0 w-px bg-border"></div>

					<div className="space-y-6">
						{timeline.map((item, i) => (
							<div key={i} className="flex gap-4 relative group">
								<div className="relative z-10 p-2 rounded-xl bg-card border border-border group-hover:border-[#DAA520]/30 transition-colors shrink-0">
									<item.icon className="w-5 h-5 text-[#DAA520]" />
								</div>
								<div className="pb-6">
									<div className="flex items-center gap-3 flex-wrap">
										<h3 className="font-bold text-foreground group-hover:text-[#DAA520] transition-colors">
											{item.role}
										</h3>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/20 text-muted-foreground">
											{item.period}
										</span>
									</div>
									<p className="text-sm text-muted-foreground mt-1">{item.org}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════ HIGHLIGHT PROJECTS ═══════════════ */}
			<section className="space-y-6 animate-in slide-in-from-bottom-5 duration-700 delay-300">
				<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">Featured Projects</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{highlightProjects.map((project) => (
						<Link
							key={project.name}
							href={project.href}
							className="group p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/30 hover:shadow-lg hover:shadow-[#DAA520]/5 transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-bold text-lg group-hover:text-[#DAA520] transition-colors">
									{project.name}
								</h3>
								<span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[project.status]}`}>
									{project.status}
								</span>
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
						</Link>
					))}
				</div>
			</section>

			{/* ═══════════════ GITHUB ACTIVITY ═══════════════ */}
			{profile && (
				<section className="space-y-6 animate-in slide-in-from-bottom-5 duration-700 delay-400">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">GitHub Activity</h2>
						<Link
							href={profile.html_url + "?tab=repositories"}
							target="_blank"
							className="text-sm font-medium text-muted-foreground hover:text-[#DAA520] transition-colors flex items-center gap-1"
						>
							View All <ExternalLink className="w-3 h-3" />
						</Link>
					</div>

					{/* Contributions Chart */}
					<div className="w-full overflow-hidden rounded-xl border border-border bg-card/40 p-4 shadow-inner hover:bg-accent/10 transition-colors">
						<img
							src={`https://ghchart.rshah.org/DAA520/${profile.login}`}
							alt="GitHub Contributions"
							className="w-full h-auto min-w-[500px] mx-auto opacity-90 hover:opacity-100 transition-opacity"
						/>
					</div>

					{/* Top Repos */}
					{repos && repos.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{repos.filter((r: any) => !r.fork).slice(0, 6).map((repo: any) => (
								<Link
									href={repo.html_url}
									target="_blank"
									key={repo.id}
									className="group p-5 rounded-xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/30 hover:shadow-lg hover:shadow-[#DAA520]/5 transition-all duration-300 flex flex-col justify-between h-full"
								>
									<div className="space-y-2">
										<h3 className="font-bold text-lg group-hover:text-[#DAA520] transition-colors truncate">
											{repo.name}
										</h3>
										<p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] text-left">
											{repo.description || "No description provided."}
										</p>
									</div>
									<div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {repo.stargazers_count}
										</span>
										<span className="flex items-center gap-1">
											<GitFork className="w-4 h-4 text-blue-500" /> {repo.forks_count}
										</span>
										{repo.language && (
											<span className="ml-auto px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
												{repo.language}
											</span>
										)}
									</div>
								</Link>
							))}
						</div>
					)}
				</section>
			)}

			{/* ═══════════════ CTA ═══════════════ */}
			<section className="flex flex-col items-center justify-center p-8 rounded-2xl bg-linear-to-b from-accent/10 to-transparent border border-border backdrop-blur-sm text-center space-y-4">
				<h2 className="text-2xl font-bold text-[#DAA520]">Let&apos;s Work Together</h2>
				<p className="text-muted-foreground max-w-md">
					Have a project in mind or want to discuss an opportunity? I&apos;m always open to new collaborations.
				</p>
				<Button asChild className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-6 py-5 h-auto text-base rounded-xl">
					<Link href="/contact" className="flex items-center gap-2">
						<Mail className="w-5 h-5" /> Get In Touch
					</Link>
				</Button>
			</section>
		</section>
	);
}
