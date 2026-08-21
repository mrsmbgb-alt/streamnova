import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/tmdb";

export const revalidate = 86400; // 24h

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await getMovieDetails(parseInt(id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Movie detail error:", error);
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}
