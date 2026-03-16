// components/Footer.js
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="mt-auto bg-transparent bg-blur text-[#C0C0C0]/90 py-8 border-t-1 justify-self-center w-full">
			{/* Footer Content */}
			<div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* About Me Section */}
				<div>
					<h2 className="text-2xl font-bold text-[#DAA520]/90 mb-4">
						About Me
					</h2>
					<p>
						Hi, I’m <span className=" text-[#DAA520]">Jesus Torres</span>, a
						software developer passionate about creating modern web and mobile
						applications. Explore my work and connect with me to learn more.
					</p>
				</div>

				{/* Navigation Section */}
				<div className="ms-12">
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Navigate</h3>
					<ul className="space-y-2">
						<li>
							<Link href="/" className="hover:text-[#DAA520]">
								Home
							</Link>
						</li>
						<li>
							<a
								href="https://tiny.cc/Jtorres_dev"
								target="_blank"
								className="hover:text-[#DAA520]"
							>
								Portfolio
							</a>
						</li>
						{/* <li>
							<a href="/blog" className="hover:text-[#DAA520]">
								Blog
							</a>
						</li>
						<li>
							<a href="/contact" className="hover:text-[#DAA520]">
								Contact
							</a>
						</li> */}
					</ul>
				</div>

				{/* Resources Section */}
				<div>
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Resources</h3>
					<ul className="space-y-2">
						<li>
							<a
								href="https://nextjs.org"
								target="_blank"
								className="hover:text-[#DAA520]"
							>
								Next.js
							</a>
						</li>
						<li>
							<a
								href="https://tailwindcss.com"
								target="_blank"
								className="hover:text-[#DAA520]"
							>
								Tailwind CSS
							</a>
						</li>
						<li>
							<a
								href="https://reactjs.org"
								target="_blank"
								className="hover:text-[#DAA520]"
							>
								React
							</a>
						</li>
						<li>
							<a
								href="https://developer.mozilla.org"
								target="_blank"
								className="hover:text-[#DAA520]"
							>
								MDN Web Docs
							</a>
						</li>
					</ul>
				</div>

				{/* Contact Section */}
				<div>
					<h3 className="font-bold text-[#DAA520]/90 mb-3">Contact</h3>
					<p className="text-gray-400">
						Have a question or want to work together?
					</p>
					<p className="mt-2">
						<a
							href="mailto:jtorres3.dev@gmail.com"
							className="hover:text-[#DAA520]"
						>
							jtorres3.dev@gmail.com
						</a>
					</p>

					<h3 className="font-bold text-[#DAA520]/90 mb-3 my-3">Connect</h3>
					<div className="flex space-x-4 ">
						{/* Social Media Icons */}
						<a
							href="https://github.com/TorresjDev"
							target="_blank"
							aria-label="GitHub"
						>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/social/github.svg"
								alt="github-image"
								className="hover:w-[26px]"
								width={24}
								height={24}
							></Image>
						</a>
						<a
							href="https://linkedin.com/in/torresjdev"
							target="_blank"
							aria-label="LinkedIn"
						>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/social/linkedIn.svg"
								alt="github-image"
								className="hover:w-[26px]"
								width={24}
								height={24}
							></Image>
						</a>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="text-center text-[#C0C0C0]-500 mt-3">
				<p>
					&nbsp; &copy; {new Date().getFullYear()} Jesus Torres. All rights
					reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
