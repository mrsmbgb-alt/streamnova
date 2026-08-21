"use client";

import { Star, Play, Check, Plus, Volume2 } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import { triggerPopUnderAd } from "@/lib/ad-service";

interface MediaCardProps {
  media: TMDBMedia;
  onSelect: (media: TMDBMedia) => void;
  onPlay: (media: TMDBMedia) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (media: TMDBMedia) => void;
}

export default function MediaCard({
  media,
  onSelect,
  onPlay,
  isInWatchlist = false,
  onToggleWatchlist,
}: MediaCardProps) {
  const releaseYear = (media.release_date || media.first_air_date || "2024").slice(0, 4);

  const handleCardPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPopUnderAd();
    onPlay(media);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(media);
    }
  };

  return (
    <div
      onClick={() => onSelect(media)}
      className="group relative flex-none w-[150px] sm:w-[180px] lg:w-[200px] cursor-pointer select-none rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-red-600/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/60"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={
            media.poster_path ||
            "https://images.unsplash.com/photo-1518676599602-2170de9d6600?w=500&auto=format&fit=crop"
          }
          alt={media.title || "Media"}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="bg-red-600/95 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md border border-red-400/40">
            HINDI DUB
          </span>
          <span className="bg-black/75 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-500/30">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            {media.vote_average ? media.vote_average.toFixed(1) : "7.5"}
          </span>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleCardPlay}
              className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-lg shadow-red-900/60"
              title="Play Hindi Stream"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </button>

            {onToggleWatchlist && (
              <button
                onClick={handleWatchlistClick}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                  isInWatchlist
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                    : "bg-neutral-900/90 border-neutral-700 text-white hover:bg-neutral-800"
                }`}
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}
          </div>

          <p className="text-[11px] font-bold text-white line-clamp-1">{media.title}</p>
          <div className="flex items-center justify-between text-[10px] text-neutral-300 mt-0.5">
            <span>{releaseYear}</span>
            <span className="uppercase text-red-400 font-semibold">{media.media_type}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Title below poster */}
      <div className="p-2.5 bg-neutral-900">
        <h3 className="text-xs font-bold text-neutral-100 line-clamp-1 group-hover:text-red-400 transition-colors">
          {media.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
          <span>{releaseYear}</span>
          <span className="text-amber-400 font-medium flex items-center gap-0.5">
            <Volume2 className="w-2.5 h-2.5 text-red-400" /> Hindi
          </span>
        </div>
      </div>
    </div>
  );
}
