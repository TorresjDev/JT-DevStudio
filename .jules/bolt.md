## 2025-02-23 - Remove unnecessary "use client" from landing page
**Learning:** Static landing pages are often marked as "use client" unnecessarily, forcing them to be included in the client-side JavaScript bundle. This increases TTI and FCP without benefit if the page is purely static or uses only Links/Images.
**Action:** Always verify if "use client" is actually needed for top-level pages. If a page only contains layout, text, images, and links, it should be a Server Component.
