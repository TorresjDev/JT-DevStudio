import { Metadata } from "next";
import { DonationsJar } from "@/components/donations/DonationsJar";

export const metadata: Metadata = {
	title: "Support | Jesus Torres - Developer",
	description:
		"Support my development journey with a donation. Every contribution helps me continue building amazing projects and sharing knowledge with the community.",
};

export default function SupportPage() {
	return (
		<div className="min-h-screen">
			<div className="page-container py-8">
				{/* Hero Section */}
				<div className="text-center mb-10 sm:mb-12">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Support My Journey 🚀
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
						Your support helps me continue developing open-source projects,
						creating educational content, and sharing knowledge with the
						developer community. Every contribution, no matter the size, makes a
						meaningful difference.
					</p>
				</div>

				{/* Donation + Impact */}
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
						{/* Jar */}
						<div className="lg:col-span-5">
							<div className="animate-fade-slide-up">
								<DonationsJar />
							</div>
						</div>

						{/* Supporting content */}
						<div className="lg:col-span-7">
							<h2 className="text-2xl font-semibold text-foreground mb-6 text-center lg:text-left">
								How Your Support Helps 💖
							</h2>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
								<div className="ui-surface hover-lift animate-fade-slide-up bg-card border border-border rounded-lg p-6 text-center">
									<div className="text-3xl mb-3">🛠️</div>
									<h3 className="font-semibold text-foreground mb-2">
										Open Source Projects
									</h3>
									<p className="text-sm text-muted-foreground">
										Supporting the development and maintenance of free, open-source
										tools and libraries.
									</p>
								</div>

								<div className="ui-surface hover-lift animate-fade-slide-up bg-card border border-border rounded-lg p-6 text-center [animation-delay:80ms]">
									<div className="text-3xl mb-3">📚</div>
									<h3 className="font-semibold text-foreground mb-2">
										Educational Content
									</h3>
									<p className="text-sm text-muted-foreground">
										Creating tutorials, guides, and documentation to help other
										developers learn and grow.
									</p>
								</div>

								<div className="ui-surface hover-lift animate-fade-slide-up bg-card border border-border rounded-lg p-6 text-center md:col-span-2 lg:col-span-1 [animation-delay:160ms]">
									<div className="text-3xl mb-3">🌟</div>
									<h3 className="font-semibold text-foreground mb-2">
										Community Building
									</h3>
									<p className="text-sm text-muted-foreground">
										Contributing to developer communities and helping others solve
										coding challenges.
									</p>
								</div>
							</div>

							<div className="text-center lg:text-left">
								<p className="text-muted-foreground mb-6">
									🙏 Thank you for considering supporting my work. Your generosity
									enables me to dedicate more time to creating valuable resources
									for the developer community.
								</p>

								<div className="ui-surface hover-lift bg-card border border-border rounded-lg p-6">
									<h3 className="font-semibold text-foreground mb-3">
										✨ Recent Projects You&apos;re Supporting:
									</h3>
									<ul className="text-sm text-muted-foreground space-y-1 text-left max-w-md lg:max-w-none lg:mx-0 mx-auto">
										<li>• Next.js portfolio with user-generated content</li>
										<li>• Educational blog posts and tutorials</li>
										<li>• Git/GitHub best practices documentation</li>
										<li>• Database design and ERD tutorials</li>
										<li>• Open-source component libraries</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
