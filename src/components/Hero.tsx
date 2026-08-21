"use client";

import { useState } from "react";
import { Play, Plus, Check, Star, Info, Volume2, Sparkles, X } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import { triggerPopUnderAd } from "@/lib/ad-service";

interface HeroProps {
  media: TMDBMedia | null;
  onSelect: (media: TMDBMedia) => void;
  onPlay: (media: TMDBMedia) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (media: TMDBMedia) => void;
}

export default function Hero({ media, onSelect, onPlay, isInWatchlist, onToggleWatchlist }: HeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!media) return null;

  const handlePlayClick = () => {
    triggerPopUnderAd();
    onPlay(media);
  };

  const releaseYear = (media.release_date || media.first_air_date || "2024").slice(0, 4);

  return (
    <div className="relative w-full h-[78vh] min-h-[500px] max-h-[750px] overflow-hidden bg-black text-white">
      {/* Background Image with Gradients */}
      <div className="absolute inset-0">
        <img
          src={media.backdrop_path || media.poster_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop"}
          alt={media.title || "Featured"}
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Audio Badge & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-red-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Hindi Dual Audio Default
            </span>
            <span className="bg-neutral-900/90 border border-neutral-700/80 text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {media.vote_average.toFixed(1)} / 10
            </span>
            <span className="bg-neutral-900/80 border border-neutral-700/60 text-neutral-300 text-xs font-semibold px-2 py-1 rounded-md">
              {releaseYear}
            </span>
            <span className="bg-neutral-900/80 border border-neutral-700/60 text-neutral-300 text-xs font-semibold px-2 py-1 rounded-md uppercase">
              {media.media_type === "movie" ? "Movie" : media.media_type === "kdrama" ? "K-Drama" : media.media_type === "anime" ? "Anime" : "TV Series"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-xl line-clamp-2 leading-tight">
            {media.title}
          </h1>

          {/* Genres */}
          {media.genres && media.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300 font-medium">
              {media.genres.slice(0, 4).map((g) => (
                <span key={g.id || g.name} className="px-2 py-0.5 rounded bg-neutral-900/60 border border-neutral-800">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <p className="text-neutral-300 text-xs sm:text-sm line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {media.overview}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayClick}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-xl shadow-red-900/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(media)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                isInWatchlist
                  ? "bg-neutral-800/90 border-neutral-600 text-emerald-400"
                  : "bg-neutral-900/80 border-neutral-700/80 text-white hover:bg-neutral-800"
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{isInWatchlist ? "In Watchlist" : "Watchlist"}</span>
            </button>

            <button
              onClick={() => onSelect(media)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 hover:bg-neutral-800 text-white font-semibold text-sm transition-all"
            >
              <Info className="w-4 h-4 text-neutral-300" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
