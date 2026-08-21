import { NextResponse } from "next/server";
import { getStreamSources } from "@/lib/stream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // TMDB or IMDb ID
  const imdbId = searchParams.get("imdb_id");
  const mediaType = (searchParams.get("type") as "movie" | "tv" | "kdrama" | "anime") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10);
  const episode = parseInt(searchParams.get("episode") || "1", 10);

  if (!id && !imdbId) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 });
  }

  try {
    const result = await getStreamSources(imdbId, id || "157336", mediaType, season, episode);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Stream resolution route error:", err);
    return NextResponse.json({ error: "Failed to resolve stream" }, { status: 500 });
  }
}
