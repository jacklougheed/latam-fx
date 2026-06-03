import { NextResponse } from "next/server";
import { getRates } from "@/lib/rates";

export const dynamic = "force-dynamic";

// Public JSON snapshot of all current rates — handy for debugging or reuse.
export async function GET() {
  const data = await getRates();
  return NextResponse.json(data, {
    headers: { "cache-control": "public, max-age=60" },
  });
}
