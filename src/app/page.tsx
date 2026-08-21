"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import SkeletonRow from "@/components/SkeletonRow";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import AdSlot from "@/components/AdSlot";
import ContentModal from "@/components/ContentModal";
import VideoPlayer from "@/components/VideoPlayer";
import SearchModal from "@/components/SearchModal";
import FilterDrawer from "@/components/FilterDrawer";
import { TMDBMedia } from "@/lib/tmdb";
import { getLocalHistory, isLocalWatchlist, saveLocalWatchlist } from "@/lib/client-storage";

export default function HomePage() {
  const [heroMedia, setHeroMedia] = useState<TMDBMedia | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMedia[]>([]);
  const [animeList, setAnimeList] = useState<TMDBMedia[]>([]);
  const [kdramas, setKdramas] = useState<TMDBMedia[]>([]);
  const [tvSeries, setTvSeries] = useState<TMDBMedia[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<TMDBMedia[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [hindiOnly, setHindiOnly] = useState(true);

  // Modals & States
  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [playingMedia, setPlayMedia] = useState<{ media: TMDBMedia; season?: number; episode?: number } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  // Filter Drawer states
  const [selectedCategory, setSelectedCategory] = useState("movie");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    fetchAllCategories();
    setContinueWatching(getLocalHistory());
  }, []);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      // 1. Trending
      const trendingRes = await fetch("/api/tmdb/trending");
      let trendingItems: TMDBMedia[] = [];
      if (trendingRes.ok) {
        const data = await trendingRes.json();
        trendingItems = data.results || [];
      }

      if (trendingItems.length > 0) {
        setHeroMedia(trendingItems[0]);
        setTrendingMovies(trendingItems.slice(1, 15));
      }

      // 2. Anime
      const animeRes = await fetch("/api/tmdb/category?type=anime");
      if (animeRes.ok) {
        const data = await animeRes.json();
        setAnimeList(data.results || []);
      }

      // 3. Korean Dramas
      const kdramaRes = await fetch("/api/tmdb/category?type=kdrama");
      if (kdramaRes.ok) {
        const data = await kdramaRes.json();
        setKdramas(data.results || []);
      }

      // 4. TV Series
      const seriesRes = await fetch("/api/tmdb/category?type=tv");
      if (seriesRes.ok) {
        const data = await seriesRes.json();
        setTvSeries(data.results || []);
      }

      // 5. Recently Added Hindi
      const moviesRes = await fetch("/api/tmdb/category?type=movie&page=2");
      if (moviesRes.ok) {
        const data = await moviesRes.json();
        setRecentlyAdded(data.results || []);
      }
    } catch (err) {
      console.error("Home fetch error:", err);
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

  const handleSelectMedia = (media: TMDBMedia) => {
    setSelectedMedia(media);
    setIsDetailOpen(true);
  };

  const handlePlayMedia = (media: TMDBMedia, season = 1, episode = 1) => {
    setPlayMedia({ media, season, episode });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        hindiOnly={hindiOnly}
        setHindiOnly={setHindiOnly}
      />

      {/* Featured Hero Banner */}
      <Hero
        media={heroMedia}
        onSelect={handleSelectMedia}
        onPlay={(m) => handlePlayMedia(m)}
        isInWatchlist={heroMedia ? isLocalWatchlist(heroMedia.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <main className="flex-1 space-y-6 -mt-10 sm:-mt-16 z-20 relative">
        {/* Top Header Ad Placement */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot type="header" />
        </div>

        {/* Continue Watching Section */}
        {continueWatching.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-red-500 rounded-full" />
              Continue Watching
            </h2>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {continueWatching.map((item) => (
                <div
                  key={item.contentId}
                  onClick={() =>
                    handlePlayMedia(
                      {
                        id: Number(item.contentId),
                        title: item.title,
                        overview: "Resume streaming",
                        poster_path: item.posterPath,
                        backdrop_path: item.posterPath,
                        release_date: "2024",
                        vote_average: 8.0,
                        media_type: item.mediaType,
                        hasHindiAudio: true,
                      },
                      item.season || 1,
                      item.episode || 1
                    )
                  }
                  className="flex-none w-48 p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-600 cursor-pointer transition flex items-center gap-3"
                >
                  <img
                    src={item.posterPath || "https://images.unsplash.com/photo-1518676599602-2170de9d6600?w=500&auto=format&fit=crop"}
                    alt={item.title}
                    className="w-10 aspect-[2/3] object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                    <p className="text-[10px] text-red-400 font-semibold">
                      {item.mediaType !== "movie" ? `S${item.season || 1} E${item.episode || 1}` : "Movie"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Sliders */}
        {loading ? (
          <div className="space-y-6">
            <SkeletonRow count={6} />
            <SkeletonRow count={6} />
            <SkeletonRow count={6} />
          </div>
        ) : (
          <>
            {/* Trending Movies */}
            <MediaRow
              title="🔥 Trending Movies (Hindi Audio)"
              subtitle="Most popular Hollywood & Bollywood blockbusters"
              items={trendingMovies}
              onSelect={handleSelectMedia}
              onPlay={(m) => handlePlayMedia(m)}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* Top Rated Anime */}
            <MediaRow
              title="⚡ Top Rated Anime (Hindi Audio)"
              subtitle="Popular anime series dubbed in Hindi"
              items={animeList}
              onSelect={handleSelectMedia}
              onPlay={(m) => handlePlayMedia(m, 1, 1)}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* In-Feed Native Ad */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSlot type="middle" />
            </div>

            {/* New Korean Dramas */}
            <MediaRow
              title="🌸 New Korean Dramas (Hindi)"
              subtitle="Romantic, thriller & mystery K-Dramas dubbed in Hindi"
              items={kdramas}
              onSelect={handleSelectMedia}
              onPlay={(m) => handlePlayMedia(m, 1, 1)}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* Popular TV Series */}
            <MediaRow
              title="📺 Popular TV Series (Hindi)"
              subtitle="Top global TV series & web series"
              items={tvSeries}
              onSelect={handleSelectMedia}
              onPlay={(m) => handlePlayMedia(m, 1, 1)}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* Recently Added Hindi */}
            <MediaRow
              title="✨ Recently Added (Hindi Audio)"
              subtitle="Fresh releases with dual audio Hindi tracks"
              items={recentlyAdded}
              onSelect={handleSelectMedia}
              onPlay={(m) => handlePlayMedia(m)}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />
          </>
        )}
      </main>

      {/* Content Detail Modal */}
      <ContentModal
        media={selectedMedia}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onPlay={(m, s, e) => {
          setIsDetailOpen(false);
          handlePlayMedia(m, s, e);
        }}
        isInWatchlist={selectedMedia ? isLocalWatchlist(selectedMedia.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectMedia={handleSelectMedia}
      />

      {/* Video Player Modal */}
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

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMedia={(m) => handleSelectMedia(m)}
        onPlayMedia={(m) => handlePlayMedia(m)}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        onApplyFilters={() => {
          if (selectedCategory === "movie") window.location.href = "/movies";
          else if (selectedCategory === "tv") window.location.href = "/series";
          else if (selectedCategory === "kdrama") window.location.href = "/kdrama";
          else if (selectedCategory === "anime") window.location.href = "/anime";
        }}
        onResetFilters={() => {
          setSelectedGenre("");
          setSelectedYear("");
          setSelectedRating("");
        }}
      />

      {/* Footer & Mobile Navigation */}
      <Footer />
      <BottomNav onOpenSearch={() => setIsSearchOpen(true)} />
    </div>
  );
}
