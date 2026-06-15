/* eslint-disable @next/next/no-img-element */
import React from "react";

const TECH_STACK = [
	{
		category: "Languages",
		icon: "✍️",
		items: [
			{ name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
			{ name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
			{ name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
			{ name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
			{ name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
			{ name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
			{ name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
		],
	},
	{
		category: "Frameworks & Libraries",
		icon: "💿",
		items: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
			{ name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
			{ name: ".NET Core", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" },
			{ name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
			{ name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
			{ name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
			{ name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
			{ name: "Matplotlib", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" },
		],
	},
	{
		category: "Tools & Platforms",
		icon: "🛠️",
		items: [
			{ name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
			{ name: "SQL Server", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
			{ name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
			{ name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
			{ name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
			{ name: "Visual Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" },
			{ name: "Android Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg" },
			{ name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
			{ name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
		],
	},
];

export function TechStackDisplay() {
	return (
		<div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
			{TECH_STACK.map((category) => (
				<div key={category.category} className="space-y-4">
					<div className="flex items-center gap-2 sticky top-0 bg-background/80 backdrop-blur-md py-1 z-10">
						<span className="text-xl">{category.icon}</span>
						<h3 className="text-sm font-bold text-[#DAA520]/90 tracking-wider">
							{category.category.toUpperCase()}
						</h3>
					</div>
					<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
						{category.items.map((item) => (
							<div
								key={item.name}
								className="group flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card/40 backdrop-blur-sm hover:border-[#DAA520]/40 hover:shadow-lg hover:shadow-[#DAA520]/5 transition-all duration-300 transform hover:-translate-y-1"
							>
								<div className="relative w-10 h-10 mb-2 flex items-center justify-center">
									<img
										src={item.icon}
										alt={item.name}
										className="max-w-full max-h-full object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(218,165,32,0.3)] transition-all duration-300"
										loading="lazy"
									/>
								</div>
								<span className="text-[10px] sm:text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center truncate w-full">
									{item.name}
								</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
