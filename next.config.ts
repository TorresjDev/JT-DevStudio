import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	pageExtensions: ["js", "jsx", "ts", "tsx", "md"],

	// Skip API routes during static generation
	experimental: {
		optimizePackageImports: [
			"@heroui/navbar",
			"@heroui/theme",
			"@radix-ui/react-tooltip",
			"framer-motion",
			"lucide-react",
		],
	},

	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = [...(config.externals || []), "canvas", "jsdom"];
		}
		return config;
	},

	// Enhanced image configuration
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "torresjdev.github.io" },
			{ protocol: "https", hostname: "fonts.googleapis.com" },
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{ protocol: "https", hostname: "github-readme-streak-stats.herokuapp.com" },
			{ protocol: "https", hostname: "github-readme-stats.vercel.app" },
			{ protocol: "https", hostname: "ghchart.rshah.org" },
			// Supabase Storage for UGC media uploads
			{ protocol: "https", hostname: "rtyyywzpdoroqouvskop.supabase.co" },
		],
	},

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; " +
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
							"img-src 'self' blob: data: https://torresjdev.github.io https://fonts.googleapis.com https://avatars.githubusercontent.com https://github-readme-streak-stats.herokuapp.com https://github-readme-stats.vercel.app https://ghchart.rshah.org https://rtyyywzpdoroqouvskop.supabase.co; " +
							"font-src 'self' https://fonts.gstatic.com; " +
							"connect-src 'self' https://rtyyywzpdoroqouvskop.supabase.co wss://rtyyywzpdoroqouvskop.supabase.co https://api.commerce.coinbase.com https://api.stripe.com https://api.github.com; " +
							"frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " +
							"object-src 'none'; " +
							"base-uri 'self'; " +
							"form-action 'self';",
					},
				],
			},
		];
	},
};

export default nextConfig;
