"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SessionDetails {
	id: string;
	payment_intent: string | null;
	amount_total: string | null;
	currency: string;
	customer_email: string | null;
	customer_name: string | null;
	payment_status: string;
	created: number;
}

function ThankYouContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const method = searchParams.get("method");
	const cryptoAmount = searchParams.get("amount");

	const [session, setSession] = useState<SessionDetails | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isCrypto = method === "crypto";

	useEffect(() => {
		if (!sessionId || isCrypto) return;

		const fetchSession = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`/api/stripe-payment/session-details?session_id=${sessionId}`
				);
				if (!response.ok) throw new Error("Failed to fetch session details");
				const data = await response.json();
				setSession(data);
			} catch {
				setError("Could not load donation details.");
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, [sessionId, isCrypto]);

	return (
		<div className="w-full py-8 md:py-12 flex items-center justify-center">
			<div className="page-container w-full">
				<div className="max-w-2xl mx-auto text-center">
					{/* Green Checked Circle Success Icon */}
					<div className="animate-fade-slide-up flex justify-center mb-6">
						<div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/15">
							<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					</div>

					<h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">
						Thank You! 🙏
					</h1>

					<p className="text-lg text-muted-foreground mb-8">
						Your generous donation has been received successfully. Your support
						means the world to me and helps keep my projects alive and growing.
					</p>

					{/* Donation Confirmation Details */}
					{loading && (
						<div className="animate-fade-slide-up ui-surface bg-card border border-border rounded-xl p-6 mb-8 flex items-center justify-center gap-3">
							<div className="w-5 h-5 rounded-full border-2 border-green-500/20 animate-spin border-t-green-500" />
							<p className="text-sm text-muted-foreground">
								Retrieving confirmation details...
							</p>
						</div>
					)}

					{error && (
						<div className="animate-fade-slide-up ui-surface bg-card border border-destructive/20 rounded-xl p-6 mb-8 text-destructive">
							<p className="text-sm font-medium">{error}</p>
						</div>
					)}

					{/* Stripe Donation Details */}
					{session && !isCrypto && (
						<div className="animate-fade-slide-up ui-surface bg-card border border-green-500/20 rounded-xl p-6 mb-8 text-left shadow-md shadow-green-500/5">
							<h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4 text-center flex items-center justify-center gap-2">
								<span className="material-symbols-outlined text-green-500">receipt_long</span>
								Receipt Details
							</h2>
							<div className="space-y-3.5">
								<div className="flex justify-between items-center py-2 border-b border-border">
									<span className="text-muted-foreground text-sm">Amount</span>
									<span className="font-extrabold text-green-600 dark:text-green-400 text-xl">
										${session.amount_total} {session.currency}
									</span>
								</div>
								{session.customer_name && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground text-sm">Donor Name</span>
										<span className="font-semibold text-foreground text-sm">
											{session.customer_name}
										</span>
									</div>
								)}
								{session.customer_email && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground text-sm">
											Receipt sent to
										</span>
										<span className="font-semibold text-foreground text-sm">
											{session.customer_email}
										</span>
									</div>
								)}
								{session.payment_intent && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground text-sm">
											Confirmation ID
										</span>
										<span className="font-mono text-xs text-foreground bg-muted px-2.5 py-1 rounded border border-border">
											{session.payment_intent}
										</span>
									</div>
								)}
								<div className="flex justify-between items-center py-2">
									<span className="text-muted-foreground text-sm">Status</span>
									<span className="inline-flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs">
										<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
										{session.payment_status === "paid"
											? "Confirmed"
											: session.payment_status}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Crypto Donation Details */}
					{isCrypto && (
						<div className="animate-fade-slide-up ui-surface bg-card border border-green-500/20 rounded-xl p-6 mb-8 text-left shadow-md shadow-green-500/5">
							<h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4 text-center flex items-center justify-center gap-2">
								<span className="material-symbols-outlined text-green-500">receipt_long</span>
								Receipt Details
							</h2>
							<div className="space-y-3.5">
								{cryptoAmount && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground text-sm">Amount</span>
										<span className="font-extrabold text-green-600 dark:text-green-400 text-xl">
											${Number(cryptoAmount).toFixed(2)} USD
										</span>
									</div>
								)}
								<div className="flex justify-between items-center py-2 border-b border-border">
									<span className="text-muted-foreground text-sm">Method</span>
									<span className="font-semibold text-foreground text-sm">
										Cryptocurrency (Coinbase Commerce)
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-muted-foreground text-sm">Status</span>
									<span className="inline-flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs">
										<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
										Processing
									</span>
								</div>
							</div>
							<p className="text-xs text-muted-foreground mt-4 text-center">
								Crypto transactions may take a few minutes to confirm on the
								blockchain.
							</p>
						</div>
					)}

					{/* What Happens Next */}
					<div className="animate-fade-slide-up ui-surface bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
						<h2 className="text-lg font-semibold text-foreground mb-4 text-left">
							What happens next?
						</h2>
						<div className="text-left space-y-3.5 text-muted-foreground text-sm">
							<div className="flex items-start gap-3">
								<div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<span>
									{session?.customer_email
										? `A receipt has been sent to ${session.customer_email}`
										: "You'll receive an email confirmation shortly"}
								</span>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<span>
									Your donation will directly support ongoing development
									projects
								</span>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<span>
									You&apos;re helping create more free resources for the
									developer community
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button className="ui-press" asChild>
							<Link href="/">Return to Home</Link>
						</Button>
						<Button className="ui-press" variant="outline" asChild>
							<Link href="/posts">Browse Posts</Link>
						</Button>
					</div>

					<div className="mt-8 text-sm text-muted-foreground">
						<p>
							Want to stay updated on my projects? Follow me on{" "}
							<a
								href="https://github.com/TorresjDev"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline hover-gold"
							>
								GitHub
							</a>
							!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ThankYouPage() {
	return (
		<Suspense fallback={
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<div className="w-12 h-12 rounded-full border-2 border-green-500/20 animate-spin border-t-green-500" />
				<p className="text-sm text-muted-foreground animate-pulse">Loading donation details...</p>
			</div>
		}>
			<ThankYouContent />
		</Suspense>
	);
}
