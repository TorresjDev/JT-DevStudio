"use client";

import React from "react";
import { Bitcoin } from "lucide-react";
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
		<div className={className}>
			<Button
				onClick={handleCryptoDonation}
				disabled={isCryptoLoading || amount < 1}
				variant="secondary"
				size={compact ? "sm" : "default"}
				className={`ui-press border border-border bg-secondary font-semibold text-secondary-foreground transition-all hover:border-[#DAA520] hover:bg-secondary/80 ${
					compact ? "" : "h-12 w-full rounded-lg"
				}`}
			>
				{isCryptoLoading ? (
					<svg
						className="mx-auto h-5 w-5 animate-spin text-secondary-foreground"
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
				) : compact ? (
					<Bitcoin className="h-4 w-4" aria-label="Crypto payment" />
				) : (
					<>
						<Bitcoin className="h-4 w-4" aria-hidden="true" />
						Donate with cryptocurrency
					</>
				)}
			</Button>
			{error && (
				<p className="mt-2 text-left text-sm text-destructive" role="alert">
					{error.message}
				</p>
			)}
		</div>
	);
};
