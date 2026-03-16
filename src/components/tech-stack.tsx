/* eslint-disable @next/next/no-img-element */
import React from "react";

const TECH_STACK = [
	{
		category: "Languages",
		icon: "✍️",
		items: [
			{ name: "Python", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/py.svg" },
			{ name: "C#", icon: "https://profilinator.rishav.dev/skills-assets/csharp-original.svg" },
			{ name: "TypeScript", icon: "https://profilinator.rishav.dev/skills-assets/typescript-original.svg" },
			{ name: "JavaScript", icon: "https://profilinator.rishav.dev/skills-assets/javascript-original.svg" },
			{ name: "HTML5", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/html.svg" },
			{ name: "CSS3", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/css.svg" },
			{ name: "Kotlin", icon: "https://profilinator.rishav.dev/skills-assets/kotlinlang-icon.svg" },
		],
	},
	{
		category: "Frameworks & Libraries",
		icon: "💿",
		items: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
			{ name: "React", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/react.svg" },
			{ name: ".NET Core", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/dotnet.svg" },
			{ name: "Node.js", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/nodejs.svg" },
			{ name: "Tailwind CSS", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/tail.svg" },
			{ name: "Bootstrap", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/bootstrap.svg" },
			{ name: "NumPy", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/numpy.svg" },
			{ name: "Matplotlib", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/matplotlib.svg" },
		],
	},
	{
		category: "Tools & Platforms",
		icon: "🛠️",
		items: [
			{ name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
			{ name: "SQL Server", icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg" },
			{ name: "MongoDB", icon: "https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" },
			{ name: "MySQL", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/mysql.svg" },
			{ name: "VS Code", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/vscode.svg" },
			{ name: "Visual Studio", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/vs.svg" },
			{ name: "Android Studio", icon: "https://profilinator.rishav.dev/skills-assets/android-original-wordmark.svg" },
			{ name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
			{ name: "Git", icon: "https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/gitbash.svg" },
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
