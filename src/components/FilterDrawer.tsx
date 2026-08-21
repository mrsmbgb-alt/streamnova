"use client";

import { X, Filter, Check, RotateCcw } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const CATEGORIES = [
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Series" },
  { id: "kdrama", label: "Korean Dramas" },
  { id: "anime", label: "Anime" },
];

const GENRES = [
  { id: "", label: "All Genres" },
  { id: "28", label: "Action" },
  { id: "12", label: "Adventure" },
  { id: "16", label: "Animation" },
  { id: "35", label: "Comedy" },
  { id: "80", label: "Crime" },
  { id: "18", label: "Drama" },
  { id: "14", label: "Fantasy" },
  { id: "27", label: "Horror" },
  { id: "9648", label: "Mystery" },
  { id: "10749", label: "Romance" },
  { id: "878", label: "Sci-Fi" },
  { id: "53", label: "Thriller" },
];

const YEARS = ["", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2015", "2010"];

const RATINGS = [
  { id: "", label: "Any Rating" },
  { id: "8", label: "8.0+ Exceptional" },
  { id: "7", label: "7.0+ High Rated" },
  { id: "6", label: "6.0+ Good" },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedRating,
  setSelectedRating,
  onApplyFilters,
  onResetFilters,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Filter className="w-5 h-5 text-red-500" />
            <span>Filter Content</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-neutral-400">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat.id
                    ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-900/50"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-neutral-400">Genre</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                  selectedGenre === g.id
                    ? "bg-red-950 border-red-600 text-red-300 font-bold"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-neutral-400">Release Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl p-3 text-xs outline-none focus:border-red-600"
          >
            <option value="">All Release Years</option>
            {YEARS.filter((y) => y !== "").map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-neutral-400">Minimum Rating</label>
          <div className="grid grid-cols-1 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRating(r.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition ${
                  selectedRating === r.id
                    ? "bg-amber-950/80 border-amber-500 text-amber-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-neutral-800 flex items-center gap-3">
          <button
            onClick={() => {
              onResetFilters();
            }}
            className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
