import { NextRequest, NextResponse } from "next/server";
import { geoSearch } from "../route-helpers";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });
  try {
    return NextResponse.json({ results: await geoSearch(q) });
  } catch {
    return NextResponse.json({ results: [], error: "Location search is unavailable right now." }, { status: 502 });
  }
}
