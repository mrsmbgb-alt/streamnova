import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
// TMDB API key - set TMDB_API_KEY in .env (get free key from themoviedb.org)
const API_KEY = process.env.TMDB_API_KEY || "";

export const IMAGE_BASE = "https://image.tmdb.org/t/p";
export const POSTER_SIZES = { sm: "w185", md: "w342", lg: "w500", xl: "w780", original: "original" };
export const BACKDROP_SIZES = { sm: "w300", md: "w780", lg: "w1280", original: "original" };

export function getPosterUrl(path: string | null, size: keyof typeof POSTER_SIZES = "md") {
  if (!path) return "/placeholder-poster.jpg";
  return `${IMAGE_BASE}/${POSTER_SIZES[size]}${path}`;
}

export function getBackdropUrl(path: string | null, size: keyof typeof BACKDROP_SIZES = "lg") {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${IMAGE_BASE}/${BACKDROP_SIZES[size]}${path}`;
}

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  popularity: number;
  media_type?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  imdb_id?: string;
  spoken_languages?: { iso_639_1: string; name: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; profile_path: string | null }[];
  };
  videos?: {
    results: { id: string; key: string; site: string; type: string; name: string }[];
  };
  similar?: { results: TMDBMovie[] };
  seasons?: { id: number; season_number: number; episode_count: number; poster_path: string | null; name: string }[];
  origin_country?: string[];
  networks?: { id: number; name: string; logo_path: string | null }[];
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: API_KEY },
  timeout: 10000,
});

// Hindi movies (original language Hindi or Indian productions)
export async function getHindiMovies(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/movie", {
    params: {
      with_original_language: "hi",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
      include_adult: false,
    },
  });
  return res.data;
}

// Trending (Hindi dubbed - we fetch trending and label with hindi audio)
export async function getTrendingAll(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/trending/all/week", {
    params: { language: "en-US", page },
  });
  return res.data;
}

export async function getTrendingMovies(): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/trending/movie/week", {
    params: { language: "en-US" },
  });
  return res.data;
}

// Bollywood / Hindi Movies
export async function getBollywoodMovies(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/movie", {
    params: {
      with_original_language: "hi",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
      include_adult: false,
      "vote_count.gte": 10,
    },
  });
  return res.data;
}

// Top Rated Hindi
export async function getTopRatedHindi(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/movie", {
    params: {
      with_original_language: "hi",
      sort_by: "vote_average.desc",
      page,
      language: "en-US",
      include_adult: false,
      "vote_count.gte": 100,
    },
  });
  return res.data;
}

// Hindi TV Series (Indian TV in Hindi)
export async function getHindiTVSeries(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/tv", {
    params: {
      with_original_language: "hi",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
    },
  });
  return res.data;
}

// Korean Drama (Hindi Dubbed - Korean originals available with Hindi dub)
export async function getKoreanDramas(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/tv", {
    params: {
      with_original_language: "ko",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
      with_genres: "18",
    },
  });
  return res.data;
}

// Anime (Hindi Dubbed - Japanese animation)
export async function getAnime(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/tv", {
    params: {
      with_original_language: "ja",
      with_genres: "16",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
    },
  });
  return res.data;
}

// Anime Movies
export async function getAnimeMovies(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/discover/movie", {
    params: {
      with_original_language: "ja",
      with_genres: "16",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
    },
  });
  return res.data;
}

// Get movie details
export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  const res = await tmdbClient.get(`/movie/${id}`, {
    params: {
      language: "en-US",
      append_to_response: "credits,videos,similar,images",
    },
  });
  return res.data;
}

// Get TV details
export async function getTVDetails(id: number): Promise<TMDBMovie> {
  const res = await tmdbClient.get(`/tv/${id}`, {
    params: {
      language: "en-US",
      append_to_response: "credits,videos,similar,images",
    },
  });
  return res.data;
}

// Search
export async function searchMulti(query: string, page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/search/multi", {
    params: { query, page, language: "en-US", include_adult: false },
  });
  return res.data;
}

// Genre list
export async function getMovieGenres(): Promise<{ genres: { id: number; name: string }[] }> {
  const res = await tmdbClient.get("/genre/movie/list", { params: { language: "en-US" } });
  return res.data;
}

export async function getTVGenres(): Promise<{ genres: { id: number; name: string }[] }> {
  const res = await tmdbClient.get("/genre/tv/list", { params: { language: "en-US" } });
  return res.data;
}

// Popular movies (Hindi dubbed tag)
export async function getPopularMovies(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/movie/popular", {
    params: { language: "en-US", page },
  });
  return res.data;
}

// Now Playing
export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse> {
  const res = await tmdbClient.get("/movie/now_playing", {
    params: { language: "en-US", page, region: "IN" },
  });
  return res.data;
}

// Discover by genre
export async function discoverMoviesByGenre(genreId: number, page = 1, language = "hi"): Promise<TMDBResponse> {
  const params: Record<string, string | number | boolean> = {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
    language: "en-US",
    include_adult: false,
  };
  if (language === "hi") {
    params.with_original_language = "hi";
  }
  const res = await tmdbClient.get("/discover/movie", { params });
  return res.data;
}

// Determine if content has Hindi audio (heuristic based on original language)
export function hasHindiAudio(movie: TMDBMovie): boolean {
  if (movie.original_language === "hi") return true;
  // Popular content known to have Hindi dubs
  const hindiDubbedLanguages = ["ko", "ja", "en", "fr", "es", "de", "it", "zh"];
  if (hindiDubbedLanguages.includes(movie.original_language)) return true;
  return false;
}

export function getHindiLabel(movie: TMDBMovie): string {
  if (movie.original_language === "hi") return "हिंदी";
  return "Hindi Dubbed";
}

// Video streaming embed URLs
export function getEmbedUrl(tmdbId: number, mediaType: "movie" | "tv", season?: number, episode?: number): string {
  if (mediaType === "movie") {
    return `https://vidsrc.to/embed/movie/${tmdbId}`;
  } else {
    if (season && episode) {
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
    }
    return `https://vidsrc.to/embed/tv/${tmdbId}/1/1`;
  }
}

export function getAlternateEmbedUrl(tmdbId: number, mediaType: "movie" | "tv", season?: number, episode?: number): string {
  if (mediaType === "movie") {
    return `https://embed.su/embed/movie/${tmdbId}`;
  } else {
    const s = season || 1;
    const e = episode || 1;
    return `https://embed.su/embed/tv/${tmdbId}/${s}/${e}`;
  }
}
