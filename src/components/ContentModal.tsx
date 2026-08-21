"use client";

import { useState, useEffect } from "react";
import { X, Play, Plus, Check, Star, Users, Film, Sparkles, Volume2, Calendar, Clapperboard } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import MediaCard from "./MediaCard";
import ReviewsSection from "./ReviewsSection";
import { triggerPopUnderAd } from "@/lib/ad-service";

interface ContentModalProps {
  media: TMDBMedia | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (media: TMDBMedia, season?: number, episode?: number) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (media: TMDBMedia) => void;
  onSelectMedia: (media: TMDBMedia) => void;
}

export default function ContentModal({
  media,
  isOpen,
  onClose,
  onPlay,
  isInWatchlist,
  onToggleWatchlist,
  onSelectMedia,
}: ContentModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodesList, setEpisodesList] = useState<any[]>([]);

  useEffect(() => {
    if (media && isOpen) {
      fetchDetails();
    } else {
      setDetails(null);
      setSelectedSeason(1);
      setSelectedEpisode(1);
    }
  }, [media?.id, isOpen]);

  useEffect(() => {
    if (media && media.media_type !== "movie" && selectedSeason) {
      fetchSeasonEpisodes(selectedSeason);
    }
  }, [selectedSeason, media?.id]);

  const fetchDetails = async () => {
    if (!media) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/details/${media.media_type || "movie"}/${media.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
      }
    } catch (e) {
      console.error("Details fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonEpisodes = async (seasonNum: number) => {
    if (!media) return;
    try {
      const res = await fetch(`/api/tmdb/details/${media.media_type || "tv"}/${media.id}?season=${seasonNum}`);
      if (res.ok) {
        const data = await res.json();
        setEpisodesList(data.season?.episodes || []);
      }
    } catch (e) {
      console.error("Season fetch error:", e);
    }
  };

  if (!isOpen || !media) return null;

  const isMovie = media.media_type === "movie";
  const releaseYear = (media.release_date || media.first_air_date || "2024").slice(0, 4);

  const handlePlayNow = (s = selectedSeason, e = selectedEpisode) => {
    triggerPopUnderAd();
    onPlay(media, s, e);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black border border-neutral-700 text-neutral-300 hover:text-white transition shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="relative w-full h-[280px] sm:h-[380px] bg-neutral-900 overflow-hidden">
          <img
            src={
              media.backdrop_path ||
              media.poster_path ||
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop"
            }
            alt={media.title || "Media"}
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                  HINDI DUBBED
                </span>
                <span className="bg-neutral-900/90 border border-neutral-700 text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {media.vote_average.toFixed(1)}
                </span>
                <span className="bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded-md">
                  {releaseYear}
                </span>
                <span className="bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded-md uppercase">
                  {media.media_type}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
                {media.title}
              </h2>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handlePlayNow()}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-900/50 transition transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(media)}
                className={`p-3 rounded-xl border transition ${
                  isInWatchlist
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                    : "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                }`}
                title={isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              >
                {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Synopsis</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{media.overview}</p>
          </div>

          {/* TV / Anime / K-Drama Episode Selector */}
          {!isMovie && (
            <div className="space-y-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-red-500" />
                  <span>Select Season & Episode</span>
                </h3>

                {/* Season Dropdown */}
                {details?.seasons && details.seasons.length > 0 && (
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
                  >
                    {details.seasons.map((s: any) => (
                      <option key={s.id} value={s.season_number}>
                        {s.name} ({s.episode_count} Episodes)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Episodes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                {episodesList.length > 0
                  ? episodesList.map((ep: any) => (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEpisode(ep.episode_number);
                          handlePlayNow(selectedSeason, ep.episode_number);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                          selectedEpisode === ep.episode_number
                            ? "bg-red-600 border-red-500 text-white font-bold"
                            : "bg-neutral-950 border-neutral-800/80 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <span className="text-[10px] uppercase opacity-75">Ep {ep.episode_number}</span>
                        <span className="text-xs font-semibold line-clamp-1">{ep.name || `Episode ${ep.episode_number}`}</span>
                      </button>
                    ))
                  : Array.from({ length: 12 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedEpisode(idx + 1);
                          handlePlayNow(selectedSeason, idx + 1);
                        }}
                        className="p-2.5 rounded-xl text-left bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-red-600 transition"
                      >
                        <span className="text-[10px] text-neutral-500 uppercase">Episode {idx + 1}</span>
                        <span className="text-xs font-semibold block">Play Ep {idx + 1}</span>
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {details?.cast && details.cast.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-500" /> Featured Cast
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {details.cast.map((actor: any) => (
                  <div key={actor.id} className="flex-none w-24 text-center space-y-1">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
                      {actor.profile_path ? (
                        <img src={actor.profile_path} alt={actor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-bold">
                          {actor.name.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-white line-clamp-1">{actor.name}</p>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Reviews Section */}
          <ReviewsSection contentId={media.id} mediaType={media.media_type || "movie"} />

          {/* Recommendations Row */}
          {details?.recommendations && details.recommendations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Recommended For You
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {details.recommendations.slice(0, 8).map((rec: TMDBMedia) => (
                  <MediaCard
                    key={rec.id}
                    media={rec}
                    onSelect={(m) => {
                      onSelectMedia(m);
                    }}
                    onPlay={(m) => {
                      onPlay(m);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
