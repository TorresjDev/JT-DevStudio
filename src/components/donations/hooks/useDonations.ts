"use client";
import { useState, useCallback } from "react";
import { DonationStatus, DonationError } from "../types/donations";

export const useDonations = () => {
	const [status, setStatus] = useState<DonationStatus>("idle");
	const [error, setError] = useState<DonationError | null>(null);

	const resetError = useCallback(() => {
		setError(null);
	}, []);

	const handleDonationStart = useCallback(() => {
		setStatus("loading");
		setError(null);
	}, []);

	const handleDonationSuccess = useCallback(() => {
		setStatus("success");
		setError(null);
	}, []);

	const handleDonationError = useCallback(
		(errorMessage: string, code?: string) => {
			setStatus("error");
			setError({ message: errorMessage, code });
		},
		[]
	);

	const resetStatus = useCallback(() => {
		setStatus("idle");
		setError(null);
	}, []);

	return {
		status,
		error,
		resetError,
		handleDonationStart,
		handleDonationSuccess,
		handleDonationError,
		resetStatus,
		isLoading: status === "loading",
		isSuccess: status === "success",
		isError: status === "error",
	};
};

