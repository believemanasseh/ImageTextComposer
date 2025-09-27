import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const key = process.env.GOOGLE_FONTS_API_KEY;
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 500 });

  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(
      key
    )}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
