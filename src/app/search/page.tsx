"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, X } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import AdSlot from "@/components/AdSlot";
import { useLanguage } from "@/hooks/useLanguage";
import type { TMDBResponse } from "@/lib/tmdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, router]);

  const { data, isLoading } = useQuery<TMDBResponse>({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { results: [], page: 1, total_pages: 0, total_results: 0 };
      const res = await axios.get<TMDBResponse>(`/api/tmdb/search?q=${encodeURIComponent(debouncedQuery)}`);
      return res.data;
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const results = data?.results?.filter((r) => r.media_type !== "person") || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8 max-w-2xl">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="w-full bg-gray-800/80 border border-gray-700 text-white pl-12 pr-10 py-4 rounded-xl text-base outline-none focus:border-red-500 transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setDebouncedQuery(""); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results count */}
      {debouncedQuery && (
        <p className="text-gray-400 text-sm mb-6">
          {isLoading ? t("loading") : `${data?.total_results || 0} results for "${debouncedQuery}"`}
        </p>
      )}

      {/* Ad */}
      <AdSlot position="inline" className="mb-6" />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton rounded-lg aspect-[2/3] w-full" />
              <div className="mt-2 space-y-1.5">
                <div className="skeleton h-3 w-4/5 rounded" />
                <div className="skeleton h-2.5 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((movie) => (
            <div key={movie.id} className="w-full">
              <ContentCard
                movie={movie}
                mediaType={movie.media_type === "tv" ? "tv" : "movie"}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && debouncedQuery && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Search size={48} className="text-gray-700" />
          <p className="text-gray-300 text-lg font-semibold">{t("noResults")}</p>
          <p className="text-gray-500">Try a different keyword</p>
        </div>
      )}

      {/* Default state */}
      {!debouncedQuery && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Search size={48} className="text-gray-700" />
          <p className="text-gray-400">{t("search")}</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
