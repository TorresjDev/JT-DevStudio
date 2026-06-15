import { NextResponse } from "next/server";
import { apiRateLimiter, checkRateLimit, getClientIp } from "@/lib/rate-limit";

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;

/** Allow only Coinbase charge code / ID format to prevent SSRF when building the API URL. */
const SAFE_CHARGE_CODE = /^[a-zA-Z0-9-]{1,64}$/;

interface CoinbaseChargeResponse {
	data: {
		code: string;
		name: string;
		pricing_type: string;
		local_price: {
			amount: string;
			currency: string;
		};
		timeline: {
			status: string;
			time: string;
		}[];
		payments: {
			value: {
				local: {
					amount: string;
					currency: string;
				};
			};
			network: string;
			transaction_id: string;
		}[];
	};
}

export async function GET(request: Request) {
	// Rate limiting check
	const ip = getClientIp(request);
	const { success, remaining } = await checkRateLimit(apiRateLimiter, ip);

	if (!success) {
		return NextResponse.json(
			{ error: "Too many requests. Please try again later." },
			{
				status: 429,
				headers: {
					"Retry-After": "60",
					"X-RateLimit-Remaining": String(remaining ?? 0),
				},
			}
		);
	}

	const { searchParams } = new URL(request.url);
	const chargeCode = searchParams.get("code");

	if (!chargeCode || !SAFE_CHARGE_CODE.test(chargeCode)) {
		return NextResponse.json(
			{ error: "Missing or invalid charge code" },
			{ status: 400 }
		);
	}

	if (!COINBASE_API_KEY) {
		return NextResponse.json(
			{ error: "Coinbase API configuration error" },
			{ status: 500 }
		);
	}

	try {
		const response = await fetch(
			`https://api.commerce.coinbase.com/charges/${chargeCode}`,
			{
				headers: {
					"X-CC-Api-Key": COINBASE_API_KEY,
					"X-CC-Version": "2018-03-22",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Coinbase API returned ${response.status}`);
		}

		const data: CoinbaseChargeResponse = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching charge details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch transaction details" },
			{ status: 500 }
		);
	}
}
