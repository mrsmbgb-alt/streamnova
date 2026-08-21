"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import SkeletonCard from "./SkeletonCard";
import type { TMDBMovie } from "@/lib/tmdb";

interface ContentRowProps {
  title: string;
  movies: TMDBMovie[];
  mediaType?: string;
  isLoading?: boolean;
  badge?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function ContentRow({
  title,
  movies,
  mediaType = "movie",
  isLoading = false,
  badge,
  size = "md",
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = 400;
    rowRef.current.scrollBy({
      left: dir === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-lg sm:text-xl font-bold">{title}</h2>
          {badge}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="row-scroll px-4 lg:px-8"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} size={size} />)
          : movies.map((movie) => (
              <ContentCard
                key={movie.id}
                movie={movie}
                mediaType={mediaType}
                size={size}
              />
            ))}
      </div>
    </section>
  );
}
