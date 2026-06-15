import type { MetadataRoute } from "next";
import { APP_CONFIG } from "../lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = APP_CONFIG.url;
	const lastModified = new Date();

	const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
		{ path: "/", priority: 1.0, changeFrequency: "weekly" },
		{ path: "/services", priority: 0.9, changeFrequency: "monthly" },
		{ path: "/studio", priority: 0.9, changeFrequency: "weekly" },
		{ path: "/profile", priority: 0.8, changeFrequency: "monthly" },
		{ path: "/posts", priority: 0.7, changeFrequency: "weekly" },
		{ path: "/posts/blogs", priority: 0.7, changeFrequency: "weekly" },
		{ path: "/contact", priority: 0.8, changeFrequency: "yearly" },
		{ path: "/support/donations", priority: 0.5, changeFrequency: "yearly" },
	];

	return routes.map(({ path, priority, changeFrequency }) => ({
		url: `${baseUrl}${path}`,
		lastModified,
		changeFrequency,
		priority,
	}));
}
