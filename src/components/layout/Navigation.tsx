import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../ui/theme-toggle";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navigation() {
	return (
		<Navbar className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b h-14 w-full">
			<NavbarContent justify="start" className="gap-3 relative">
				<SidebarTrigger className="-ml-1" />
				<Link href="/">
					<NavbarBrand className="gap-2">
						<Image
							src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/dev/dev-xl.svg"
							alt="jt dev logo"
							width="40"
							height="40"
						/>
						<p className="font-extrabold text-2xl text-[#DAA520]/90 whitespace-nowrap hidden sm:block">
							Dev Studio
						</p>

						<div className="animate-flareSpark">
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/gif/anime/fire-burn-fabio-nikolaus.gif"
								height={28}
								width={28}
								alt="fire giphy"
								className="pb-1"
								unoptimized={true}
							/>
						</div>
					</NavbarBrand>
				</Link>
			</NavbarContent>

			<NavbarContent justify="end" className="gap-4">
				<ThemeToggle />
				<UserMenu showName={false} dropdownPlacement="bottom" />
			</NavbarContent>
		</Navbar>
	);
}
