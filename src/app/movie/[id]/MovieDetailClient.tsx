"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Play, Plus, Check, Star, Clock, Calendar,
  ArrowLeft, Volume2, Globe, Users,
} from "lucide-react";
import { getPosterUrl, getBackdropUrl, getHindiLabel, type TMDBMovie } from "@/lib/tmdb";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import VideoPlayer from "@/components/VideoPlayer";
import ContentRow from "@/components/ContentRow";
import { SkeletonDetail } from "@/components/SkeletonCard";
import AdSlot from "@/components/AdSlot";
import { triggerPopunder } from "@/components/AdSlot";

interface Props {
  id: number;
  mediaType: "movie" | "tv" | "anime" | "korean";
}

export default function MovieDetailClient({ id, mediaType }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "similar">("overview");
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const { t } = useLanguage();

  const apiType = mediaType === "movie" ? "movie" : "tv";

  const { data: movie, isLoading, error } = useQuery<TMDBMovie>({
    queryKey: ["detail", apiType, id],
    queryFn: async () => {
      const res = await axios.get<TMDBMovie>(`/api/tmdb/${apiType}/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <SkeletonDetail />;
  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <p className="text-white text-xl">{t("errorMsg")}</p>
        <Link href="/" className="text-red-400 hover:underline">{t("backToHome")}</Link>
      </div>
    );
  }

  const title = movie.title || movie.name || "";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const inWatchlist = isInWatchlist(movie.id);
  const hindiLabel = getHindiLabel(movie);
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const director = movie.credits?.crew?.find((c) => c.job === "Director");

  const handleWatchNow = () => {
    setIsPlaying(true);
    // Trigger pop-under ad
    triggerPopunder();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Backdrop */}
      <div className="relative">
        <div className="relative h-[45vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
          {movie.backdrop_path && (
            <Image
              src={getBackdropUrl(movie.backdrop_path, "original")}
              alt={title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            className="absolute top-20 left-4 lg:left-8 flex items-center gap-2 glass px-3 py-2 rounded-lg text-white text-sm hover:bg-white/20 transition-all z-10"
          >
            <ArrowLeft size={16} />
            {t("backToHome")}
          </Link>
        </div>

        {/* Detail Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-32 sm:-mt-40 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-10">
            {/* Poster */}
            <div className="flex-shrink-0 w-36 sm:w-48 lg:w-56">
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[2/3]">
                <Image
                  src={getPosterUrl(movie.poster_path, "lg")}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 144px, 224px"
                />
              </div>
              {/* Hindi badge on poster */}
              <div className="mt-2 flex justify-center">
                {movie.original_language === "hi" ? (
                  <span className="badge-hindi text-sm px-3 py-1">{t("hindiBadge")}</span>
                ) : (
                  <span className="badge-dubbed text-sm px-3 py-1">{t("dubbedBadge")}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 sm:pt-8">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                {title}
              </h1>
              {movie.tagline && (
                <p className="text-gray-400 italic text-sm mb-3">"{movie.tagline}"</p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} className="fill-yellow-400" />
                  <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500 text-xs">({movie.vote_count?.toLocaleString()})</span>
                </div>
                {year && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar size={13} />
                    <span>{year}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={13} />
                    <span>{movie.runtime} {t("minutes")}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-red-400">
                  <Volume2 size={13} />
                  <span className="font-semibold">{hindiLabel}</span>
                </div>
                {movie.number_of_seasons && (
                  <div className="text-gray-400">
                    {movie.number_of_seasons} {t("seasons")}
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={handleWatchNow}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-900/50 pulse-red"
                >
                  <Play size={18} className="fill-white" />
                  {t("watchNow")} ({t("hindiAudio")})
                </button>

                <button
                  onClick={() => {
                    if (inWatchlist) removeFromWatchlist(movie.id);
                    else addToWatchlist(movie, mediaType);
                  }}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all"
                >
                  {inWatchlist ? (
                    <><Check size={16} className="text-green-400" /> {t("removeWatchlist").split(" ")[0]}</>
                  ) : (
                    <><Plus size={16} /> {t("addWatchlist")}</>
                  )}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all"
                  >
                    <Play size={14} className="text-red-400" />
                    {t("trailer")}
                  </a>
                )}
              </div>

              {/* Extra info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {director && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">{t("director")}</span>
                    <p className="text-white font-medium mt-0.5">{director.name}</p>
                  </div>
                )}
                {movie.original_language && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">{t("language")}</span>
                    <p className="text-white font-medium mt-0.5 flex items-center gap-1">
                      <Globe size={12} className="text-blue-400" />
                      {hindiLabel}
                    </p>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Status</span>
                    <p className="text-white font-medium mt-0.5">{movie.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      {isPlaying && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
          <VideoPlayer
            tmdbId={id}
            mediaType={apiType === "tv" ? "tv" : "movie"}
            title={title}
          />
        </div>
      )}

      {/* Inline Ad */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        <AdSlot position="inline" />
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <div className="flex gap-1 border-b border-gray-800 mb-6">
          {(["overview", "cast", "similar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab === "overview" ? t("overview")
               : tab === "cast" ? t("cast")
               : t("similar")}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="max-w-3xl">
            <p className="text-gray-300 leading-relaxed text-base">{movie.overview}</p>
          </div>
        )}

        {/* Cast */}
        {activeTab === "cast" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {movie.credits?.cast?.slice(0, 10).map((person) => (
              <div key={person.id} className="text-center">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                  {person.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users size={24} className="text-gray-600" />
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold line-clamp-1">{person.name}</p>
                <p className="text-gray-500 text-[10px] line-clamp-1">{person.character}</p>
              </div>
            ))}
          </div>
        )}

        {/* Similar */}
        {activeTab === "similar" && movie.similar?.results && (
          <div className="-mx-4 lg:-mx-8">
            <ContentRow
              title={t("similar")}
              movies={movie.similar.results.slice(0, 15)}
              mediaType={mediaType}
            />
          </div>
        )}
      </div>

      <div className="pb-12" />
    </div>
  );
}
