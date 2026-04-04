"use client";
import { Sidebar, SidebarContent, SidebarFooter } from "../../ui/sidebar";
import StudioSidebarGroup from "./AboutSidebarGroup";
import UserMenu from "../UserMenu";

export function SidebarNav() {
	return (
		<Sidebar collapsible="icon" className="top-[60px]">
			<SidebarContent className="flex flex-col">
				<StudioSidebarGroup />
			</SidebarContent>
			<SidebarFooter className="border-t border-white/5 pb-20 md:pb-4">
				<UserMenu dropdownAlign="left" />
			</SidebarFooter>
		</Sidebar>
	);
}
