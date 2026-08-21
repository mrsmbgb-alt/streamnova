import { NextResponse } from "next/server";
import { fetchFromTMDB, formatMediaItem, FALLBACK_MEDIA } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchFromTMDB("/trending/all/day");

    if (!data || !data.results || !Array.isArray(data.results)) {
      return NextResponse.json({ results: FALLBACK_MEDIA, source: "fallback" });
    }

    const formatted = data.results
      .filter((item: any) => item.poster_path && (item.title || item.name))
      .slice(0, 20)
      .map((item: any) => formatMediaItem(item));

    return NextResponse.json({ results: formatted, source: "tmdb" });
  } catch (err) {
    console.error("Trending route error:", err);
    return NextResponse.json({ results: FALLBACK_MEDIA, source: "fallback" });
  }
}
