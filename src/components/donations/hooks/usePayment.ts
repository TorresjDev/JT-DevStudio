"use client";
import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { PaymentMethod } from "../types/donations";
import { useDonations } from "./useDonations";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const usePayment = () => {
	const donations = useDonations();
	const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(
		null
	);

	const processStripePayment = useCallback(async () => {
		donations.handleDonationStart();
		setCurrentMethod("stripe");

		try {
			const response = await fetch("/api/stripe-payment/donate-checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create session.");
			}

			const stripe = await stripePromise;

<<<<<<< Updated upstream
			if (!stripe) {
				throw new Error("Stripe failed to load.");
=======
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
>>>>>>> Stashed changes
			}

			const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

			if (error) {
				throw new Error(error.message);
			}

			donations.handleDonationSuccess();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An unknown error occurred";
			donations.handleDonationError(errorMessage, "stripe_error");
		}
	}, [donations]);

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
				const response = await axios.post("/api/crypto-donation", { amount });
				const { hosted_url } = response.data;

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

export default usePayment;
