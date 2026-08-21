import { NextResponse } from "next/server";
import { fetchFromTMDB, formatMediaItem, FALLBACK_MEDIA } from "@/lib/tmdb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const { searchParams } = new URL(request.url);
  const seasonNum = searchParams.get("season");

  const isMovie = type === "movie";
  const apiType = isMovie ? "movie" : "tv";

  try {
    // If requesting specific season info
    if (seasonNum && !isMovie) {
      const seasonData = await fetchFromTMDB(`/tv/${id}/season/${seasonNum}`);
      if (seasonData) {
        return NextResponse.json({ season: seasonData });
      }
    }

    // Main detail request + append_to_response
    const mainDetails = await fetchFromTMDB(`/${apiType}/${id}`, {
      append_to_response: "credits,videos,external_ids,recommendations",
    });

    if (!mainDetails) {
      const foundFallback = FALLBACK_MEDIA.find((m) => String(m.id) === id) || FALLBACK_MEDIA[0];
      return NextResponse.json({
        media: foundFallback,
        cast: [
          { id: 1, name: "Actor One", character: "Lead", profile_path: null },
          { id: 2, name: "Actor Two", character: "Co-Lead", profile_path: null },
        ],
        trailerKey: "dQw4w9WgXcQ",
        seasons: [],
        recommendations: FALLBACK_MEDIA.slice(1),
        source: "fallback",
      });
    }

    const imdbId = mainDetails.external_ids?.imdb_id || mainDetails.imdb_id;
    const formatted = formatMediaItem({ ...mainDetails, imdb_id: imdbId }, type as any);

    const cast = (mainDetails.credits?.cast || []).slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
    }));

    // Find YouTube trailer
    const videos = mainDetails.videos?.results || [];
    const trailerObj = videos.find((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")) || videos[0];
    const trailerKey = trailerObj?.key || null;

    // Seasons info for TV/KDrama/Anime
    const seasons = (mainDetails.seasons || [])
      .filter((s: any) => s.season_number > 0)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        season_number: s.season_number,
        episode_count: s.episode_count,
        poster_path: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : null,
        overview: s.overview,
      }));

    // Recommendations
    const recs = (mainDetails.recommendations?.results || [])
      .slice(0, 10)
      .map((r: any) => formatMediaItem(r));

    return NextResponse.json({
      media: formatted,
      cast,
      trailerKey,
      seasons,
      recommendations: recs,
      source: "tmdb",
    });
  } catch (err) {
    console.error("Details API error:", err);
    return NextResponse.json({
      media: FALLBACK_MEDIA[0],
      cast: [],
      trailerKey: null,
      seasons: [],
      recommendations: [],
      source: "fallback",
    });
  }
}
