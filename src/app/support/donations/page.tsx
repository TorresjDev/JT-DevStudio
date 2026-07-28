import { Metadata } from "next";
import { BookOpen, Code2, HeartHandshake, ShieldCheck } from "lucide-react";
import { DonationsJar } from "@/components/donations/DonationsJar";

export const metadata: Metadata = {
	title: "Support | Jesus Torres - Developer",
	description:
		"Support Jesus Torres's open-source development, educational resources, and community work through a secure donation.",
};

export default function SupportPage() {
	return (
		<main className="min-h-screen">
			<div className="page-container py-5 sm:py-7 lg:py-8">
				<div className="mx-auto max-w-5xl">
					<header className="mb-5 text-center sm:mb-6">
						<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Support independent development
						</h1>
						<p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
							Donate directly to Jesus Torres through secure, trusted payment
							processors. Your card details are never stored on this site.
						</p>
						<div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
							<ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
							Secure checkout · Clear purpose · No recurring charge
						</div>
					</header>

					<div className="animate-fade-slide-up">
						<DonationsJar />
					</div>

					<section aria-labelledby="impact-heading" className="mt-5 sm:mt-6">
						<h2 id="impact-heading" className="sr-only">
							How your support helps
						</h2>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5">
								<Code2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
								<div>
									<h3 className="text-sm font-semibold text-foreground">Open source</h3>
									<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
										Free tools and component libraries.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5">
								<BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
								<div>
									<h3 className="text-sm font-semibold text-foreground">Education</h3>
									<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
										Tutorials, guides, and documentation.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5">
								<HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
								<div>
									<h3 className="text-sm font-semibold text-foreground">Community</h3>
									<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
										Practical help for fellow developers.
									</p>
								</div>
							</div>
						</div>
					</section>
					<p className="mt-4 text-center text-xs text-muted-foreground">
						Thank you for helping me create useful, accessible developer resources.
					</p>
				</div>
			</div>
		</main>
	);
}
