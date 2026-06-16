"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePayment } from "../hooks/usePayment";

interface CryptoDonationProps {
	amount: number;
	compact?: boolean;
	className?: string;
}

export const CryptoDonation: React.FC<CryptoDonationProps> = ({
	amount,
	compact = false,
	className = "",
}) => {
	const { processCryptoPayment, isCryptoLoading, error } = usePayment();

	const handleCryptoDonation = () => {
		processCryptoPayment(amount);
	};

	return (
		<div
			className={
				compact
					? className
					: `ui-surface hover-lift hover-gold-surface rounded-xl border border-border p-2 sm:p-3 ${className}`
			}
		>
			<Button
				onClick={handleCryptoDonation}
				disabled={isCryptoLoading}
				variant="secondary"
				size={compact ? "sm" : "default"}
				className={`ui-press bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold transition-all ${compact ? "" : "w-full"}`}
			>
				{isCryptoLoading ? (
					<span className="inline-flex items-center justify-center gap-2">
						<svg
							className="h-4 w-4 animate-spin"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
							/>
						</svg>
						<span>{compact ? "…" : "Loading"}</span>
					</span>
				) : compact ? (
					"₿"
				) : (
					"Crypto ₿ 🪙"
				)}
			</Button>
			{error && (
				<p className="text-destructive text-sm mt-2 max-w-xs">
					{error.message}
				</p>
			)}
		</div>
	);
};

