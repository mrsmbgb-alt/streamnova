import { NextResponse } from "next/server";
import {
  getTrendingMovies,
  getBollywoodMovies,
  getTopRatedHindi,
  getKoreanDramas,
  getAnime,
  getNowPlayingMovies,
  getPopularMovies,
} from "@/lib/tmdb";

export const revalidate = 3600; // Cache for 1 hour (ISR)

export async function GET() {
  try {
    const [trending, bollywood, topRated, koreanDramas, anime, nowPlaying, popular] = await Promise.allSettled([
      getTrendingMovies(),
      getBollywoodMovies(),
      getTopRatedHindi(),
      getKoreanDramas(),
      getAnime(),
      getNowPlayingMovies(),
      getPopularMovies(),
    ]);

    return NextResponse.json({
      trending: trending.status === "fulfilled" ? trending.value.results.slice(0, 20) : [],
      bollywood: bollywood.status === "fulfilled" ? bollywood.value.results.slice(0, 20) : [],
      topRated: topRated.status === "fulfilled" ? topRated.value.results.slice(0, 20) : [],
      koreanDramas: koreanDramas.status === "fulfilled" ? koreanDramas.value.results.slice(0, 20) : [],
      anime: anime.status === "fulfilled" ? anime.value.results.slice(0, 20) : [],
      nowPlaying: nowPlaying.status === "fulfilled" ? nowPlaying.value.results.slice(0, 20) : [],
      popular: popular.status === "fulfilled" ? popular.value.results.slice(0, 10) : [],
    });
  } catch (error) {
    console.error("Home API error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
