import { NextResponse } from "next/server";

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;

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
	const { searchParams } = new URL(request.url);
	const chargeCode = searchParams.get("code");

	if (!chargeCode) {
		return NextResponse.json(
			{ error: "Missing charge code" },
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
