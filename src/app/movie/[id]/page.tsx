import type { Metadata } from "next";
import { getMovieDetails, getPosterUrl, getBackdropUrl } from "@/lib/tmdb";
import MovieDetailClient from "./MovieDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(parseInt(id));
    return {
      title: `${movie.title} - Hindi Audio`,
      description: movie.overview,
      openGraph: {
        title: `${movie.title} | StreamNova`,
        description: movie.overview,
        images: movie.backdrop_path
          ? [{ url: getBackdropUrl(movie.backdrop_path, "lg"), width: 1280, height: 720 }]
          : [],
      },
    };
  } catch {
    return { title: "Movie - StreamNova" };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  return <MovieDetailClient id={parseInt(id)} mediaType="movie" />;
}
