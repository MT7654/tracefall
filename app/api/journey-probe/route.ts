import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedRegion = url.searchParams.get("region");
  const country = request.headers.get("x-oxylabs-geo-location") || requestedRegion || "unknown";
  const normalized = country.toLowerCase();
  const regionalFailure = normalized.includes("singapore") || normalized === "sg";
  return NextResponse.json({
    journey: "product → cart → checkout",
    paymentSdk: regionalFailure ? "unavailable" : "ready",
    checkoutStatus: regionalFailure ? 503 : 200,
    region: country,
    scenario: "controlled-reference-journey",
  }, { status: regionalFailure ? 503 : 200 });
}
