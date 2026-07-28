"use client";

import React, { useState } from "react";
import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { CryptoDonation } from "./components/CryptoDonation";
import { StripeDonation } from "./components/StripeDonation";

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

interface DonationsJarProps {
	className?: string;
	compact?: boolean;
}

export const DonationsJar: React.FC<DonationsJarProps> = ({
	className = "",
	compact = false,
}) => {
	const [selectedAmount, setSelectedAmount] = useState<number>(10);
	const [customAmount, setCustomAmount] = useState<string>("");
	const [isCustom, setIsCustom] = useState(false);

	const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
	const amountKey = `${isCustom ? "custom" : "preset"}-${currentAmount.toFixed(2)}`;

	const isPresetActive = (amount: number) => {
		if (!isCustom) return selectedAmount === amount;
		if (!customAmount) return false;
		return Number(customAmount) === amount;
	};

	const handlePresetClick = (amount: number) => {
		setSelectedAmount(amount);
		setIsCustom(false);
		setCustomAmount("");
	};

	const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
			setCustomAmount(value);
			setIsCustom(true);
		}
	};

	if (compact) {
		return (
			<section
				className={`rounded-lg border border-border bg-card p-4 text-center ${className}`}
			>
				<h3 className="mb-3 font-semibold text-foreground">
					Support this project
				</h3>
				<div className="flex items-center justify-center gap-3">
					<StripeDonation amount={currentAmount} compact />
					<CryptoDonation amount={currentAmount} compact />
				</div>
			</section>
		);
	}

	return (
		<section
			className={`w-full rounded-2xl border border-border bg-card p-4 shadow-xl shadow-black/5 sm:p-6 ${className}`}
		>
			<div className="mb-5 flex items-start gap-3 border-b border-border pb-5">
				<div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
					<ShieldCheck className="h-5 w-5" aria-hidden="true" />
				</div>
				<div>
					<h2 className="text-xl font-semibold text-foreground sm:text-2xl">
						Support Jesus Torres&apos;s work
					</h2>
					<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
						Funds support open-source development, educational resources, and
						the costs of maintaining this site.
					</p>
				</div>
			</div>

			<div className="grid gap-5 md:grid-cols-[1fr_1.05fr] md:gap-6">
				<div>
					<h3 className="mb-3 text-sm font-semibold text-foreground">
						Choose an amount
					</h3>
					<div className="grid grid-cols-3 gap-2">
						{PRESET_AMOUNTS.map((amount) => (
							<button
								key={amount}
								onClick={() => handlePresetClick(amount)}
								className={`ui-press min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
									isPresetActive(amount)
										? "border-primary bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
										: "border-border bg-card text-foreground hover-gold-surface"
								}`}
							>
								${amount}
							</button>
						))}
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
								$
							</span>
							<input
								type="text"
								inputMode="decimal"
								placeholder="Custom"
								value={customAmount}
								onChange={handleCustomChange}
								onFocus={() => setIsCustom(true)}
								aria-label="Custom donation amount"
								className={`ui-press ui-input min-h-11 w-full rounded-lg border bg-card py-2 pl-7 pr-2 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 ${
									isCustom
										? "border-primary ring-1 ring-primary/20"
										: "border-border hover-gold-surface"
								}`}
							/>
						</div>
					</div>
					{currentAmount > 0 && (
						<div className="mt-3 min-h-5">
							<p
								key={amountKey}
								className="animate-fade-slide-up text-sm text-muted-foreground"
							>
								Selected:{" "}
								<span className="font-bold text-primary">
									${currentAmount.toFixed(2)}
								</span>
							</p>
						</div>
					)}
				</div>

				<div className="border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
					<h3 className="mb-3 text-sm font-semibold text-foreground">
						Select a secure payment method
					</h3>
					<div className="flex w-full flex-col gap-3">
						<StripeDonation amount={currentAmount} className="w-full" />
						<CryptoDonation amount={currentAmount} className="w-full" />
					</div>
					<div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
						<div className="flex items-center gap-2">
							<LockKeyhole
								className="h-3.5 w-3.5 text-primary"
								aria-hidden="true"
							/>
							<span>Encrypted, processor-hosted checkout</span>
						</div>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
							<span className="font-semibold text-foreground">Powered by</span>
							<span className="inline-flex items-center gap-1">
								<CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
								Stripe for cards
							</span>
							<span className="inline-flex items-center gap-1">
								<CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
								Coinbase for crypto
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
