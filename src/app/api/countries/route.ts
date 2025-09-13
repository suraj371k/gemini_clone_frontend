import { NextResponse } from "next/server";

const API_KEY = "3221264a96310bc333aa512758d6037f";

interface Country {
  name: string;
  callingCodes?: string[];
}

interface CountryResponse {
  name: string;
  code: string;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.countrylayer.com/v2/all?access_key=${API_KEY}`
    );

    if (!res.ok) {
      console.error("CountryLayer API error:", res.status);
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: res.status }
      );
    }

    const data: Country[] = await res.json();

    const countries: CountryResponse[] = data.map((c) => ({
      name: c.name,
      code: c.callingCodes?.length ? `+${c.callingCodes[0]}` : "",
    }));

    const filtered = countries.filter((c) => c.code !== "");

    return NextResponse.json(filtered);
  } catch (err) {
    if (err instanceof Error) {
      console.error("API /countries error:", err.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: err.message },
        { status: 500 }
      );
    }
    console.error("Unknown error in /countries:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
