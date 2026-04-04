// Application constants
export const APP_CONFIG = {
	name: "JT Dev Studio",
	description:
		"Just Technology Development Studio — building tools, apps, and experiences that solve real problems.",
	url: process.env.SITE_URL || "https://jt-devstudio.tech",
	author: {
		name: "Jesus Torres",
		github: "TorresjDev",
		wakatime: "Jtorres",
	},
} as const;

export const ROUTES = {
	home: "/",
	services: "/services",
	profile: "/profile",
	studio: "/studio",
	posts: "/posts",
	contact: "/contact",
	support: "/support",
} as const;

export const EXTERNAL_LINKS = {
	github: `https://github.com/${APP_CONFIG.author.github}`,
	linkedin: "https://linkedin.com/in/torresjdev",
	repository: `https://github.com/${APP_CONFIG.author.github}/Nextjs-App`,
	issues: `https://github.com/${APP_CONFIG.author.github}/Nextjs-App/issues`,
} as const;
