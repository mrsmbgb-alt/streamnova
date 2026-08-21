"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Film, Tv, PlayCircle, Sparkles, Heart, Filter, CheckCircle2 } from "lucide-react";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenFilter?: () => void;
  hindiOnly?: boolean;
  setHindiOnly?: (val: boolean) => void;
}

export default function Navbar({ onOpenSearch, onOpenFilter, hindiOnly = true, setHindiOnly }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: PlayCircle },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "TV Series", href: "/series", icon: Tv },
    { label: "Korean Drama", href: "/kdrama", icon: Sparkles },
    { label: "Anime", href: "/anime", icon: Sparkles },
    { label: "Watchlist", href: "/watchlist", icon: Heart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/90 backdrop-blur-md shadow-2xl border-b border-neutral-800/80 py-3"
          : "bg-gradient-to-b from-black/95 via-black/70 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
            <PlayCircle className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-red-500 transition-colors flex items-center gap-1">
              Stream<span className="text-red-500">Nova</span>
            </span>
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest -mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" /> Hindi Audio Default
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/60 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/40"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Hindi Audio Priority Toggle Switch */}
          {setHindiOnly && (
            <button
              onClick={() => setHindiOnly(!hindiOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                hindiOnly
                  ? "bg-red-950/80 border-red-600/60 text-red-300 shadow-sm shadow-red-950"
                  : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
              }`}
              title="Toggle Hindi Audio Filter Priority"
            >
              <span className={`w-2 h-2 rounded-full ${hindiOnly ? "bg-red-500 animate-pulse" : "bg-neutral-500"}`} />
              <span className="hidden sm:inline">Hindi Audio</span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-1 rounded">HI</span>
            </button>
          )}

          {/* Filter Drawer Toggle */}
          {onOpenFilter && (
            <button
              onClick={onOpenFilter}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
              title="Filter Genres & Rating"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-red-600/50 text-neutral-300 hover:text-white transition shadow-inner group"
          >
            <Search className="w-4 h-4 text-neutral-400 group-hover:text-red-400 transition" />
            <span className="text-xs font-medium hidden sm:inline">Search movie, anime, cast...</span>
          </button>
        </div>
      </div>
    </header>
  );
}
