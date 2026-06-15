import { describe, it, expect } from "vitest"
import { isAllowedImageHost, isAllowedImageUrl } from "@/lib/allowedImageHosts"

describe("allowedImageHosts", () => {
	it("allows Google avatar subdomains", () => {
		expect(isAllowedImageHost("lh3.googleusercontent.com")).toBe(true)
		expect(isAllowedImageHost("lh4.googleusercontent.com")).toBe(true)
	})

	it("allows configured static hosts", () => {
		expect(isAllowedImageUrl("https://avatars.githubusercontent.com/u/1")).toBe(true)
		expect(isAllowedImageUrl("https://rtyyywzpdoroqouvskop.supabase.co/object/public/x")).toBe(true)
	})

	it("rejects missing or unknown hosts", () => {
		expect(isAllowedImageUrl(null)).toBe(false)
		expect(isAllowedImageUrl("https://evil.example/avatar.png")).toBe(false)
	})
})
