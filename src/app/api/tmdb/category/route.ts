import { NextRequest, NextResponse } from "next/server";
import {
  getBollywoodMovies,
  getHindiTVSeries,
  getKoreanDramas,
  getAnime,
  getAnimeMovies,
  getTopRatedHindi,
  getPopularMovies,
  discoverMoviesByGenre,
} from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("cat") || "movies";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const genre = req.nextUrl.searchParams.get("genre");

  try {
    let data;

    if (genre) {
      data = await discoverMoviesByGenre(parseInt(genre), page);
    } else {
      switch (category) {
        case "movies":
          data = await getBollywoodMovies(page);
          break;
        case "tvseries":
          data = await getHindiTVSeries(page);
          break;
        case "korean":
          data = await getKoreanDramas(page);
          break;
        case "anime":
          data = await getAnime(page);
          break;
        case "anime-movies":
          data = await getAnimeMovies(page);
          break;
        case "toprated":
          data = await getTopRatedHindi(page);
          break;
        case "popular":
          data = await getPopularMovies(page);
          break;
        default:
          data = await getBollywoodMovies(page);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}
