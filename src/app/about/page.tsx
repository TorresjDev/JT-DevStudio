/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getGitHubProfile, getGitHubRepos, getGitHubReadme } from "../services/github";
import { env } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Github, Globe, AlertCircle, FileText, Star, GitFork, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechStackDisplay } from "@/components/tech-stack";


export default async function AboutPage({
	searchParams,
}: {
	searchParams: Promise<{ username?: string }>;
}) {
	const { username: queryUsername } = await searchParams;
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	// Extract GitHub username if available from session
	const sessionUsername = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username;
	
	// Priority: 1. query param, 2. logged in user, 3. creator default
	const githubUsername = queryUsername || sessionUsername || "torresjdev";
	const isCreator = githubUsername === "torresjdev";
	const isSelf = !!sessionUsername && githubUsername === sessionUsername;
	
	let profile = null;
	let repos = [];
	let readmeHtml = null;

	try {
		profile = await getGitHubProfile(githubUsername);
		if (profile) {
			repos = await getGitHubRepos(githubUsername);
			readmeHtml = await getGitHubReadme(githubUsername).catch(() => null);
		}
	} catch (e) {
		console.error("Error fetching github profile:", e);
	}

	return (
		<section
			id="about"
			className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen overflow-y-auto"
		>
			{/* Profile Header */}
			{profile ? (
				<div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 animate-in fade-in zoom-in duration-500">
					<div className="relative group shrink-0">
						<div className="absolute -inset-1 bg-linear-to-r from-[#DAA520] to-yellow-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
						<Image
							src={profile.avatar_url}
							alt="Avatar"
							className="relative rounded-full border-2 border-[#DAA520]/20 shadow-2xl object-cover"
							width={140}
							height={140}
							priority
						/>
					</div>
					
					<div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-2xl">
						<div>
							<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#DAA520] via-yellow-400 to-[#DAA520]">
								{profile.name || profile.login}
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground mt-2 font-light">
								{profile.bio || "Software Developer"}
							</p>
						</div>

						<div className="flex flex-wrap gap-4 items-center">
							<Link
								href={profile.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5 hover:border-[#DAA520]/50"
							>
								<Github className="w-6 h-6 text-[#DAA520]/80 group-hover:text-[#DAA520]" />
							</Link>
							{profile.blog && (
								<Link
									href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5 hover:border-[#DAA520]/50"
								>
									<Globe className="w-6 h-6 text-[#DAA520]/80 group-hover:text-[#DAA520]" />
								</Link>
							)}
							
							{isCreator && (
								<Button asChild size="sm" className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold h-10 px-4 rounded-xl ml-auto md:ml-0">
									<Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
										<FileText className="w-4 h-4 mr-2" />
										Resume
									</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-accent/10 border border-border backdrop-blur-xl animate-in fade-in duration-700">
					<div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
						<AlertCircle className="w-10 h-10 text-[#DAA520]/40" />
					</div>
					<h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Linked</h2>
					<p className="text-muted-foreground text-center max-w-md mb-8">
						Link your GitHub account during login to see your real-time statistics and contributions here.
					</p>
					<Button asChild className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-8">
						<Link href="/login">Connect GitHub</Link>
					</Button>
				</div>
			)}

			{/* Bio Section/Placeholder */}
			<div className="relative p-6 md:p-8 rounded-2xl bg-accent/20 border border-border backdrop-blur-sm shadow-xl">
				<p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light text-center md:text-left">
					<span className="mr-2 text-2xl">💻</span>
					{isSelf ? (
						`Welcome ${profile?.name || githubUsername}! Here is a quick look at your development activity and profile stats directly from GitHub.`
					) : isCreator ? (
						`Welcome to my portfolio! I'm ${profile?.name || "the creator"}. Here's a look at my development activity and projects.`
					) : (
						`Viewing profile for ${profile?.name || githubUsername}. Showcase your own technical footprint by linking your GitHub.`
					)}
				</p>
			</div>

			{/* Work/Projects & GitHub Stats */}
			{profile ? (
				<div className="space-y-16 animate-in slide-in-from-bottom-5 duration-700 delay-200">
					{/* Top Repositories */}
					{repos && repos.length > 0 && (
						<section className="space-y-6">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">Top Repositories</h2>
								<Link href={profile.html_url + "?tab=repositories"} target="_blank" className="text-sm font-medium text-muted-foreground hover:text-[#DAA520] transition-colors flex items-center gap-1">
									View All <ExternalLink className="w-3 h-3" />
								</Link>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{repos.filter((r: any) => !r.fork).slice(0, 6).map((repo: any) => (
									<Link href={repo.html_url} target="_blank" key={repo.id} className="group p-5 rounded-xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/30 hover:shadow-lg hover:shadow-[#DAA520]/5 transition-all duration-300 flex flex-col justify-between h-full">
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
						</section>
					)}

					{/* Stats & Tech Stack Side by Side */}
					<section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">GitHub Activity</h2>
							<div className="relative group overflow-hidden rounded-xl border border-border bg-card/40 p-2 shadow-2xl hover:shadow-[#DAA520]/10 hover:border-[#DAA520]/30 transition-all duration-500">
								<img 
									src={`https://githubcard.com/${profile.login}.svg?d=ej5sfIat`} 
									alt="GitHub Card" 
									className="w-full h-auto object-contain transform group-hover:scale-[1.01] transition-transform duration-500" 
								/>
							</div>

							<div id="github-contributions" className="flex flex-col gap-4 w-full">
								<div className="w-full overflow-hidden rounded-xl border border-border bg-card p-4 shadow-inner hover:bg-accent/10 transition-colors">
									<img
										src={`https://ghchart.rshah.org/DAA520/${profile.login}`}
										alt="GitHub Contributions"
										className="w-full h-auto min-w-[500px] mx-auto opacity-90 hover:opacity-100 transition-opacity"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<h2 className="text-2xl font-bold text-[#DAA520] tracking-wide">Tech Stack</h2>
							{isCreator ? (
								<TechStackDisplay />
							) : (
								<div className="p-6 rounded-xl border border-border bg-card/40 backdrop-blur-sm Prose prose-invert prose-sm max-w-none max-h-[500px] overflow-y-auto shadow-xl">
									{readmeHtml ? (
										<div className="github-readme-content" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
									) : (
										<div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
											<p className="text-sm">Profile README not found or empty.</p>
											<p className="text-xs mt-1">Make sure you have a repository named `{profile.login}` with a README.md</p>
										</div>
									)}
								</div>
							)}
						</div>

					</section>

					{/* Contact Section Footer */}
					{isCreator && (
						<section className="flex flex-col items-center justify-center p-8 rounded-2xl bg-linear-to-b from-accent/10 to-transparent border border-border backdrop-blur-sm text-center space-y-4">
							<h2 className="text-2xl font-bold text-[#DAA520]">Let's Work Together</h2>
							<p className="text-muted-foreground max-w-md">
								Have a project in mind or just want to say hi? I'm always open to discussing new opportunities or tech.
							</p>
							<Button asChild className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold px-6 py-5 h-auto text-base rounded-xl">
								<Link href="/contact" className="flex items-center gap-2">
									<Mail className="w-5 h-5" /> Contact Me
								</Link>
							</Button>
						</section>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 grayscale pointer-events-none">
					<div className="h-48 bg-accent/5 rounded-2xl border border-border flex items-center justify-center">
						<span className="text-sm font-medium">Stats Card Placeholder</span>
					</div>
					<div className="h-48 bg-accent/5 rounded-2xl border border-border flex items-center justify-center">
						<span className="text-sm font-medium">Contribution Chart Placeholder</span>
					</div>
				</div>
			)}
		</section>
	);
}
