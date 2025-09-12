// app/api/countries/route.ts
import { NextResponse } from "next/server";

const API_KEY = "3221264a96310bc333aa512758d6037f";

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

    const data = await res.json();

    // CountryLayer returns format:
    // [
    //   {
    //     name: "Afghanistan",
    //     callingCodes: ["93"],
    //     ...
    //   }
    // ]
    const countries = data.map((c: any) => ({
      name: c.name,
      code: c.callingCodes?.length ? `+${c.callingCodes[0]}` : "",
    }));

    const filtered = countries.filter((c: any) => c.code !== "");

    return NextResponse.json(filtered);
  } catch (err: any) {
    console.error("API /countries error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
