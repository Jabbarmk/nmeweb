import { NextRequest, NextResponse } from "next/server";
import { geoReverse } from "../route-helpers";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }
  try {
    return NextResponse.json({ result: await geoReverse(lat, lon) });
  } catch {
    // Reverse lookup failing shouldn't block "use current location" —
    // fall back to a coordinate label the client can still store.
    return NextResponse.json({
      result: { label: `${Number(lat).toFixed(3)}, ${Number(lon).toFixed(3)}`, lat: Number(lat), lon: Number(lon) },
    });
  }
}
