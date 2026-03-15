"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePayment } from "../hooks/usePayment";

interface StripeDonationProps {
	amount: number;
	compact?: boolean;
	className?: string;
}

export const StripeDonation: React.FC<StripeDonationProps> = ({
	amount,
	compact = false,
	className = "",
}) => {
	const { processStripePayment, isStripeLoading, error } = usePayment();

	const handleStripeDonation = () => {
		processStripePayment(amount);
	};

	return (
		<div className={className}>
			<Button
				onClick={handleStripeDonation}
				disabled={isStripeLoading || amount < 1}
				variant="default"
				size={compact ? "sm" : "default"}
				className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
			>
				{isStripeLoading ? "Loading..." : compact ? "💳" : "Credit/Debit 💳"}
			</Button>
			{error && (
				<p className="text-destructive text-sm mt-2 max-w-xs">
					{error.message}
				</p>
			)}
		</div>
	);
};
