import type { Metadata } from "next";
import { getTVDetails, getBackdropUrl } from "@/lib/tmdb";
import MovieDetailClient from "@/app/movie/[id]/MovieDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(parseInt(id));
    return {
      title: `${show.name} - Hindi Dubbed`,
      description: show.overview,
      openGraph: {
        title: `${show.name} | StreamNova`,
        description: show.overview,
        images: show.backdrop_path
          ? [{ url: getBackdropUrl(show.backdrop_path, "lg"), width: 1280, height: 720 }]
          : [],
      },
    };
  } catch {
    return { title: "TV Series - StreamNova" };
  }
}

export default async function TVPage({ params }: Props) {
  const { id } = await params;
  return <MovieDetailClient id={parseInt(id)} mediaType="tv" />;
}
