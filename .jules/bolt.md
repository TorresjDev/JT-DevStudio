## 2026-01-31 - Client-side Waterfall for Reactions
**Learning:** The `PostReactions` component was fetching data client-side on mount, causing a waterfall effect after the initial server render of the post page. This delayed the display of reaction counts.
**Action:** Server components should fetch all necessary data (including auxiliary data like reactions) in parallel and pass it as initial props to client components to enable immediate rendering and avoid layout shifts or pop-ins.
