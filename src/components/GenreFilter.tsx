"use client";

import { useLanguage } from "@/hooks/useLanguage";

const MOVIE_GENRES = [
  { id: 0, key: "allGenres" },
  { id: 28, key: "action" },
  { id: 35, key: "comedy" },
  { id: 10749, key: "romance" },
  { id: 53, key: "thriller" },
  { id: 18, key: "drama" },
  { id: 27, key: "horror" },
  { id: 878, key: "scifi" },
  { id: 16, key: "animation" },
];

interface GenreFilterProps {
  selected: number;
  onChange: (id: number) => void;
}

export default function GenreFilter({ selected, onChange }: GenreFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-gray-400 text-sm mr-1">{t("filterBy")}:</span>
      {MOVIE_GENRES.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onChange(genre.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            selected === genre.id
              ? "bg-red-600 border-red-500 text-white"
              : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
          }`}
        >
          {t(genre.key)}
        </button>
      ))}
    </div>
  );
}
