import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../ui/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navigation() {
	return (
		<header className="fixed inset-x-0 top-0 z-[60] flex h-14 w-full items-center justify-between gap-3 border-b border-border/50 bg-background/70 px-3 shadow-sm shadow-black/5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-background/55 dark:shadow-black/20 sm:px-4">
			<div className="flex min-w-0 items-center gap-2 sm:gap-3">
				{/* Mobile only — desktop uses the toggle inside the sidebar header */}
				<SidebarTrigger
					inline
					aria-label="Open navigation menu"
					className="md:hidden h-11 w-11 -ml-1"
				/>
				<Link href="/" className="group flex min-w-0 items-center gap-2">
					<Image
						src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/dev/dev-xl.svg"
						alt="jt dev logo"
						width={40}
						height={40}
						className="h-10 w-10 shrink-0 transition-transform duration-300 ease-out group-hover:scale-105"
					/>
					<p className="hidden truncate font-extrabold text-2xl text-goldenrod-dark/90 transition-colors duration-200 group-hover:text-goldenrod-dark sm:block dark:text-goldenrod/90 dark:group-hover:text-goldenrod">
						JT Dev Studio
					</p>
					<div className="animate-flare-spark shrink-0">
						<Image
							src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/gif/anime/fire-burn-fabio-nikolaus.gif"
							height={28}
							width={28}
							alt="fire giphy"
							className="h-7 w-7 pb-1"
							unoptimized
						/>
					</div>
				</Link>
			</div>

			<div className="flex shrink-0 items-center gap-3 sm:gap-4">
				<ThemeToggle />
				<UserMenu showName={false} dropdownPlacement="bottom" />
			</div>
		</header>
	);
}
