import type { MetadataRoute } from "next";
import { APP_CONFIG } from "../lib/constants";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = APP_CONFIG.url;

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/editor/", "/settings/", "/login"],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
