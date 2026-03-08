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
			className={`bg-card text-center rounded-xl py-6 px-4 max-w-2xl mx-auto border border-border shadow-lg ${className}`}
		>
			<h1 className="text-2xl font-semibold text-foreground mb-2">
				Make a donation today
			</h1>

			<div className="mx-auto">
				{/* Amount Selection */}
				<div className="mb-6">
					<h3 className="text-lg font-medium text-muted-foreground mb-4">
						Choose an amount
					</h3>
					<div className="flex flex-wrap items-center justify-center gap-2 mb-4">
						{PRESET_AMOUNTS.map((amount) => (
							<button
								key={amount}
								onClick={() => handlePresetClick(amount)}
								className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border ${
									!isCustom && selectedAmount === amount
										? "bg-primary text-primary-foreground border-primary shadow-md"
										: "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
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
								className={`w-24 pl-7 pr-3 py-2 rounded-lg text-sm font-semibold border transition-all bg-card text-foreground placeholder:text-muted-foreground/50 ${
									isCustom
										? "border-primary shadow-md ring-1 ring-primary/20"
										: "border-border hover:border-primary/50"
								}`}
							/>
						</div>
					</div>
					{currentAmount > 0 && (
						<p className="text-sm text-muted-foreground">
							Donating{" "}
							<span className="font-bold text-primary">
								${currentAmount.toFixed(2)}
							</span>
						</p>
					)}
				</div>

				{/* Payment Methods */}
				<h3 className="text-xl font-bold text-primary mt-3 mb-5">
					Select a payment option 💸
				</h3>
				<div className="flex items-center justify-center gap-4 mb-6">
					<StripeDonation amount={currentAmount} />
					<CryptoDonation amount={currentAmount} />
				</div>

				{/* Accepted Payment Icons */}
				<div className="p-3">
					<p className="text-muted-foreground font-medium mb-4">
						Currently accepting donations in these payment options:
					</p>
					<div className="flex items-center justify-center gap-4">
						<Image
							src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/visa.svg"
							height={40}
							width={40}
							alt="visa icon"
							className="drop-shadow-sm"
						/>
						<Image
							src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/master-card.svg"
							height={40}
							width={40}
							alt="mastercard icon"
							className="drop-shadow-sm"
						/>
						<div className="mx-2 h-8 w-px bg-border" />
						<Image
							src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/icons/tech/coinbase.svg"
							height={50}
							width={50}
							alt="coinbase icon"
							className="drop-shadow-sm"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
