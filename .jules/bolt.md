## 2025-05-27 - AuthContext Optimization
**Learning:** `AuthProvider` was recreating its `value` object on every render. This forced all consumers (which is potentially the entire app) to re-render whenever `AuthProvider` re-rendered, even if the user state didn't change.
**Action:** Always wrap context values in `useMemo` to ensure referential stability.

## 2026-06-14 - Mobile Navigation Drawer
**Learning:** Below 768px the sidebar rendered as a shadcn Sheet that dropped from the top, which felt unconventional for a portfolio site and crowded the sticky navbar. Radix's dialog already gives focus trap, Escape, and overlay dismissal for free, but it does not close on client-side route changes, so a drawer could linger open after navigating.
**Action:** Converted the `isMobile` branch in `ui/sidebar.tsx` to a left slide-in drawer (top 56px, full height, 18rem wide capped at 85vw, visible close button, screen-reader title, safe-area bottom padding). Added a `usePathname` effect in `SidebarProvider` to close the drawer on every route change. `SidebarTrigger` now renders a hamburger that flips to an X on mobile while keeping the panel-collapse icons on desktop, and the navbar trigger uses a 44px touch target. Desktop and tablet (768px and up) paths were left untouched. Reminder: never add `backdrop-filter` to the sidebar outer wrapper, it breaks `position: fixed`.
