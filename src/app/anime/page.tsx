"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MediaCard from "@/components/MediaCard";
import SkeletonRow from "@/components/SkeletonRow";
import ContentModal from "@/components/ContentModal";
import VideoPlayer from "@/components/VideoPlayer";
import SearchModal from "@/components/SearchModal";
import FilterDrawer from "@/components/FilterDrawer";
import AdSlot from "@/components/AdSlot";
import { TMDBMedia } from "@/lib/tmdb";
import { isLocalWatchlist, saveLocalWatchlist } from "@/lib/client-storage";
import { Sparkles, Filter } from "lucide-react";

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [hindiOnly, setHindiOnly] = useState(true);

  // Modals
  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [playingMedia, setPlayMedia] = useState<{ media: TMDBMedia; season?: number; episode?: number } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAnime(1);
  }, [selectedGenre, selectedYear, selectedRating, hindiOnly]);

  const fetchAnime = async (pageNum: number) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        type: "anime",
        page: String(pageNum),
        ...(selectedGenre && { genre: selectedGenre }),
        ...(selectedYear && { year: selectedYear }),
        ...(selectedRating && { rating: selectedRating }),
      });

      const res = await fetch(`/api/tmdb/category?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnimeList(data.results || []);
        setPage(data.page || 1);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Error loading anime:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatchlist = (media: TMDBMedia) => {
    saveLocalWatchlist(media);
    const updated = isLocalWatchlist(media.id);
    setWatchlistIds((prev) =>
      updated ? [...prev, String(media.id)] : prev.filter((id) => id !== String(media.id))
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        hindiOnly={hindiOnly}
        setHindiOnly={setHindiOnly}
      />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <span>Anime in Hindi</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Stream top anime hits (Naruto, Jujutsu Kaisen, Demon Slayer, Solo Leveling) dubbed in Hindi.
            </p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="self-start md:self-auto px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-600 rounded-xl text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-2 transition"
          >
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filter Anime</span>
          </button>
        </div>

        <AdSlot type="header" />

        {loading ? (
          <SkeletonRow count={12} />
        ) : animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime) => (
              <MediaCard
                key={anime.id}
                media={anime}
                onSelect={(m) => {
                  setSelectedMedia(m);
                  setIsDetailOpen(true);
                }}
                onPlay={(m) => {
                  setPlayMedia({ media: m, season: 1, episode: 1 });
                }}
                isInWatchlist={watchlistIds.includes(String(anime.id)) || isLocalWatchlist(anime.id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400 space-y-3">
            <p className="text-lg font-bold text-white">No anime found matching selected filters.</p>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <button
              onClick={() => fetchAnime(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:text-white disabled:opacity-40 transition"
            >
              Previous Page
            </button>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchAnime(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:text-white disabled:opacity-40 transition"
            >
              Next Page
            </button>
          </div>
        )}
      </main>

      <ContentModal
        media={selectedMedia}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onPlay={(m, s, e) => {
          setIsDetailOpen(false);
          setPlayMedia({ media: m, season: s, episode: e });
        }}
        isInWatchlist={selectedMedia ? isLocalWatchlist(selectedMedia.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectMedia={(m) => setSelectedMedia(m)}
      />

      {playingMedia && (
        <VideoPlayer
          media={playingMedia.media}
          season={playingMedia.season}
          episode={playingMedia.episode}
          onClose={() => setPlayMedia(null)}
          onSelectNextEpisode={() =>
            setPlayMedia((prev) =>
              prev ? { ...prev, episode: (prev.episode || 1) + 1 } : null
            )
          }
          onSelectPrevEpisode={() =>
            setPlayMedia((prev) =>
              prev ? { ...prev, episode: Math.max(1, (prev.episode || 1) - 1) } : null
            )
          }
        />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMedia={(m) => {
          setSelectedMedia(m);
          setIsDetailOpen(true);
        }}
        onPlayMedia={(m) => setPlayMedia({ media: m })}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory="anime"
        setSelectedCategory={() => {}}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        onApplyFilters={() => fetchAnime(1)}
        onResetFilters={() => {
          setSelectedGenre("");
          setSelectedYear("");
          setSelectedRating("");
          fetchAnime(1);
        }}
      />

      <Footer />
      <BottomNav onOpenSearch={() => setIsSearchOpen(true)} />
    </div>
  );
}
