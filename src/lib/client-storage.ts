// Local storage manager for client fallback & fast UI updates

const SESSION_KEY = "streamnova_session_id";
const WATCHLIST_KEY = "streamnova_watchlist";
const HISTORY_KEY = "streamnova_history";

export function getSessionId(): string {
  if (typeof window === "undefined") return "guest_default";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getLocalWatchlist(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalWatchlist(item: any): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getLocalWatchlist();
    const exists = list.some((i) => String(i.id || i.contentId) === String(item.id || item.contentId));
    let updated;
    if (exists) {
      updated = list.filter((i) => String(i.id || i.contentId) !== String(item.id || item.contentId));
    } else {
      updated = [
        {
          id: item.id || item.contentId,
          contentId: String(item.id || item.contentId),
          title: item.title || item.name,
          posterPath: item.poster_path || item.posterPath,
          mediaType: item.media_type || item.mediaType || "movie",
          voteAverage: item.vote_average || item.voteAverage,
          releaseYear: (item.release_date || item.first_air_date || "").slice(0, 4),
          hasHindiAudio: true,
          addedAt: new Date().toISOString(),
        },
        ...list,
      ];
    }
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return !exists; // returns true if added, false if removed
  } catch {
    return false;
  }
}

export function isLocalWatchlist(contentId: string | number): boolean {
  const list = getLocalWatchlist();
  return list.some((i) => String(i.id || i.contentId) === String(contentId));
}

export function getLocalHistory(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalHistory(item: {
  contentId: string | number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  season?: number;
  episode?: number;
  progressSeconds?: number;
  durationSeconds?: number;
}) {
  if (typeof window === "undefined") return;
  try {
    const history = getLocalHistory();
    const filtered = history.filter((h) => String(h.contentId) !== String(item.contentId));
    const newItem = {
      ...item,
      contentId: String(item.contentId),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...filtered].slice(0, 20)));
  } catch (err) {
    console.warn("Failed saving history to localStorage:", err);
  }
}
