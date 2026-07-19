/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getGitHubProfile, getTopReposByStars } from "../services/github";
import { env } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";
import { Github, Globe, Star, GitFork, Mail, ExternalLink, Shield, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechStackDisplay } from "@/components/tech-stack";
import { ResumeDownloadButton } from "@/components/profile/ResumeDownloadButton";

type GithubProfile = {
	avatar_url: string;
	html_url: string;
	login?: string;
	blog?: string | null;
	public_repos?: number;
	followers?: number;
	following?: number;
};

type GithubRepo = {
	id: number;
	html_url: string;
	name: string;
	description?: string | null;
	stargazers_count?: number;
	forks_count?: number;
	language?: string | null;
};

const timeline = [
	{
		role: "Founder — JT Dev Studio",
		org: "Just Technology Development Studio · Freelance & SaaS",
		detail:
			"Building web apps, SaaS tools, and automation systems for clients and original products.",
		icon: Briefcase,
		period: "2025 – Present",
	},
	{
		role: "President — BuffTeks",
		org: "Computer Science Organization · West Texas A&M University",
		detail:
			"Lead the university's CS organization, running events, workshops, and team projects.",
		icon: Briefcase,
		period: "2025 – Present",
	},
	{
		role: "Computer Information Systems Tutor",
		org: "West Texas A&M University · Canyon, TX",
		detail:
			"Mentor 20+ students per semester in Python, SQL, JavaScript, and database systems.",
		icon: GraduationCap,
		period: "2024 – Present",
	},
	{
		role: "Software Engineer Instructor",
		org: "Sabio Enterprises Inc. · Remote",
		detail:
			"Instructed 40+ junior developers in C#, JavaScript, React, SQL Server, and REST APIs.",
		icon: GraduationCap,
		period: "2022 – 2023",
	},
	{
		role: "Software Engineer",
		org: "The Institute to Advance Diversity · Irvine, CA",
		detail:
			"Shipped full-stack features with React, Redux, and ASP.NET Core on a 16+ member agile team.",
		icon: Briefcase,
		period: "2022",
	},
	{
		role: "Team Leader — Airborne Paratrooper",
		org: "U.S. Army · 82nd Airborne Division & 173rd Airborne Brigade (Vicenza, Italy)",
		detail:
			"Led a 9-person airborne team across NATO operations in 4 countries. Earned 7 Army Achievement Medals.",
		icon: Shield,
		period: "2016 – 2018",
	},
];

