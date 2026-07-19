import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "./provider";
import { generateMetadata } from "../lib/metadata";
import { LayoutContent } from "../components/layout/LayoutContent";
import { AuthProvider } from "@/context/AuthContext";
import { CookieConsent } from "@/components/CookieConsent";
import { ConsentAwareAnalytics } from "@/components/ConsentAwareAnalytics";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className} suppressHydrationWarning>
				<JsonLd />
				<AuthProvider>
					<ThemeProvider
						enableSystem
						attribute="class"
						defaultTheme="dark"
					>
						<LayoutContent>{children}</LayoutContent>
						<CookieConsent />
					</ThemeProvider>
				</AuthProvider>
				<ConsentAwareAnalytics />
			</body>
		</html>
	);
}
