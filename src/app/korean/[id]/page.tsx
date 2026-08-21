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
      title: `${show.name} - Korean Drama Hindi Dubbed`,
      description: show.overview,
    };
  } catch {
    return { title: "K-Drama - StreamNova" };
  }
}

export default async function KoreanPage({ params }: Props) {
  const { id } = await params;
  return <MovieDetailClient id={parseInt(id)} mediaType="korean" />;
}
