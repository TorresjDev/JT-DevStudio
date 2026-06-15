/**
 * Hostnames allowed for next/image and CSP img-src.
 * Keep in sync with next.config.ts remotePatterns.
 */
export const ALLOWED_IMAGE_HOSTS = [
	"torresjdev.github.io",
	"fonts.googleapis.com",
	"avatars.githubusercontent.com",
	"github-readme-streak-stats.herokuapp.com",
	"github-readme-stats.vercel.app",
	"ghchart.rshah.org",
	"rtyyywzpdoroqouvskop.supabase.co",
	"lh3.googleusercontent.com",
	"*.googleusercontent.com",
] as const

export const IMAGE_REMOTE_PATTERNS = [
	{ protocol: "https" as const, hostname: "torresjdev.github.io" },
	{ protocol: "https" as const, hostname: "fonts.googleapis.com" },
	{ protocol: "https" as const, hostname: "avatars.githubusercontent.com" },
	{ protocol: "https" as const, hostname: "github-readme-streak-stats.herokuapp.com" },
	{ protocol: "https" as const, hostname: "github-readme-stats.vercel.app" },
	{ protocol: "https" as const, hostname: "ghchart.rshah.org" },
	{ protocol: "https" as const, hostname: "rtyyywzpdoroqouvskop.supabase.co" },
	{ protocol: "https" as const, hostname: "lh3.googleusercontent.com" },
	{ protocol: "https" as const, hostname: "*.googleusercontent.com" },
]

/** CSP img-src host entries derived from ALLOWED_IMAGE_HOSTS (excludes wildcards). */
export const CSP_IMG_SRC_HOSTS = ALLOWED_IMAGE_HOSTS.filter(
	(host) => !host.startsWith("*."),
).map((host) => `https://${host}`)

export function isAllowedImageHost(hostname: string): boolean {
	const normalized = hostname.toLowerCase()
	return ALLOWED_IMAGE_HOSTS.some((pattern) => {
		if (pattern.startsWith("*.")) {
			const suffix = pattern.slice(1)
			return normalized === pattern.slice(2) || normalized.endsWith(suffix)
		}
		return normalized === pattern
	})
}

export function isAllowedImageUrl(url: string | null | undefined): boolean {
	if (!url) return false
	try {
		const parsed = new URL(url)
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false
		return isAllowedImageHost(parsed.hostname)
	} catch {
		return false
	}
}
