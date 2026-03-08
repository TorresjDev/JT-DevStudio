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
		<div className={className}>
			<Button
				onClick={handleCryptoDonation}
				disabled={isCryptoLoading}
				variant="secondary"
				size={compact ? "sm" : "default"}
				className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold transition-all"
			>
				{isCryptoLoading ? "Loading..." : compact ? "₿" : "Crypto ₿ 🪙"}
			</Button>
			{error && (
				<p className="text-destructive text-sm mt-2 max-w-xs">
					{error.message}
				</p>
			)}
		</div>
	);
};

