import { NextResponse } from "next/server";
import { fetchFromTMDB, formatMediaItem, FALLBACK_MEDIA } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("type") || "movie"; // movie, tv, kdrama, anime
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const rating = searchParams.get("rating");
  const page = searchParams.get("page") || "1";

  try {
    let endpoint = "/discover/movie";
    let params: Record<string, string> = {
      page,
      sort_by: "popularity.desc",
    };

    if (category === "movie") {
      endpoint = "/discover/movie";
      if (genre) params["with_genres"] = genre;
      if (year) params["primary_release_year"] = year;
    } else if (category === "tv") {
      endpoint = "/discover/tv";
      if (genre) params["with_genres"] = genre;
      if (year) params["first_air_date_year"] = year;
    } else if (category === "kdrama") {
      endpoint = "/discover/tv";
      params["with_origin_country"] = "KR";
      if (genre) params["with_genres"] = genre;
      if (year) params["first_air_date_year"] = year;
    } else if (category === "anime") {
      // Anime: Animation genre 16 + origin JP/KR or Animation genre
      endpoint = "/discover/tv";
      params["with_genres"] = genre ? `16,${genre}` : "16";
      params["with_original_language"] = "ja";
      if (year) params["first_air_date_year"] = year;
    }

    if (rating) {
      params["vote_average.gte"] = rating;
    }

    const data = await fetchFromTMDB(endpoint, params);

    if (!data || !data.results || !Array.isArray(data.results)) {
      const filteredFallback = FALLBACK_MEDIA.filter((m) => {
        if (category === "kdrama") return m.media_type === "kdrama";
        if (category === "anime") return m.media_type === "anime";
        return m.media_type === category || category === "movie";
      });
      return NextResponse.json({
        results: filteredFallback.length > 0 ? filteredFallback : FALLBACK_MEDIA,
        page: 1,
        total_pages: 1,
        source: "fallback",
      });
    }

    const formatted = data.results
      .filter((item: any) => item.poster_path && (item.title || item.name))
      .map((item: any) => formatMediaItem(item, category as any));

    return NextResponse.json({
      results: formatted,
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      source: "tmdb",
    });
  } catch (err) {
    console.error("Category route error:", err);
    return NextResponse.json({ results: FALLBACK_MEDIA, page: 1, total_pages: 1, source: "fallback" });
  }
}
