"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../../ui/sidebar";
import { Code, User } from "lucide-react";

function AboutSidebarGroupContent() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { isMobile, setOpenMobile } = useSidebar();

	const username = searchParams.get("username");
	const isCreatorActive = pathname === "/about" && username === "torresjdev";
	const isProfileActive = pathname === "/about" && !username;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>About Me</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive={isCreatorActive}>
							<Link
								href="/about?username=torresjdev"
								onClick={() => isMobile && setOpenMobile(false)}
							>
								<Code
									className="rounded-full p-0.5 bg-[#DAA520] font-medium text-black h-5 w-5"
								/>
								<span className="">Creator</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive={isProfileActive}>
							<Link
								href="/about"
								onClick={() => isMobile && setOpenMobile(false)}
							>
								<User
									className="rounded-full p-0.5 bg-foreground/10 font-medium text-foreground h-5 w-5"
								/>
								<span className="">Profile</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export default function AboutSidebarGroup() {
	return (
		<Suspense fallback={null}>
			<AboutSidebarGroupContent />
		</Suspense>
	);
}