export default async function ProfilePage() {
	const githubUsername = env.NEXT_GITHUB_USERNAME || "torresjdev";

	let profile = null;
	let repos: GithubRepo[] = [];

	try {
		profile = (await getGitHubProfile(githubUsername)) as GithubProfile;
		if (profile) {
			repos = (await getTopReposByStars(githubUsername, 6)) as GithubRepo[];
		}
	} catch (e) {
		console.error("Error fetching github profile:", e);
	}

	const featuredRepos = repos.slice(0, 4);

	return (
		<section
			id="profile"
			className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 md:py-8 md:px-8 space-y-8 md:space-y-10 overflow-x-hidden"
		>
			{/* ═══════════════ PROFILE HEADER ═══════════════ */}
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 animate-in fade-in zoom-in duration-500">
				{profile && (
					<div className="relative group shrink-0">
						<div className="absolute -inset-1.5 bg-linear-to-r from-[#DAA520] to-amber-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
						<Image
							src={profile.avatar_url}
							alt="Jesus Torres"
							className="relative rounded-full border-2 border-goldenrod/30 shadow-2xl object-cover"
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
						Former Army paratrooper (82nd &amp; 173rd Airborne), software engineering instructor, and computer science club president.
						I value discipline, clear communication, and shipping work that speaks for itself.
					</p>

					<div className="flex flex-wrap gap-3 items-center">
						{profile && (
							<Link
								href={profile.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-full bg-muted/60 hover:bg-muted hover:scale-110 transition-all duration-300 border border-border hover:border-goldenrod/50"
							>
								<Github className="w-5 h-5 text-goldenrod-dark/90 dark:text-goldenrod/80" />
							</Link>
						)}
						{profile?.blog && (
							<Link
								href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-full bg-muted/60 hover:bg-muted hover:scale-110 transition-all duration-300 border border-border hover:border-goldenrod/50"
							>
								<Globe className="w-5 h-5 text-goldenrod-dark/90 dark:text-goldenrod/80" />
							</Link>
						)}

						<ResumeDownloadButton />

						<Button asChild size="sm" variant="outline" className="h-10 px-4 rounded-xl border-goldenrod/40 text-goldenrod-dark dark:text-goldenrod hover:bg-goldenrod/10">
							<Link href="/contact">
								<Mail className="w-4 h-4 mr-2" />
								Hire Me
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* ═══════════════ TECH STACK ═══════════════ */}
			<section className="space-y-4 animate-in slide-in-from-bottom-5 duration-700 delay-100">
				<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod tracking-wide">Tech Stack</h2>
				<div className="p-4 md:p-5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-xl">
					<TechStackDisplay />
				</div>
			</section>

			{/* ═══════════════ EXPERIENCE TIMELINE ═══════════════ */}
			<section className="space-y-4 animate-in slide-in-from-bottom-5 duration-700 delay-200">
				<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod tracking-wide">Experience</h2>
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-[19px] top-0 bottom-0 w-px bg-border"></div>

					<div className="space-y-3">
						{timeline.map((item, i) => (
							<div key={i} className="flex gap-3 sm:gap-4 relative group">
								<div className="relative z-10 p-2 rounded-xl bg-card border border-border group-hover:border-goldenrod/30 transition-colors shrink-0 h-fit">
									<item.icon className="w-5 h-5 text-goldenrod-dark dark:text-goldenrod" />
								</div>
								<div className="pb-3 min-w-0">
									<div className="flex items-start sm:items-center gap-x-3 gap-y-1 flex-wrap">
										<h3 className="font-bold text-foreground group-hover:text-goldenrod-dark dark:group-hover:text-goldenrod transition-colors">
											{item.role}
										</h3>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/20 text-muted-foreground whitespace-nowrap">
											{item.period}
										</span>
									</div>
									<p className="text-sm font-medium text-foreground/80 mt-1 break-words">{item.org}</p>
									{item.detail && (
										<p className="text-sm text-muted-foreground mt-1.5 leading-relaxed break-words">
											{item.detail}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════ FEATURED PROJECTS (top repos by stars) ═══════════════ */}
			{featuredRepos.length > 0 && (
				<section className="space-y-4 animate-in slide-in-from-bottom-5 duration-700 delay-300">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod tracking-wide">Featured Projects</h2>
							<p className="text-sm text-muted-foreground mt-1">My most-starred repositories on GitHub.</p>
						</div>
						{profile && (
							<Link
								href={profile.html_url + "?tab=repositories"}
								target="_blank"
								className="text-sm font-medium text-muted-foreground hover:text-goldenrod-dark dark:hover:text-goldenrod transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
							>
								View All <ExternalLink className="w-3 h-3" />
							</Link>
						)}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{featuredRepos.map((repo) => (
							<Link
								key={repo.id}
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="group p-5 sm:p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-goldenrod/30 hover:shadow-lg hover:shadow-goldenrod/5 transition-all duration-300 flex flex-col justify-between gap-4 h-full"
							>
								<div className="space-y-2 min-w-0">
									<div className="flex items-center justify-between gap-3">
										<h3 className="font-bold text-lg group-hover:text-goldenrod-dark dark:group-hover:text-goldenrod transition-colors truncate">
											{repo.name}
										</h3>
										<ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-goldenrod-dark dark:group-hover:text-goldenrod transition-colors shrink-0" />
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
										{repo.description || "No description provided."}
									</p>
								</div>
								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {repo.stargazers_count}
									</span>
									<span className="flex items-center gap-1">
										<GitFork className="w-4 h-4 text-primary" /> {repo.forks_count}
									</span>
									{repo.language && (
										<span className="ml-auto px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground truncate max-w-[45%]">
											{repo.language}
										</span>
									)}
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* ═══════════════ GITHUB ACTIVITY ═══════════════ */}
			{profile && (
				<section className="space-y-4 animate-in slide-in-from-bottom-5 duration-700 delay-400">
					<div className="flex justify-between items-center gap-4">
						<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod tracking-wide">GitHub Activity</h2>
						<Link
							href={profile.html_url}
							target="_blank"
							className="text-sm font-medium text-muted-foreground hover:text-goldenrod-dark dark:hover:text-goldenrod transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
						>
							View Profile <ExternalLink className="w-3 h-3" />
						</Link>
					</div>

					{/* Profile stats */}
					<div className="grid grid-cols-3 gap-3 sm:gap-4">
						{[
							{ label: "Repositories", value: profile.public_repos },
							{ label: "Followers", value: profile.followers },
							{ label: "Following", value: profile.following },
						].map((stat) => (
							<div
								key={stat.label}
								className="rounded-xl border border-border bg-card/40 p-4 text-center hover:border-goldenrod/30 transition-colors"
							>
								<p className="text-2xl sm:text-3xl font-extrabold text-goldenrod-dark dark:text-goldenrod">{stat.value ?? 0}</p>
								<p className="text-[11px] sm:text-xs text-muted-foreground mt-1 tracking-wide">{stat.label}</p>
							</div>
						))}
					</div>

					{/* Contributions Chart — scrolls within its own card on small screens */}
					<div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-border bg-card/40 p-4 shadow-inner hover:bg-accent/10 transition-colors">
						<img
							src={`https://ghchart.rshah.org/DAA520/${profile.login}`}
							alt="GitHub Contributions"
							className="h-auto min-w-[560px] w-full opacity-90 hover:opacity-100 transition-opacity"
						/>
					</div>
				</section>
			)}

			{/* ═══════════════ CTA ═══════════════ */}
			<section className="flex flex-col items-center justify-center p-6 rounded-2xl bg-linear-to-b from-accent/10 to-transparent border border-border backdrop-blur-sm text-center space-y-4">
				<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod">Let&apos;s Work Together</h2>
				<p className="text-muted-foreground max-w-md">
					Have a project in mind or want to discuss an opportunity? I&apos;m always open to new collaborations.
				</p>
				<Button asChild className="btn-gold font-bold px-6 py-5 h-auto text-base rounded-xl">
					<Link href="/contact" className="flex items-center gap-2">
						<Mail className="w-5 h-5" /> Get In Touch
					</Link>
				</Button>
			</section>
		</section>
	);
}
