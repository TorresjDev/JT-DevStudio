// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="mt-auto bg-transparent text-muted-foreground py-8 border-t justify-self-center w-full">
			<div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* About the Studio */}
				<div>
					<h2 className="text-2xl font-bold text-goldenrod-dark dark:text-goldenrod/90 mb-4">
						JT Dev Studio
					</h2>
					<p>
						<span className="text-goldenrod-dark dark:text-goldenrod">
							Just Technology
						</span>{" "}
						Development Studio — building tools, apps, and experiences that
						solve real problems.
					</p>
					<p className="mt-2 text-sm text-muted-foreground/80">
						Founded and built by Jesus Torres.
					</p>
				</div>

				{/* Navigation */}
				<div className="md:ms-12">
					<h3 className="font-bold text-goldenrod-dark dark:text-goldenrod/90 mb-3">
						Navigate
					</h3>
					<ul className="space-y-2">
						<li>
							<Link href="/" className="hover-gold">
								Home
							</Link>
						</li>
						<li>
							<Link href="/services" className="hover-gold">
								Services
							</Link>
						</li>
						<li>
							<Link href="/studio" className="hover-gold">
								Studio
							</Link>
						</li>
						<li>
							<Link href="/profile" className="hover-gold">
								Profile
							</Link>
						</li>
						<li>
							<Link href="/posts" className="hover-gold">
								Posts
							</Link>
						</li>
					</ul>
				</div>

				{/* Resources */}
				<div>
					<h3 className="font-bold text-goldenrod-dark dark:text-goldenrod/90 mb-3">
						Resources
					</h3>
					<ul className="space-y-2">
						<li>
							<a
								href="https://nextjs.org"
								target="_blank"
								rel="noopener noreferrer"
								className="hover-gold"
							>
								Next.js
							</a>
						</li>
						<li>
							<a
								href="https://tailwindcss.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover-gold"
							>
								Tailwind CSS
							</a>
						</li>
						<li>
							<a
								href="https://supabase.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover-gold"
							>
								Supabase
							</a>
						</li>
						<li>
							<a
								href="https://vercel.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover-gold"
							>
								Vercel
							</a>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h3 className="font-bold text-goldenrod-dark dark:text-goldenrod/90 mb-3">
						Contact
					</h3>
					<p className="text-muted-foreground/90">
						Have a project or want to work together?
					</p>
					<p className="mt-2">
						<a href="mailto:j.torres3.dev@gmail.com" className="hover-gold">
							j.torres3.dev@gmail.com
						</a>
					</p>
					<Link
						href="/contact"
						className="mt-2 inline-block text-sm text-goldenrod-dark dark:text-goldenrod hover:opacity-80 transition-opacity"
					>
						→ Send a project inquiry
					</Link>

					<h3 className="font-bold text-goldenrod-dark dark:text-goldenrod/90 mb-3 my-3">
						Connect
					</h3>
					<div className="flex space-x-4">
						<a
							href="https://github.com/TorresjDev"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
						>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/social/github.svg"
								alt="GitHub"
								className="invert dark:invert-0 hover:scale-110 transition-transform"
								width={24}
								height={24}
							></Image>
						</a>
						<a
							href="https://linkedin.com/in/torresjdev"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
						>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/social/linkedIn.svg"
								alt="LinkedIn"
								className="invert dark:invert-0 hover:scale-110 transition-transform"
								width={24}
								height={24}
							></Image>
						</a>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="text-center text-muted-foreground/70 mt-3 space-y-1">
				<p>
					&nbsp; &copy; {new Date().getFullYear()} JT Dev Studio. All rights
					reserved.
				</p>
				<div className="flex justify-center gap-4 text-xs">
					<Link href="/privacy-policy" className="hover-gold">
						Privacy Policy
					</Link>
					<Link href="/terms" className="hover-gold">
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
