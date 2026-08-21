import { NextResponse } from "next/server";
import { fetchFromTMDB, formatMediaItem, FALLBACK_MEDIA } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await fetchFromTMDB("/search/multi", {
      query: query.trim(),
      include_adult: "false",
    });

    if (!data || !data.results || !Array.isArray(data.results)) {
      const matchedFallback = FALLBACK_MEDIA.filter((m) =>
        m.title?.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json({ results: matchedFallback });
    }

    const filtered = data.results
      .filter((item: any) => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path)
      .slice(0, 24)
      .map((item: any) => formatMediaItem(item));

    return NextResponse.json({ results: filtered });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ results: [] });
  }
}
