"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Play, Trash2, Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import { getPosterUrl } from "@/lib/tmdb";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useAppStore();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark size={28} className="text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-black text-white">{t("watchlist")}</h1>
        {watchlist.length > 0 && (
          <span className="bg-red-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
            {watchlist.length}
          </span>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
            <Bookmark size={40} className="text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-semibold mb-2">Your watchlist is empty</p>
            <p className="text-gray-400">Add movies and shows you want to watch later</p>
          </div>
          <Link
            href="/"
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item) => {
            const href =
              item.mediaType === "movie"
                ? `/movie/${item.tmdbId}`
                : item.mediaType === "anime"
                ? `/anime/${item.tmdbId}`
                : item.mediaType === "korean"
                ? `/korean/${item.tmdbId}`
                : `/tv/${item.tmdbId}`;

            return (
              <div key={item.id} className="group relative">
                <Link href={href}>
                  <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-800">
                    {item.posterPath ? (
                      <Image
                        src={getPosterUrl(item.posterPath, "md")}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 150px, 200px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={28} className="text-gray-600" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5">
                        <Play size={14} className="text-black fill-black" />
                        <span className="text-black text-xs font-bold">{t("watchNow")}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[10px] font-semibold">
                        {typeof item.rating === "number" ? item.rating.toFixed(1) : item.rating}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Title & Remove */}
                <div className="mt-2 flex items-start justify-between gap-1">
                  <p className="text-white text-xs font-medium line-clamp-2 flex-1">{item.title}</p>
                  <button
                    onClick={() => removeFromWatchlist(item.tmdbId)}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-red-400 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-gray-500 text-[10px] mt-0.5 capitalize">{item.mediaType}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
