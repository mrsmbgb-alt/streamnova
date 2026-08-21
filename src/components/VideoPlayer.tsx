"use client";

import { useState } from "react";
import { RefreshCw, ExternalLink, Volume2, AlertCircle } from "lucide-react";
import { getEmbedUrl, getAlternateEmbedUrl } from "@/lib/tmdb";
import { useLanguage } from "@/hooks/useLanguage";

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
}

type SourceKey = "primary" | "alternate";

const SOURCES: Record<SourceKey, { label: string; description: string }> = {
  primary: { label: "VidSrc", description: "Primary Source (Hindi Audio)" },
  alternate: { label: "EmbedSu", description: "Alternate Source (Hindi Dub)" },
};

export default function VideoPlayer({ tmdbId, mediaType, title, season, episode }: VideoPlayerProps) {
  const [currentSource, setCurrentSource] = useState<SourceKey>("primary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  const getUrl = (source: SourceKey): string => {
    if (source === "primary") {
      return getEmbedUrl(tmdbId, mediaType, season, episode);
    }
    return getAlternateEmbedUrl(tmdbId, mediaType, season, episode);
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const switchSource = (source: SourceKey) => {
    setCurrentSource(source);
    setLoading(true);
    setError(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    // Force iframe reload by toggling source
    const current = currentSource;
    setCurrentSource("primary");
    setTimeout(() => setCurrentSource(current), 100);
  };

  // Pop-under ad on watch now
  const handlePopunder = () => {
    const adUrl = "https://www.google.com"; // Replace with actual ad network URL
    window.open(adUrl, "_blank", "noopener");
  };

  return (
    <div className="w-full">
      {/* Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-red-400" />
          <span className="text-white font-semibold text-sm">{t("hindiAudio")}</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-400 text-xs">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Source switcher */}
          {(Object.keys(SOURCES) as SourceKey[]).map((src) => (
            <button
              key={src}
              onClick={() => switchSource(src)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentSource === src
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {SOURCES[src].label}
            </button>
          ))}

          <button
            onClick={handleRefresh}
            className="p-1.5 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-all"
            title="Reload player"
          >
            <RefreshCw size={14} />
          </button>

          <a
            href={getUrl(currentSource)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Player */}
      <div className="player-wrapper rounded-xl overflow-hidden shadow-2xl">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
            <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">{t("loading")}</p>
            <p className="text-gray-600 text-xs mt-1">{SOURCES[currentSource].description}</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 p-6">
            <AlertCircle size={40} className="text-red-400 mb-3" />
            <p className="text-white font-semibold mb-2">{t("errorMsg")}</p>
            <p className="text-gray-400 text-sm text-center mb-4">{t("serverBusy")}</p>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              {currentSource === "primary" && (
                <button
                  onClick={() => switchSource("alternate")}
                  className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600"
                >
                  Switch Source
                </button>
              )}
            </div>
          </div>
        )}

        <iframe
          key={`${currentSource}-${tmdbId}-${season}-${episode}`}
          src={getUrl(currentSource)}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="absolute inset-0 w-full h-full border-0"
          title={`${title} - Hindi Audio`}
        />
      </div>

      {/* Source info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Streaming from {SOURCES[currentSource].description}</span>
      </div>
    </div>
  );
}
