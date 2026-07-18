import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const country = request.headers.get("x-oxylabs-geo-location") || "unknown";
  const regionalFailure = country.toLowerCase().includes("singapore");
  return NextResponse.json({
    journey: "product → cart → checkout",
    paymentSdk: regionalFailure ? "unavailable" : "ready",
    checkoutStatus: regionalFailure ? 503 : 200,
    region: country,
  }, { status: regionalFailure ? 503 : 200 });
}
