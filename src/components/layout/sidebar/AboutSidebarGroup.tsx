"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../../ui/sidebar";
import Icon from "../../ui/icon";

export default function AboutSidebarGroup() {
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
								<Icon
									name="code"
									className="rounded-full p-0.5 bg-[#DAA520] font-medium text-black"
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
								<Icon
									name="person"
									className="rounded-full p-0.5 bg-white font-medium text-black"
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
