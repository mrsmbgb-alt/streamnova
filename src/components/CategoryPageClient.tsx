"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ContentCard from "./ContentCard";
import SkeletonCard from "./SkeletonCard";
import GenreFilter from "./GenreFilter";
import AdSlot from "./AdSlot";
import HeroBanner from "./HeroBanner";
import { useLanguage } from "@/hooks/useLanguage";
import type { TMDBMovie, TMDBResponse } from "@/lib/tmdb";
import { ChevronDown, Film } from "lucide-react";

interface Props {
  category: string;
  title: string;
  subtitle: string;
  mediaType: string;
  heroGradient?: string;
}

export default function CategoryPageClient({
  category,
  title,
  subtitle,
  mediaType,
}: Props) {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [allMovies, setAllMovies] = useState<TMDBMovie[]>([]);
  const { t } = useLanguage();

  const { data, isLoading, isFetching } = useQuery<TMDBResponse>({
    queryKey: ["category", category, page, selectedGenre],
    queryFn: async () => {
      const params = new URLSearchParams({
        cat: category,
        page: page.toString(),
      });
      if (selectedGenre > 0) params.set("genre", selectedGenre.toString());
      const res = await axios.get<TMDBResponse>(`/api/tmdb/category?${params}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllMovies(data.results);
      } else {
        setAllMovies((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const newItems = data.results.filter((m) => !ids.has(m.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  const handleGenreChange = (genre: number) => {
    setSelectedGenre(genre);
    setPage(1);
    setAllMovies([]);
  };

  const loadMore = () => {
    if (data && page < data.total_pages) {
      setPage((p) => p + 1);
    }
  };

  const heroMovies = allMovies.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {heroMovies.length > 0 && (
        <HeroBanner movies={heroMovies} mediaType={mediaType} />
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Genre filter */}
        <div className="mb-6 overflow-x-auto pb-2">
          <GenreFilter selected={selectedGenre} onChange={handleGenreChange} />
        </div>

        {/* Ad */}
        <AdSlot position="inline" className="mb-6" />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading && page === 1
            ? Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-full">
                  <div className="skeleton rounded-lg aspect-[2/3] w-full" />
                  <div className="mt-2 space-y-1.5">
                    <div className="skeleton h-3 w-4/5 rounded" />
                    <div className="skeleton h-2.5 w-2/3 rounded" />
                  </div>
                </div>
              ))
            : allMovies.map((movie) => (
                <div key={movie.id} className="w-full">
                  <ContentCard movie={movie} mediaType={mediaType} size="sm" />
                </div>
              ))}
        </div>

        {/* No results */}
        {!isLoading && allMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Film size={48} className="text-gray-700" />
            <p className="text-gray-400">{t("noResults")}</p>
          </div>
        )}

        {/* Load more */}
        {allMovies.length > 0 && data && page < (data.total_pages || 1) && (
          <div className="flex justify-center mt-10 mb-8">
            <button
              onClick={loadMore}
              disabled={isFetching}
              className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              {isFetching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ChevronDown size={18} />
              )}
              Load More
            </button>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="flex justify-center my-8">
          <AdSlot position="footer" />
        </div>
      </div>
    </div>
  );
}
