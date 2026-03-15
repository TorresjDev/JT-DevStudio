import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,md,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,md,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,md,mdx}",
		"./node_modules/@heroui/theme/dist/components/(button|navbar|ripple|spinner).js",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				emerald: {
					DEFAULT: "hsl(145 52% 55%)",
					light: "hsl(145 52% 65%)",
					dark: "hsl(145 52% 45%)",
				},
				goldenrod: {
					DEFAULT: "hsl(43 74% 49%)",
					light: "hsl(43 74% 59%)",
					dark: "hsl(43 74% 39%)",
				},
				silver: {
					DEFAULT: "hsl(0 0% 75%)",
					light: "hsl(0 0% 85%)",
					dark: "hsl(0 0% 65%)",
				},
				maroon: {
					DEFAULT: "hsl(0 100% 15%)",
					light: "hsl(0 100% 25%)",
					dark: "hsl(0 100% 5%)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			// Typography plugin customization (prose styles)
			typography: () => ({
				DEFAULT: {
					css: {
						"--tw-prose-body": "hsl(var(--foreground))",
						"--tw-prose-headings": "hsl(var(--foreground))",
						"--tw-prose-code": "hsl(var(--foreground))",
						"--tw-prose-pre-code": "hsl(var(--background))",
						"--tw-prose-pre-bg": "hsl(var(--foreground))",
						"--tw-prose-quotes": "hsl(var(--foreground))",
						"--tw-prose-bold": "hsl(var(--foreground))",
						"--tw-prose-links": "hsl(var(--primary))",
						"--tw-prose-invert-links": "hsl(var(--primary))",
					},
				},
			}),
		},
	},
	plugins: [
		typography(),
		heroui(),
		require("tailwindcss-animate"),
	],
} satisfies Config;

