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
      title: `${show.name} - Hindi Dubbed Anime`,
      description: show.overview,
    };
  } catch {
    return { title: "Anime - StreamNova" };
  }
}

export default async function AnimePage({ params }: Props) {
  const { id } = await params;
  return <MovieDetailClient id={parseInt(id)} mediaType="anime" />;
}
