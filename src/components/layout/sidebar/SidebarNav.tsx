"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../../ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import StudioSidebarGroup from "./AboutSidebarGroup";
import UserMenu from "../UserMenu";

export function SidebarNav() {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar collapsible="icon">
			{/* Collapse / expand toggle — desktop only. In the mobile drawer the
			    Sheet's own close button handles dismissal, so this is hidden. */}
			{!isMobile && (
				<SidebarHeader className="p-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={toggleSidebar}
								aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
								tooltip="Open sidebar"
								className="hover:text-goldenrod-dark dark:hover:text-goldenrod/90"
							>
								{isCollapsed ? (
									<PanelLeftOpen className="h-4 w-4 shrink-0" />
								) : (
									<PanelLeftClose className="h-4 w-4 shrink-0" />
								)}
								<span>Collapse</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
			)}

			<SidebarContent className="flex flex-col mt-0">
				<StudioSidebarGroup />
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border pb-4">
				{/* Name/chevron hide via group-data-[collapsible=icon] so they fade with the width tween */}
				<UserMenu dropdownAlign="left" />
			</SidebarFooter>
		</Sidebar>
	);
}
