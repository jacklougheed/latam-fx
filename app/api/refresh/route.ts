import { NextResponse } from "next/server";
import { refresh } from "@/lib/rates";
import { REFRESH_SECRET } from "@/lib/config";

export const dynamic = "force-dynamic";

// Manually trigger a refresh. Useful as a cron backup:
//   */30 * * * * curl -s -X POST -H "x-refresh-secret: $SECRET" https://latam-fx.com/api/refresh
async function handle(req: Request) {
  if (REFRESH_SECRET) {
    const provided =
      req.headers.get("x-refresh-secret") ||
      new URL(req.url).searchParams.get("secret");
    if (provided !== REFRESH_SECRET) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
  }
  try {
    const data = await refresh();
    return NextResponse.json({ ok: true, updatedAt: data.updatedAt });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}

export const POST = handle;
export const GET = handle;
