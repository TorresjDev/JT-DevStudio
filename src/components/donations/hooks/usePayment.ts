"use client";
import { useState, useCallback } from "react";
import { PaymentMethod } from "../types/donations";
import { useDonations } from "./useDonations";

export const usePayment = () => {
	const donations = useDonations();
	const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(
		null
	);

	const processStripePayment = useCallback(
		async (amount: number) => {
			donations.handleDonationStart();
			setCurrentMethod("stripe");

			if (amount < 1) {
				donations.handleDonationError(
					"Please enter a valid donation amount.",
					"invalid_amount"
				);
				return;
			}

			try {
				const response = await fetch("/api/stripe-payment/donate-checkout", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ amount }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to create session.");
				}

				if (data.url) {
					window.location.href = data.url;
				} else {
					throw new Error("No checkout URL returned.");
				}

				donations.handleDonationSuccess();
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";
				donations.handleDonationError(errorMessage, "stripe_error");
			}
		},
		[donations]
	);

	const processCryptoPayment = useCallback(
		async (amount: number) => {
			donations.handleDonationStart();
			setCurrentMethod("crypto");

			if (amount < 1) {
				donations.handleDonationError(
					"Please enter a valid donation amount.",
					"invalid_amount"
				);
				return;
			}

			try {
				const response = await fetch("/api/crypto-donation", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ amount }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to initiate crypto donation");
				}

				const { hosted_url } = data;

				if (hosted_url) {
					window.location.href = hosted_url;
					donations.handleDonationSuccess();
				} else {
					throw new Error("No payment URL received");
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to initiate crypto donation";
				donations.handleDonationError(errorMessage, "crypto_error");
			}
		},
		[donations]
	);

	const resetPayment = useCallback(() => {
		setCurrentMethod(null);
		donations.resetStatus();
	}, [donations]);

	return {
		...donations,
		currentMethod,
		processStripePayment,
		processCryptoPayment,
		resetPayment,
		isStripeLoading: donations.isLoading && currentMethod === "stripe",
		isCryptoLoading: donations.isLoading && currentMethod === "crypto",
	};
};
