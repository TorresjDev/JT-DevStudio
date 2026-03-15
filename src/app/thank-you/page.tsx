"use client";

import { useEffect, useState } from "react";
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
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="container mx-auto px-4">
				<div className="max-w-2xl mx-auto text-center">
					{/* Success Icon */}
					<div className="text-6xl mb-6">🎉</div>

					<h1 className="text-4xl font-bold text-foreground mb-4">
						Thank You! 🙏
					</h1>

					<p className="text-lg text-muted-foreground mb-8">
						Your generous donation has been received successfully! Your support
						means the world to me and helps keep my projects alive and growing.
					</p>

					{/* Donation Confirmation Details */}
					{loading && (
						<div className="bg-card border border-border rounded-lg p-6 mb-8">
							<p className="text-muted-foreground">
								Loading your donation details...
							</p>
						</div>
					)}

					{error && (
						<div className="bg-card border border-border rounded-lg p-6 mb-8">
							<p className="text-muted-foreground">{error}</p>
						</div>
					)}

					{/* Stripe Donation Details */}
					{session && !isCrypto && (
						<div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
							<h2 className="text-xl font-semibold text-foreground mb-4 text-center">
								Donation Confirmation 🧾
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-border">
									<span className="text-muted-foreground">Amount</span>
									<span className="font-bold text-primary text-lg">
										${session.amount_total} {session.currency}
									</span>
								</div>
								{session.customer_name && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground">Name</span>
										<span className="font-medium text-foreground">
											{session.customer_name}
										</span>
									</div>
								)}
								{session.customer_email && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground">
											Receipt sent to
										</span>
										<span className="font-medium text-foreground">
											{session.customer_email}
										</span>
									</div>
								)}
								{session.payment_intent && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground">
											Confirmation ID
										</span>
										<span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">
											{session.payment_intent}
										</span>
									</div>
								)}
								<div className="flex justify-between items-center py-2">
									<span className="text-muted-foreground">Status</span>
									<span className="inline-flex items-center gap-1.5 font-medium text-green-600">
										<span className="w-2 h-2 rounded-full bg-green-500" />
										{session.payment_status === "paid"
											? "Payment Confirmed"
											: session.payment_status}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Crypto Donation Details */}
					{isCrypto && (
						<div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
							<h2 className="text-xl font-semibold text-foreground mb-4 text-center">
								Donation Confirmation 🧾
							</h2>
							<div className="space-y-3">
								{cryptoAmount && (
									<div className="flex justify-between items-center py-2 border-b border-border">
										<span className="text-muted-foreground">Amount</span>
										<span className="font-bold text-primary text-lg">
											${Number(cryptoAmount).toFixed(2)} USD
										</span>
									</div>
								)}
								<div className="flex justify-between items-center py-2 border-b border-border">
									<span className="text-muted-foreground">Method</span>
									<span className="font-medium text-foreground">
										Cryptocurrency (Coinbase Commerce)
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-muted-foreground">Status</span>
									<span className="inline-flex items-center gap-1.5 font-medium text-green-600">
										<span className="w-2 h-2 rounded-full bg-green-500" />
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
					<div className="bg-card border border-border rounded-lg p-6 mb-8">
						<h2 className="text-xl font-semibold text-foreground mb-4">
							What happens next?
						</h2>
						<div className="text-left space-y-3 text-muted-foreground">
							<div className="flex items-start gap-3">
								<span className="text-green-500 mt-1">✓</span>
								<span>
									{session?.customer_email
										? `A receipt has been sent to ${session.customer_email}`
										: "You'll receive an email confirmation shortly"}
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-green-500 mt-1">✓</span>
								<span>
									Your donation will directly support ongoing development
									projects
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-green-500 mt-1">✓</span>
								<span>
									You&apos;re helping create more free resources for the
									developer community
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild>
							<Link href="/">Return to Home</Link>
						</Button>
						<Button variant="outline" asChild>
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
								className="text-primary hover:underline"
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
	return <ThankYouContent />;
}
