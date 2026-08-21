"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import AdSlot from "@/components/AdSlot";
import { SkeletonHero } from "@/components/SkeletonCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { TMDBMovie } from "@/lib/tmdb";
import { Flame, Star, Tv, Clapperboard, Globe } from "lucide-react";

interface HomeData {
  trending: TMDBMovie[];
  bollywood: TMDBMovie[];
  topRated: TMDBMovie[];
  koreanDramas: TMDBMovie[];
  anime: TMDBMovie[];
  nowPlaying: TMDBMovie[];
  popular: TMDBMovie[];
}

export default function HomePage() {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery<HomeData>({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await axios.get<HomeData>("/api/tmdb/home");
      return res.data;
    },
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-white text-xl font-bold">{t("errorMsg")}</h2>
        <p className="text-gray-400">{t("serverBusy")}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const heroMovies = data?.trending || data?.bollywood || [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {isLoading ? (
        <SkeletonHero />
      ) : (
        <HeroBanner movies={heroMovies.slice(0, 5)} mediaType="movie" />
      )}

      {/* Content Rows */}
      <div className="pt-6">
        {/* Bollywood */}
        <ContentRow
          title={t("bollywood")}
          movies={data?.bollywood || []}
          mediaType="movie"
          isLoading={isLoading}
          badge={
            <span className="badge-hindi text-sm px-2 py-0.5">{t("hindiBadge")}</span>
          }
          size="md"
        />

        {/* Trending */}
        <ContentRow
          title={t("trending")}
          movies={data?.trending || []}
          mediaType="movie"
          isLoading={isLoading}
          badge={
            <span className="flex items-center gap-1 text-orange-400 text-xs font-bold">
              <Flame size={14} />
              Hot
            </span>
          }
          size="md"
        />

        {/* Ad Inline */}
        <div className="py-4 px-4 lg:px-8">
          <AdSlot position="inline" />
        </div>

        {/* Now Playing */}
        <ContentRow
          title={t("newReleases")}
          movies={data?.nowPlaying || []}
          mediaType="movie"
          isLoading={isLoading}
          badge={
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              New
            </span>
          }
        />

        {/* Korean Drama */}
        <ContentRow
          title={t("koreanHits")}
          movies={data?.koreanDramas || []}
          mediaType="korean"
          isLoading={isLoading}
          badge={
            <span className="flex items-center gap-1 text-purple-400 text-xs font-bold">
              <Tv size={12} />
              K-Drama
            </span>
          }
        />

        {/* Anime */}
        <ContentRow
          title={t("popularAnime")}
          movies={data?.anime || []}
          mediaType="anime"
          isLoading={isLoading}
          badge={
            <span className="flex items-center gap-1 text-blue-400 text-xs font-bold">
              <Star size={12} />
              Anime
            </span>
          }
        />

        {/* Top Rated */}
        <ContentRow
          title={t("topRated")}
          movies={data?.topRated || []}
          mediaType="movie"
          isLoading={isLoading}
          badge={
            <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <Star size={12} className="fill-yellow-400" />
              Top
            </span>
          }
          size="lg"
        />

        {/* Footer Ad */}
        <div className="py-4 px-4 lg:px-8 flex justify-center">
          <AdSlot position="footer" />
        </div>
      </div>
    </div>
  );
}
