import type { NextConfig } from "next";
import { CSP_IMG_SRC_HOSTS, IMAGE_REMOTE_PATTERNS } from "./src/lib/allowedImageHosts";

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

	// Enhanced image configuration
	images: {
		remotePatterns: IMAGE_REMOTE_PATTERNS,
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
							`img-src 'self' blob: data: ${CSP_IMG_SRC_HOSTS.join(" ")} https://*.googleusercontent.com; ` +
							"font-src 'self' https://fonts.gstatic.com; " +
							"connect-src 'self' https://rtyyywzpdoroqouvskop.supabase.co wss://rtyyywzpdoroqouvskop.supabase.co https://api.commerce.coinbase.com https://api.stripe.com https://api.github.com; " +
							"frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://torresjdev.github.io; " +
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
