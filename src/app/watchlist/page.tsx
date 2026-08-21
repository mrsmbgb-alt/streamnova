"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MediaCard from "@/components/MediaCard";
import ContentModal from "@/components/ContentModal";
import VideoPlayer from "@/components/VideoPlayer";
import SearchModal from "@/components/SearchModal";
import AdSlot from "@/components/AdSlot";
import { TMDBMedia } from "@/lib/tmdb";
import { getLocalWatchlist, getLocalHistory, isLocalWatchlist, saveLocalWatchlist } from "@/lib/client-storage";
import { Heart, Clock, Film, Trash2, Play } from "lucide-react";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");

  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [playingMedia, setPlayMedia] = useState<{ media: TMDBMedia; season?: number; episode?: number } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    setWatchlist(getLocalWatchlist());
    setHistory(getLocalHistory());
  };

  const handleToggleWatchlist = (media: TMDBMedia) => {
    saveLocalWatchlist(media);
    loadLists();
  };

  const convertToTMDB = (item: any): TMDBMedia => {
    return {
      id: Number(item.id || item.contentId),
      title: item.title,
      overview: item.overview || "Saved to watchlist",
      poster_path: item.posterPath || item.poster_path,
      backdrop_path: item.backdropPath || item.backdrop_path,
      release_date: item.releaseYear || "2024",
      vote_average: item.voteAverage || 8.0,
      media_type: item.mediaType || "movie",
      hasHindiAudio: true,
    };
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span>My Watchlist & History</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Resume watched episodes or manage saved Hindi movies & anime.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab("watchlist")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "watchlist"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History ({history.length})</span>
            </button>
          </div>
        </div>

        <AdSlot type="header" />

        {activeTab === "watchlist" ? (
          watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlist.map((item) => {
                const mediaObj = convertToTMDB(item);
                return (
                  <MediaCard
                    key={mediaObj.id}
                    media={mediaObj}
                    onSelect={(m) => {
                      setSelectedMedia(m);
                      setIsDetailOpen(true);
                    }}
                    onPlay={(m) => setPlayMedia({ media: m })}
                    isInWatchlist={true}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-400 space-y-3">
              <Film className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-lg font-bold text-white">Your Watchlist is empty.</p>
              <p className="text-xs text-neutral-500">
                Click "+ Watchlist" on any movie or anime to save it here for later.
              </p>
            </div>
          )
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.map((h) => {
              const mediaObj = convertToTMDB(h);
              return (
                <div
                  key={h.contentId}
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center gap-4 hover:border-red-600 transition"
                >
                  <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-neutral-950 shrink-0">
                    <img
                      src={h.posterPath || "https://images.unsplash.com/photo-1518676599602-2170de9d6600?w=500&auto=format&fit=crop"}
                      alt={h.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{h.title}</h3>
                    <p className="text-xs text-red-400 font-semibold">
                      {h.mediaType !== "movie" ? `Season ${h.season || 1} • Episode ${h.episode || 1}` : "Movie"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Watched: {new Date(h.updatedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setPlayMedia({ media: mediaObj, season: h.season, episode: h.episode })}
                      className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Resume Watching</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400 space-y-3">
            <Clock className="w-12 h-12 mx-auto text-neutral-600" />
            <p className="text-lg font-bold text-white">No watch history yet.</p>
            <p className="text-xs text-neutral-500">Start watching any title and your progress will automatically save here.</p>
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

      <Footer />
      <BottomNav onOpenSearch={() => setIsSearchOpen(true)} />
    </div>
  );
}
