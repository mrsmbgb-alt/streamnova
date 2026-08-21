import Link from "next/link";
import { PlayCircle, ShieldAlert, Heart, Globe } from "lucide-react";
import AdSlot from "./AdSlot";

export default function Footer() {
  return (
    <footer className="mt-16 bg-neutral-950 border-t border-neutral-900 pt-10 pb-20 lg:pb-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="footer" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-neutral-900">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-black text-white">
                Stream<span className="text-red-500">Nova</span>
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              StreamNova is a free, cloud-native streaming directory for Movies, TV Series, Korean Dramas, and Anime—all prioritized with Hindi Audio tracks.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/40 w-fit">
              <span>🇮🇳 Dual Audio Hindi Default</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="hover:text-red-400 transition">
                  Bollywood & Hollywood Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-red-400 transition">
                  Trending TV Series (Hindi)
                </Link>
              </li>
              <li>
                <Link href="/kdrama" className="hover:text-red-400 transition">
                  Korean Dramas Dubbed
                </Link>
              </li>
              <li>
                <Link href="/anime" className="hover:text-red-400 transition">
                  Anime in Hindi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/watchlist" className="hover:text-red-400 transition">
                  My Watchlist
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">8StreamApi Server Active</span>
              </li>
              <li>
                <span className="text-neutral-500">Cloudflare & Vercel High Speed</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Legal Disclaimer
            </h4>
            <p className="text-[10px] text-neutral-500 leading-normal">
              StreamNova does not host or store media files on its servers. All streams are sourced from third-party public API endpoints (TMDB, 8StreamApi, Moviebox, LK21).
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} StreamNova. Built for movie & anime lovers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-neutral-400" /> Cloud Native 100% Free
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
