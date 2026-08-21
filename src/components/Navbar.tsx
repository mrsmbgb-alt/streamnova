"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Menu, X, Settings, Bookmark, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { watchlist, isMobileMenuOpen, setMobileMenuOpen, setSearchQuery } = useAppStore();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      router.push(`/search?q=${encodeURIComponent(localSearch)}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/movies", label: t("movies") },
    { href: "/tv", label: t("tvSeries") },
    { href: "/korean", label: t("koreanDrama") },
    { href: "/anime", label: t("anime") },
    { href: "/watchlist", label: t("watchlist") },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-2xl" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {/* Ad Banner Top */}
      <div className="ad-slot w-full h-[50px] hidden lg:flex text-xs text-gray-500">
        <span className="opacity-50">Advertisement • 728×90</span>
      </div>

      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-white">Stream</span>
                <span className="text-red-500">Nova</span>
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-red-600/20 border border-red-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder={t("search")}
                    className="bg-black/60 border border-gray-600 text-white text-sm rounded-lg px-4 py-2 w-64 outline-none focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors relative hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Watchlist count */}
            <Link
              href="/watchlist"
              className="p-2 text-gray-300 hover:text-white transition-colors relative hidden sm:flex"
            >
              <Bookmark size={20} />
              {watchlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2 text-gray-300 hover:text-white transition-colors hidden sm:block"
            >
              <Settings size={18} />
            </Link>

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "text-white bg-red-600/20 border border-red-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10"
            >
              {t("settings")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
