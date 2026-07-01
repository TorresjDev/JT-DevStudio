// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="mt-auto bg-transparent bg-blur text-[#C0C0C0]/90 py-8 border-t justify-self-center w-full">
			<div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* About the Studio */}
				<div>
					<h2 className="text-2xl font-bold text-[#DAA520]/90 mb-4">
						JT Dev Studio
					</h2>
					<p>
						<span className="text-[#DAA520]">Just Technology</span> Development
						Studio — building tools, apps, and experiences that solve real
						problems.
					</p>
				</div>

				{/* Navigation */}
				<div className="md:ms-12">
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Navigate</h3>
					<ul className="space-y-2">
						<li>
							<Link href="/" className="hover:text-[#DAA520] transition-colors">
								Home
							</Link>
						</li>
						<li>
							<Link href="/services" className="hover:text-[#DAA520] transition-colors">
								Services
							</Link>
						</li>
						<li>
							<Link href="/studio" className="hover:text-[#DAA520] transition-colors">
								Studio
							</Link>
						</li>
						<li>
							<Link href="/profile" className="hover:text-[#DAA520] transition-colors">
								Profile
							</Link>
						</li>
						<li>
							<Link href="/posts" className="hover:text-[#DAA520] transition-colors">
								Posts
							</Link>
						</li>
					</ul>
				</div>

				{/* Resources */}
				<div>
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Resources</h3>
					<ul className="space-y-2">
						<li>
							<a
								href="https://nextjs.org"
								target="_blank"
					rel="noopener noreferrer"
								className="hover:text-[#DAA520] transition-colors"
							>
								Next.js
							</a>
						</li>
						<li>
							<a
								href="https://tailwindcss.com"
								target="_blank"
					rel="noopener noreferrer"
								className="hover:text-[#DAA520] transition-colors"
							>
								Tailwind CSS
							</a>
						</li>
						<li>
							<a
								href="https://supabase.com"
								target="_blank"
					rel="noopener noreferrer"
								className="hover:text-[#DAA520] transition-colors"
							>
								Supabase
							</a>
						</li>
						<li>
							<a
								href="https://vercel.com"
								target="_blank"
					rel="noopener noreferrer"
								className="hover:text-[#DAA520] transition-colors"
							>
								Vercel
							</a>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Contact</h3>
					<p className="text-gray-400">
						Have a project or want to work together?
					</p>
					<p className="mt-2">
						<a
							href="mailto:j.torres3.dev@gmail.com"
							className="hover:text-[#DAA520] transition-colors"
						>
							j.torres3.dev@gmail.com
						</a>
					</p>
					<Link
						href="/contact"
						className="mt-2 inline-block text-sm text-[#DAA520] hover:text-[#DAA520]/80 transition-colors"
					>
						→ Send a project inquiry
					</Link>

					<h3 className="font-bold text-[#DAA520]/90 mb-3 my-3">Connect</h3>
					<div className="flex space-x-4 ">
						<a
							href="https://github.com/TorresjDev"
							target="_blank"
					rel="noopener noreferrer"
							aria-label="GitHub"
						>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/social/github.svg"
								alt="GitHub"
								className="hover:w-[26px] transition-all"
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
								className="hover:w-[26px] transition-all"
								width={24}
								height={24}
							></Image>
						</a>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="text-center text-[#C0C0C0]/60 mt-3 space-y-1">
				<p>
					&nbsp; &copy; {new Date().getFullYear()} JT Dev Studio. All rights reserved.
				</p>
				<div className="flex justify-center gap-4 text-xs">
					<Link href="/privacy-policy" className="hover:text-[#DAA520] transition-colors">
						Privacy Policy
					</Link>
					<Link href="/terms" className="hover:text-[#DAA520] transition-colors">
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
