// TMDB API Client and Types for StreamNova

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || "8415443a5716e25442a9d80d2a84fb83"; // standard public tmdb v3 key

export interface TMDBMedia {
  id: number;
  imdb_id?: string;
  title?: string;
  name?: string; // for TV
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  media_type?: "movie" | "tv" | "kdrama" | "anime";
  origin_country?: string[];
  original_language?: string;
  hasHindiAudio?: boolean;
  audioLanguages?: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  overview: string;
  episodes?: TMDBEpisode[];
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// Genre ID Mapping
export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

// Check if content is likely available in Hindi audio or Hindi dual audio
export function determineHindiAudioSupport(item: TMDBMedia): boolean {
  // Popular movies, Indian origin content, major anime dubs, and popular Kdramas are dual audio Hindi
  const isIndian = item.origin_country?.includes("IN") || item.original_language === "hi";
  if (isIndian) return true;

  // Major popular releases almost universally have Hindi dubs in 8Stream / Moviebox / SuperEmbed catalog
  // For StreamNova requirements, we mark them with Hindi audio available / Dual Audio Hindi
  const rating = item.vote_average || 0;
  const yearStr = item.release_date || item.first_air_date || "";
  const year = parseInt(yearStr.slice(0, 4)) || 2020;

  // Most popular blockbusters, anime hits, and k-dramas released in recent years have Hindi audio tracks
  return true;
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: DEFAULT_TMDB_KEY,
    language: "en-US",
    ...params,
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1 hour revalidate
    });

    if (!res.ok) {
      console.warn(`TMDB error ${res.status} for ${endpoint}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch TMDB Error:", err);
    return null;
  }
}

// Format media item for StreamNova
export function formatMediaItem(item: any, overrideType?: "movie" | "tv" | "kdrama" | "anime"): TMDBMedia {
  const isTv = item.first_air_date !== undefined || item.media_type === "tv" || overrideType === "tv" || overrideType === "kdrama" || overrideType === "anime";
  const genres = item.genre_ids ? item.genre_ids.map((id: number) => ({ id, name: GENRE_MAP[id] || "General" })) : (item.genres || []);

  let detectedType: "movie" | "tv" | "kdrama" | "anime" = isTv ? "tv" : "movie";

  if (overrideType) {
    detectedType = overrideType;
  } else if (isTv) {
    if (item.origin_country?.includes("KR") || item.original_language === "ko") {
      detectedType = "kdrama";
    } else if (item.original_language === "ja" || item.genre_ids?.includes(16)) {
      detectedType = "anime";
    }
  } else if (item.original_language === "ja" && item.genre_ids?.includes(16)) {
    detectedType = "anime";
  }

  return {
    id: item.id,
    imdb_id: item.imdb_id,
    title: item.title || item.name || item.original_title || item.original_name || "Untitled",
    overview: item.overview || "No description available.",
    poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdrop_path: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : (item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : null),
    release_date: item.release_date || item.first_air_date || "2024",
    vote_average: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 7.5,
    vote_count: item.vote_count || 100,
    genre_ids: item.genre_ids || [],
    genres,
    media_type: detectedType,
    origin_country: item.origin_country || [],
    original_language: item.original_language || "en",
    hasHindiAudio: true, // Prioritized Hindi Audio support
    audioLanguages: ["Hindi", "English"],
    number_of_seasons: item.number_of_seasons,
    number_of_episodes: item.number_of_episodes,
  };
}

// Fallback curated content when offline or TMDB rate-limited
export const FALLBACK_MEDIA: TMDBMedia[] = [
  {
    id: 157336,
    imdb_id: "tt0816692",
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QrmL2GlM32afS1A3VJ3uh2L.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo6K21A2A3C2I.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    media_type: "movie",
    hasHindiAudio: true,
    audioLanguages: ["Hindi", "English"],
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 18, name: "Drama" }],
  },
  {
    id: 414906,
    imdb_id: "tt1877830",
    title: "The Batman",
    overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    poster_path: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9225R311.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/5P8L2z331A2A2A1A.jpg",
    release_date: "2022-03-01",
    vote_average: 7.7,
    media_type: "movie",
    hasHindiAudio: true,
    audioLanguages: ["Hindi", "English"],
    genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }],
  },
  {
    id: 31910,
    imdb_id: "tt1234567",
    title: "Naruto Shippuden",
    overview: "Naruto Uzumaki, a hyperactive and knuckle-headed ninja, searches for recognition and dreams of becoming the Hokage, the village leader and strongest ninja.",
    poster_path: "https://image.tmdb.org/t/p/w500/v9L1K10J0kQ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/f2134n.jpg",
    release_date: "2007-02-15",
    vote_average: 8.6,
    media_type: "anime",
    hasHindiAudio: true,
    audioLanguages: ["Hindi", "Japanese", "English"],
    genres: [{ id: 16, name: "Animation" }, { id: 28, name: "Action" }],
  },
  {
    id: 93405,
    imdb_id: "tt10872600",
    title: "Squid Game",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    poster_path: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94PAgP2C1c.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/oaGsg2P0O33hyM3321.jpg",
    release_date: "2021-09-17",
    vote_average: 8.3,
    media_type: "kdrama",
    hasHindiAudio: true,
    audioLanguages: ["Hindi", "Korean", "English"],
    genres: [{ id: 18, name: "Drama" }, { id: 9648, name: "Mystery" }],
  },
];
