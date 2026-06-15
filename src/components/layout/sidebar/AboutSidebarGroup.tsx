"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../../ui/sidebar";
import {
	Home,
	Briefcase,
	Rocket,
	User,
	Mail,
	Settings,
	FileEdit,
	BookOpen,
	Newspaper,
	Heart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────────
   BROWSE — public, visible to everyone
   Core site pages for prospecting clients
   ───────────────────────────────────────────── */
const browseItems = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "Services", href: "/services", icon: Briefcase },
	{ label: "Studio", href: "/studio", icon: Rocket },
	{ label: "Profile", href: "/profile", icon: User },
];

/* ─────────────────────────────────────────────
   CONTENT — public, readable by anyone
   Blog/post listings
   ───────────────────────────────────────────── */
const contentItems = [
	{ label: "Posts", href: "/posts", icon: Newspaper },
	{ label: "Blogs", href: "/posts/blogs", icon: BookOpen },
];

/* ─────────────────────────────────────────────
   ACCOUNT — requires login
   Only visible to authenticated users
   ───────────────────────────────────────────── */
const accountItems = [
	{ label: "Create Content", href: "/editor/new", icon: FileEdit },
	{ label: "Settings", href: "/settings", icon: Settings },
];

/* ─────────────────────────────────────────────
   SUPPORT — public, always visible at the bottom
   ───────────────────────────────────────────── */
const supportItems = [
	{ label: "Contact", href: "/contact", icon: Mail },
	{ label: "Support", href: "/support/donations", icon: Heart },
];

/* Reusable link renderer */
function NavItem({
	item,
	pathname,
	isMobile,
	setOpenMobile,
}: {
	item: { label: string; href: string; icon: React.ElementType };
	pathname: string;
	isMobile: boolean;
	setOpenMobile: (open: boolean) => void;
}) {
	const Icon = item.icon;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				isActive={
					pathname === item.href ||
					(item.href !== "/" &&
						pathname.startsWith(item.href) &&
						!(item.href === "/posts" && pathname.startsWith("/posts/blogs")))
				}
			>
				<Link
					href={item.href}
					onClick={() => isMobile && setOpenMobile(false)}
				>
					<Icon className="h-4 w-4 shrink-0" />
					<span>{item.label}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export default function StudioSidebarGroup() {
	const pathname = usePathname();
	const { isMobile, setOpenMobile } = useSidebar();
	const { user, loading, hasMounted } = useAuth();

	const isLoggedIn = !loading && hasMounted && !!user;

	return (
		<>
			{/* ── Browse ────────────────────────────── */}
			<SidebarGroup>
				<SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
					Browse
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{browseItems.map((item) => (
							<NavItem key={item.href} item={item} pathname={pathname} isMobile={isMobile} setOpenMobile={setOpenMobile} />
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			{/* ── Content ────────────────────────────── */}
			<SidebarGroup>
				<SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
					Content
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{contentItems.map((item) => (
							<NavItem key={item.href} item={item} pathname={pathname} isMobile={isMobile} setOpenMobile={setOpenMobile} />
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			{/* ── Account (auth-only) ─────────────── */}
			{isLoggedIn && (
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
						Account
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{accountItems.map((item) => (
								<NavItem key={item.href} item={item} pathname={pathname} isMobile={isMobile} setOpenMobile={setOpenMobile} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			)}

			{/* ── Auth skeleton while loading ──────── */}
			{!hasMounted && (
				<SidebarGroup>
					<SidebarGroupContent>
						<div className="space-y-1.5 px-2 py-2">
							{[1, 2].map((i) => (
								<div key={i} className="flex items-center gap-3 px-2 py-1.5">
									<div className="h-4 w-4 rounded bg-muted/15 animate-pulse" />
									<div className="h-3 w-20 rounded bg-muted/15 animate-pulse" />
								</div>
							))}
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			)}

			{/* ── Support (always visible, bottom) ── */}
			<SidebarGroup className="mt-auto">
				<SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
					Reach Out
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{supportItems.map((item) => (
							<NavItem key={item.href} item={item} pathname={pathname} isMobile={isMobile} setOpenMobile={setOpenMobile} />
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
}
