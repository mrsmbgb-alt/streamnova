"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Plus, Check, Volume2, VolumeX, Star } from "lucide-react";
import { getBackdropUrl, type TMDBMovie } from "@/lib/tmdb";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

interface HeroBannerProps {
  movies: TMDBMovie[];
  mediaType?: string;
}

export default function HeroBanner({ movies, mediaType = "movie" }: HeroBannerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [muted] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const { t } = useLanguage();

  const featured = movies.slice(0, 5);
  const current = featured[currentIdx];

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!current) return null;

  const title = current.title || current.name || "";
  const year = (current.release_date || current.first_air_date || "").slice(0, 4);
  const inWatchlist = isInWatchlist(current.id);
  const type = mediaType || current.media_type || "movie";

  const detailHref =
    type === "movie" ? `/movie/${current.id}`
    : type === "anime" ? `/anime/${current.id}`
    : type === "korean" ? `/korean/${current.id}`
    : `/tv/${current.id}`;

  const handleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(current.id);
    else addToWatchlist(current, type);
  };

  return (
    <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {featured.map((movie, idx) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIdx ? "opacity-100" : "opacity-0"
            }`}
          >
            {movie.backdrop_path ? (
              <Image
                src={getBackdropUrl(movie.backdrop_path, "original")}
                alt={movie.title || movie.name || ""}
                fill
                className="object-cover object-top"
                priority={idx === 0}
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
            )}
          </div>
        ))}
      </div>

      {/* Gradients */}
      <div className="hero-gradient absolute inset-0 z-10" />
      <div className="hero-bottom-gradient absolute bottom-0 left-0 right-0 h-48 z-10" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 lg:p-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {current.original_language === "hi" ? (
              <span className="badge-hindi text-sm px-3 py-1">{t("hindiBadge")}</span>
            ) : (
              <span className="badge-dubbed text-sm px-3 py-1">{t("dubbedBadge")}</span>
            )}
            {year && (
              <span className="text-gray-300 text-sm font-medium">{year}</span>
            )}
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={13} className="fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{current.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-2xl">
            {title}
          </h1>

          {/* Hindi Audio tagline */}
          <p className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-2">
            <Volume2 size={14} />
            {t("heroSubtitle")}
          </p>

          {/* Overview */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6 max-w-xl leading-relaxed">
            {current.overview}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={detailHref}
              className="flex items-center gap-2 bg-white text-black px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play size={18} className="fill-black" />
              {t("watchNow")}
            </Link>

            <button
              onClick={handleWatchlist}
              className="flex items-center gap-2 bg-gray-700/80 border border-gray-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all duration-200 backdrop-blur-sm"
            >
              {inWatchlist ? (
                <>
                  <Check size={16} className="text-green-400" />
                  {t("removeWatchlist").split(" ")[0]}
                </>
              ) : (
                <>
                  <Plus size={16} />
                  {t("addWatchlist")}
                </>
              )}
            </button>

            <Link
              href={detailHref}
              className="flex items-center gap-2 bg-gray-700/60 border border-gray-600 text-white px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all duration-200 hidden sm:flex backdrop-blur-sm"
            >
              <Info size={16} />
              {t("moreInfo")}
            </Link>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      {featured.length > 1 && (
        <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex items-center gap-2">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? "bg-red-500 w-6 h-2"
                  : "bg-gray-500/70 hover:bg-gray-400 w-2 h-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
