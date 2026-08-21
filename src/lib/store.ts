import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TMDBMovie } from "./tmdb";

interface WatchlistItem {
  id: number;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  rating: number;
}

interface ContinueItem {
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  progressSeconds: number;
  totalSeconds: number;
  season?: number;
  episode?: number;
  updatedAt: number;
}

interface UILanguage {
  code: "en" | "hi";
  label: string;
}

interface AppState {
  watchlist: WatchlistItem[];
  continueWatching: ContinueItem[];
  uiLanguage: UILanguage;
  activeCategory: string;
  searchQuery: string;
  isMobileMenuOpen: boolean;

  addToWatchlist: (movie: TMDBMovie, mediaType: string) => void;
  removeFromWatchlist: (tmdbId: number) => void;
  isInWatchlist: (tmdbId: number) => boolean;

  updateContinue: (item: Omit<ContinueItem, "updatedAt">) => void;
  removeContinue: (tmdbId: number) => void;

  setUILanguage: (lang: UILanguage) => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      continueWatching: [],
      uiLanguage: { code: "en", label: "English" },
      activeCategory: "home",
      searchQuery: "",
      isMobileMenuOpen: false,

      addToWatchlist: (movie, mediaType) => {
        const existing = get().watchlist.find((w) => w.tmdbId === movie.id);
        if (!existing) {
          set((state) => ({
            watchlist: [
              ...state.watchlist,
              {
                id: Date.now(),
                tmdbId: movie.id,
                mediaType,
                title: movie.title || movie.name || "",
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                overview: movie.overview,
                rating: movie.vote_average,
              },
            ],
          }));
        }
      },

      removeFromWatchlist: (tmdbId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.tmdbId !== tmdbId),
        }));
      },

      isInWatchlist: (tmdbId) => {
        return get().watchlist.some((w) => w.tmdbId === tmdbId);
      },

      updateContinue: (item) => {
        set((state) => {
          const existing = state.continueWatching.findIndex((c) => c.tmdbId === item.tmdbId);
          const newItem = { ...item, updatedAt: Date.now() };
          if (existing >= 0) {
            const updated = [...state.continueWatching];
            updated[existing] = newItem;
            return { continueWatching: updated };
          }
          return { continueWatching: [newItem, ...state.continueWatching].slice(0, 20) };
        });
      },

      removeContinue: (tmdbId) => {
        set((state) => ({
          continueWatching: state.continueWatching.filter((c) => c.tmdbId !== tmdbId),
        }));
      },

      setUILanguage: (lang) => set({ uiLanguage: lang }),
      setActiveCategory: (cat) => set({ activeCategory: cat }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: "streamnova-store",
      partialize: (state) => ({
        watchlist: state.watchlist,
        continueWatching: state.continueWatching,
        uiLanguage: state.uiLanguage,
      }),
    }
  )
);
