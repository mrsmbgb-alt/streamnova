"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star, Info } from "lucide-react";
import { getPosterUrl, getHindiLabel, type TMDBMovie } from "@/lib/tmdb";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

interface ContentCardProps {
  movie: TMDBMovie;
  mediaType?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export default function ContentCard({
  movie,
  mediaType,
  size = "md",
  showBadge = true,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const { t } = useLanguage();

  const type = mediaType || movie.media_type || "movie";
  const title = movie.title || movie.name || "Unknown";
  const inWatchlist = isInWatchlist(movie.id);
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const hindiLabel = getHindiLabel(movie);

  const detailHref = type === "movie" || type === "bollywood"
    ? `/movie/${movie.id}`
    : type === "anime"
    ? `/anime/${movie.id}`
    : type === "korean"
    ? `/korean/${movie.id}`
    : `/tv/${movie.id}`;

  const sizeClasses = {
    sm: "w-[130px] sm:w-[150px]",
    md: "w-[150px] sm:w-[180px]",
    lg: "w-[180px] sm:w-[220px]",
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, type);
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} flex-shrink-0 relative group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={detailHref} className="block">
        {/* Poster */}
        <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-[2/3]">
          {movie.poster_path && !imageError ? (
            <Image
              src={getPosterUrl(movie.poster_path, size === "lg" ? "lg" : "md")}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 150px, 220px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-3">
              <Play size={28} className="text-gray-600 mb-2" />
              <span className="text-gray-400 text-xs text-center leading-tight">{title}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <Link
                href={detailHref}
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Play size={18} className="text-black fill-black ml-0.5" />
              </Link>
              <button
                onClick={handleWatchlistToggle}
                className="flex items-center justify-center w-10 h-10 bg-gray-700/80 border border-gray-500 rounded-full hover:bg-gray-600 transition-colors"
              >
                {inWatchlist ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Plus size={16} className="text-white" />
                )}
              </button>
            </div>
            <Link
              href={detailHref}
              className="flex items-center gap-1 text-white text-xs hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={12} />
              {t("moreInfo")}
            </Link>
          </div>

          {/* Badges */}
          {showBadge && (
            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
              {movie.original_language === "hi" ? (
                <span className="badge-hindi">{t("hindiBadge")}</span>
              ) : (
                <span className="badge-dubbed">{t("dubbedBadge")}</span>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
            <Star size={9} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-[10px] font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-medium line-clamp-1 group-hover:text-red-400 transition-colors">
            {title}
          </p>
          <p className="text-gray-500 text-[10px] mt-0.5">{year} • {hindiLabel}</p>
        </div>
      </Link>
    </div>
  );
}
