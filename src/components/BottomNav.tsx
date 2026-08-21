"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Star, Bookmark, Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

export default function BottomNav() {
  const pathname = usePathname();
  const { watchlist } = useAppStore();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/movies", icon: Film, label: t("movies") },
    { href: "/search", icon: Search, label: t("search").split(" ")[0] },
    { href: "/anime", icon: Star, label: t("anime") },
    { href: "/watchlist", icon: Bookmark, label: t("watchlist").split(" ")[1] || "List" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 relative ${
                active ? "text-red-500" : "text-gray-400 hover:text-white"
              }`}
            >
              <div className={`relative ${active ? "scale-110" : ""} transition-transform`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                {item.href === "/watchlist" && watchlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                    {watchlist.length > 9 ? "9+" : watchlist.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-red-500" : ""}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
