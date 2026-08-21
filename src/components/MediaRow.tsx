"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import MediaCard from "./MediaCard";

interface MediaRowProps {
  title: string;
  subtitle?: string;
  items: TMDBMedia[];
  onSelect: (media: TMDBMedia) => void;
  onPlay: (media: TMDBMedia) => void;
  watchlistIds?: string[];
  onToggleWatchlist?: (media: TMDBMedia) => void;
}

export default function MediaRow({
  title,
  subtitle,
  items,
  onSelect,
  onPlay,
  watchlistIds = [],
  onToggleWatchlist,
}: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2 py-4 relative group/row">
      {/* Category Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b from-red-500 to-amber-500 rounded-full" />
            {title}
          </h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleScroll("left")}
            className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={rowRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, idx) => (
          <MediaCard
            key={`${item.id}-${idx}`}
            media={item}
            onSelect={onSelect}
            onPlay={onPlay}
            isInWatchlist={watchlistIds.includes(String(item.id))}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
}
