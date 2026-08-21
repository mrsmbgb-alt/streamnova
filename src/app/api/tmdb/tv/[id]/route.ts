import { NextRequest, NextResponse } from "next/server";
import { getTVDetails } from "@/lib/tmdb";

export const revalidate = 86400;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await getTVDetails(parseInt(id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("TV detail error:", error);
    return NextResponse.json({ error: "Failed to fetch TV show" }, { status: 500 });
  }
}
