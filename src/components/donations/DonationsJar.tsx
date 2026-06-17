"use client";
import Image from "next/image";
import React, { useState } from "react";
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
		// Only allow numbers and a single decimal point
		if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
			setCustomAmount(value);
			setIsCustom(true);
		}
	};

	if (compact) {
		return (
			<section
				className={`bg-card text-center rounded-lg p-4 border border-border ${className}`}
			>
				<h3 className="font-semibold text-foreground mb-3">
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
			className={`bg-card rounded-xl py-6 px-4 md:px-6 w-full max-w-2xl lg:max-w-4xl mx-auto border border-border shadow-lg ${className}`}
		>
			<h2 className="text-2xl font-semibold text-foreground mb-2 text-center">
				Make a donation today
			</h2>

			{/* Responsive Grid layout: 1 column on mobile/tablet, 2 columns on desktop */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start mt-6">
				{/* Left Column: Amount Selection */}
				<div className="flex flex-col text-center lg:text-left h-full justify-between">
					<div>
						<h3 className="text-lg font-medium text-muted-foreground mb-4">
							Choose an amount
						</h3>
						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-5">
							{PRESET_AMOUNTS.map((amount) => (
								<button
									key={amount}
									onClick={() => handlePresetClick(amount)}
									className={`ui-press touch-target-inline px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold text-sm border transition-all ${
										isPresetActive(amount)
											? "bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
											: "bg-card text-foreground border-border hover-gold-surface"
									}`}
								>
									${amount}
								</button>
							))}
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
									$
								</span>
								<input
									type="text"
									inputMode="decimal"
									placeholder="Custom"
									value={customAmount}
									onChange={handleCustomChange}
									onFocus={() => setIsCustom(true)}
									className={`ui-press ui-input touch-target-inline w-28 sm:w-32 pl-7 pr-3 py-2 sm:py-2.5 rounded-lg text-sm font-semibold border bg-card text-foreground placeholder:text-muted-foreground/50 transition-all ${
										isCustom
											? "border-primary shadow-md ring-1 ring-primary/20"
											: "border-border hover-gold-surface"
									}`}
								/>
							</div>
						</div>
					</div>
					
					{currentAmount > 0 && (
						<div className="min-h-[24px]">
							<p key={amountKey} className="animate-fade-slide-up text-sm text-muted-foreground">
								Donating{" "}
								<span className="font-bold text-primary">
									${currentAmount.toFixed(2)}
								</span>
							</p>
						</div>
					)}
				</div>

				{/* Right Column: Payment Options & Accents */}
				<div className="flex flex-col text-center lg:text-left border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
					<h3 className="text-lg font-medium text-muted-foreground mb-4">
						Select a payment option 💸
					</h3>
					
					{/* Buttons stack vertically on mobile, side-by-side on tablet, and stack vertically in the desktop column */}
					<div className="flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3 sm:gap-4 mb-6 w-full">
						<StripeDonation amount={currentAmount} className="w-full" />
						<CryptoDonation amount={currentAmount} className="w-full" />
					</div>

					{/* Accepted Payment Icons */}
					<div className="pt-4 border-t border-border w-full">
						<p className="text-xs text-muted-foreground font-medium mb-3">
							Currently accepting:
						</p>
						<div className="flex items-center justify-center lg:justify-start gap-4">
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/visa.svg"
								height={32}
								width={32}
								alt="visa icon"
								className="drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity"
							/>
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/master-card.svg"
								height={32}
								width={32}
								alt="mastercard icon"
								className="drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity"
							/>
							<div className="mx-1 h-6 w-px bg-border" />
							<Image
								src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/coinbase.svg"
								height={40}
								width={40}
								alt="coinbase icon"
								className="drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
