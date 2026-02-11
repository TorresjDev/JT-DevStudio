import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "./provider";
import Footer from "../components/layout/Footer";
import { generateMetadata } from "../lib/metadata";
import { LayoutContent } from "../components/layout/LayoutContent";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<AuthProvider>
					<ThemeProvider
						enableSystem
						attribute="class"
						defaultTheme="dark"
					>
						<LayoutContent>{children}</LayoutContent>
						<Footer />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
