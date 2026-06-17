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
		<div
			className={
				compact
					? className
					: `ui-surface hover-lift hover-gold-surface rounded-xl border border-border p-2 sm:p-3 ${className}`
			}
		>
			<Button
				onClick={handleStripeDonation}
				disabled={isStripeLoading || amount < 1}
				variant="default"
				size={compact ? "sm" : "default"}
				className={`ui-press bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all ${compact ? "" : "w-full"}`}
			>
				{isStripeLoading ? (
					<svg
						className="h-5 w-5 animate-spin mx-auto text-primary-foreground"
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
					"💳"
				) : (
					"Credit/Debit 💳"
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
