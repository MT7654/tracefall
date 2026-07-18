import { NextResponse } from "next/server";
import { investigate } from "@/lib/orchestrator";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const report = await investigate();
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Investigation failed" }, { status: 500 });
  }
}
