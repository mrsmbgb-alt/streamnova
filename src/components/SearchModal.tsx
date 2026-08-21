"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Star, Film, Loader2, Sparkles } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import { triggerPopUnderAd } from "@/lib/ad-service";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: TMDBMedia) => void;
  onPlayMedia: (media: TMDBMedia) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectMedia, onPlayMedia }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl space-y-6 mt-8">
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-black text-xl">
            <Sparkles className="w-6 h-6 text-red-500" />
            <span>Search StreamNova Directory</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Field */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie title, anime, K-drama, cast..."
            className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-red-600 text-white placeholder-neutral-500 rounded-2xl pl-14 pr-12 py-4 text-base sm:text-lg font-medium outline-none transition shadow-2xl"
          />
          {loading ? (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 animate-spin" />
          ) : (
            query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )
          )}
        </div>

        {/* Search Results */}
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectMedia(item);
                    onClose();
                  }}
                  className="group relative cursor-pointer rounded-xl bg-neutral-900 border border-neutral-800 hover:border-red-600 overflow-hidden transition-all duration-200"
                >
                  <div className="aspect-[2/3] w-full relative bg-neutral-950">
                    <img
                      src={
                        item.poster_path ||
                        "https://images.unsplash.com/photo-1518676599602-2170de9d6600?w=500&auto=format&fit=crop"
                      }
                      alt={item.title || "Media"}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                      HINDI DUB
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                      <span>{(item.release_date || item.first_air_date || "").slice(0, 4)}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() && !loading ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Film className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-base font-semibold text-neutral-300">No Hindi audio titles matched "{query}"</p>
              <p className="text-xs text-neutral-500">Try searching for popular movies like Batman, Interstellar, Squid Game, or Naruto.</p>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Type at least 2 characters to search movies, TV series, anime, and Korean dramas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
