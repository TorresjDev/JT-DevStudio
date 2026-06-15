import "server-only"
import sanitizeHtml from "sanitize-html"

/**
 * Sanitize UGC post HTML on the server without jsdom (safe for Vercel serverless).
 */
export function sanitizePostContent(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			"img",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"span",
			"u",
		],
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			a: ["href", "name", "target", "rel"],
			img: ["src", "alt", "width", "height"],
			span: ["style"],
		},
		allowedSchemes: ["http", "https", "mailto"],
	})
}
