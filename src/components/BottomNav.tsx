"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, Film, Tv, Sparkles, Heart, Search } from "lucide-react";

interface BottomNavProps {
  onOpenSearch?: () => void;
}

export default function BottomNav({ onOpenSearch }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: PlayCircle },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "K-Drama", href: "/kdrama", icon: Sparkles },
    { label: "Anime", href: "/anime", icon: Sparkles },
    { label: "Watchlist", href: "/watchlist", icon: Heart },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? "text-red-500 scale-105 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold text-neutral-400 hover:text-white transition"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
            <span>Search</span>
          </button>
        )}
      </div>
    </div>
  );
}
