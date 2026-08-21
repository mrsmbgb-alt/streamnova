"use client";

import { useState, useEffect } from "react";
import { X, Play, Volume2, Share2, ChevronLeft, ChevronRight, Server, Check, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import { saveLocalHistory } from "@/lib/client-storage";
import { triggerPopUnderAd } from "@/lib/ad-service";

interface VideoPlayerProps {
  media: TMDBMedia | null;
  season?: number;
  episode?: number;
  onClose: () => void;
  onSelectNextEpisode?: () => void;
  onSelectPrevEpisode?: () => void;
  totalEpisodesInSeason?: number;
}

export default function VideoPlayer({
  media,
  season = 1,
  episode = 1,
  onClose,
  onSelectNextEpisode,
  onSelectPrevEpisode,
  totalEpisodesInSeason = 24,
}: VideoPlayerProps) {
  const [streamSources, setStreamSources] = useState<any[]>([]);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audioTrack, setAudioTrack] = useState("Hindi");
  const [copiedLink, setCopiedLink] = useState(false);

  if (!media) return null;

  const isMovie = media.media_type === "movie";

  useEffect(() => {
    fetchStreams();
    // Record to history
    saveLocalHistory({
      contentId: media.id,
      mediaType: media.media_type || "movie",
      title: media.title || "Untitled",
      posterPath: media.poster_path,
      season,
      episode,
    });
  }, [media.id, season, episode]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stream?id=${media.id}&imdb_id=${media.imdb_id || ""}&type=${media.media_type || "movie"}&season=${season}&episode=${episode}`
      );
      if (res.ok) {
        const data = await res.json();
        setStreamSources(data.sources || []);
        setActiveServerIndex(0);
      }
    } catch (err) {
      console.error("Stream error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentStream = streamSources[activeServerIndex] || {
    url: isMovie
      ? `https://vidsrc.cc/v2/embed/movie/${media.id}?autoPlay=true&audio=hi`
      : `https://vidsrc.cc/v2/embed/tv/${media.id}/${season}/${episode}?autoPlay=true&audio=hi`,
    serverName: "Server 1 - 8Stream Hindi VIP",
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-neutral-950/90 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              {media.title}
              {!isMovie && (
                <span className="text-xs font-semibold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  S{season} E{episode}
                </span>
              )}
            </h3>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Hindi Audio Default
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Frame */}
      <div className="relative w-full max-w-6xl mx-auto my-auto p-2 sm:p-4 aspect-video bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-neutral-950 text-white">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-sm font-semibold text-neutral-300">Connecting to 8StreamApi Hindi Server...</p>
          </div>
        ) : (
          <iframe
            src={currentStream.url}
            title={`Streaming ${media.title}`}
            className="w-full h-full border-0 rounded-xl"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        )}
      </div>

      {/* Bottom Streaming Controls & Server Switcher */}
      <div className="px-4 sm:px-8 py-4 bg-neutral-950 border-t border-neutral-900 space-y-3 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Audio Track Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-red-500" /> Audio Track:
            </span>
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              {["Hindi (Primary)", "Hindi Dual Audio", "Original"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setAudioTrack(lang);
                    triggerPopUnderAd();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    audioTrack === lang
                      ? "bg-red-600 text-white shadow-md shadow-red-900/50"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Controls for TV / Anime / K-Drama */}
          {!isMovie && (
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectPrevEpisode}
                disabled={episode <= 1}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 text-xs font-bold flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Episode</span>
              </button>

              <span className="text-xs font-bold text-neutral-300 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                Ep {episode}
              </span>

              <button
                onClick={onSelectNextEpisode}
                disabled={episode >= totalEpisodesInSeason}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 text-xs font-bold flex items-center gap-1 transition"
              >
                <span>Next Episode</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Server Selector Buttons */}
        <div className="pt-2 border-t border-neutral-900">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-neutral-300">Select Stream Server (If stream buffers, switch server):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {streamSources.map((srv, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveServerIndex(idx);
                  triggerPopUnderAd();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                  activeServerIndex === idx
                    ? "bg-gradient-to-r from-red-600 to-amber-600 border-red-500 text-white shadow-lg shadow-red-950"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                {activeServerIndex === idx && <Check className="w-3.5 h-3.5" />}
                <span>{srv.serverName}</span>
                <span className="text-[10px] bg-black/40 px-1 py-0.5 rounded text-amber-300">
                  {srv.quality || "HD"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
