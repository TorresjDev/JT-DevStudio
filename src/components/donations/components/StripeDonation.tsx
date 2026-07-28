"use client";

import React from "react";
import { CreditCard } from "lucide-react";
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
				className={`ui-press bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:text-primary-foreground ${
					compact ? "" : "h-12 w-full rounded-lg"
				}`}
			>
				{isStripeLoading ? (
					<svg
						className="mx-auto h-5 w-5 animate-spin text-primary-foreground"
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
					<CreditCard className="h-4 w-4" aria-label="Card payment" />
				) : (
					<>
						<CreditCard className="h-4 w-4" aria-hidden="true" />
						Donate securely with card
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
