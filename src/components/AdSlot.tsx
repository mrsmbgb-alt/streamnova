"use client";

import { useState } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";

interface AdSlotProps {
  type: "header" | "middle" | "footer";
  className?: string;
}

export default function AdSlot({ type, className = "" }: AdSlotProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-red-900/40 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-3 shadow-lg my-4 text-center transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-1 border-b border-neutral-800 text-xs text-neutral-400">
        <span className="flex items-center gap-1 font-semibold tracking-wide text-red-400">
          <Sparkles className="w-3 h-3 text-red-500" /> Sponsored Advertisement
        </span>
        <button
          onClick={() => setClosed(true)}
          className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          title="Hide Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2 flex flex-col md:flex-row items-center justify-between gap-3 px-2 py-1">
        <div className="text-left">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            🎬 StreamNova Premium Pass <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">FREE</span>
          </h4>
          <p className="text-xs text-neutral-400">
            Enjoy 100% Free Unlimited Movies, Anime & K-Dramas with High-Speed Dual Audio Streams.
          </p>
        </div>

        <a
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-md shadow-red-900/30"
        >
          <span>Explore Partner Offer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Embedded Script Anchor for Adsterra/PropellerAds/PopCash */}
      <div id={`ad-${type}`} className="ad-container hidden" />
    </div>
  );
}
