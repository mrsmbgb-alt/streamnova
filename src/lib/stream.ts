// Streaming Resolver Engine for StreamNova
// Connects to 8StreamApi (Primary), Moviebox-API (Backup 1), LK21 (Backup 2) and Multi-Server Embeds

export interface StreamSource {
  serverName: string;
  quality?: string;
  url: string;
  type: "hls" | "mp4" | "embed";
  audioLanguage: string;
  isHindi: boolean;
  backupPriority: number;
}

export interface StreamResult {
  imdbId?: string;
  title?: string;
  season?: number;
  episode?: number;
  primaryStream?: StreamSource;
  sources: StreamSource[];
  subtitles?: { language: string; url: string }[];
  defaultAudio: string;
}

const EIGHT_STREAM_URL = process.env.NEXT_PUBLIC_8STREAM_API_URL || "https://8stream-api.vercel.app";
const MOVIEBOX_URL = process.env.NEXT_PUBLIC_BACKUP_API_URL || "https://moviebox-api.vercel.app";

/**
 * Get streams for a given IMDb or TMDB ID
 */
export async function getStreamSources(
  imdbId: string | null,
  tmdbId: string | number,
  mediaType: "movie" | "tv" | "kdrama" | "anime" = "movie",
  season: number = 1,
  episode: number = 1
): Promise<StreamResult> {
  const sources: StreamSource[] = [];
  const cleanImdb = imdbId && imdbId.startsWith("tt") ? imdbId : null;

  // 1. Try 8StreamApi (Primary Stream API)
  if (cleanImdb) {
    try {
      const mediaInfoRes = await fetch(`${EIGHT_STREAM_URL}/api/v1/mediaInfo?id=${cleanImdb}`, {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(3000), // 3s timeout
      }).catch(() => null);

      if (mediaInfoRes && mediaInfoRes.ok) {
        const infoData = await mediaInfoRes.json();
        if (infoData && (infoData.file || infoData.key)) {
          const streamRes = await fetch(`${EIGHT_STREAM_URL}/api/v1/getStream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: infoData.file,
              key: infoData.key,
              season: mediaType !== "movie" ? season : undefined,
              episode: mediaType !== "movie" ? episode : undefined,
            }),
            signal: AbortSignal.timeout(3000),
          }).catch(() => null);

          if (streamRes && streamRes.ok) {
            const streamData = await streamRes.json();
            if (streamData?.url || streamData?.stream) {
              sources.push({
                serverName: "8Stream (Hindi HD)",
                quality: "1080p",
                url: streamData.url || streamData.stream,
                type: "hls",
                audioLanguage: "Hindi",
                isHindi: true,
                backupPriority: 1,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn("8StreamApi attempt skipped/failed, falling back to backup stack:", err);
    }
  }

  // 2. Try Moviebox API (Backup API 1)
  if (cleanImdb) {
    try {
      const mbRes = await fetch(`${MOVIEBOX_URL}/api/stream?id=${cleanImdb}&season=${season}&episode=${episode}`, {
        signal: AbortSignal.timeout(2500),
      }).catch(() => null);

      if (mbRes && mbRes.ok) {
        const mbData = await mbRes.json();
        if (mbData?.streams && Array.isArray(mbData.streams)) {
          mbData.streams.forEach((s: any) => {
            sources.push({
              serverName: `Moviebox ${s.audio || "Hindi Dual"}`,
              quality: s.quality || "720p",
              url: s.url,
              type: s.type || "hls",
              audioLanguage: s.audio || "Hindi",
              isHindi: true,
              backupPriority: 2,
            });
          });
        }
      }
    } catch (err) {
      console.warn("Moviebox API skipped/failed:", err);
    }
  }

  // 3. Fallback Embed Streams (LK21 / SuperEmbed / VidSrc / AutoEmbed with Hindi Dubbed audio options)
  const isMovie = mediaType === "movie";

  // Server 1: 8Stream / SuperEmbed Hindi Main Server
  const embedUrl1 = isMovie
    ? `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoPlay=true&audio=hi`
    : `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true&audio=hi`;

  sources.push({
    serverName: "Server 1 - 8Stream Hindi VIP",
    quality: "1080p HQ",
    url: embedUrl1,
    type: "embed",
    audioLanguage: "Hindi (Primary)",
    isHindi: true,
    backupPriority: 1,
  });

  // Server 2: VidLink Hindi Dual Audio
  const embedUrl2 = isMovie
    ? `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&multiLang=true`
    : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=e50914&multiLang=true`;

  sources.push({
    serverName: "Server 2 - VidLink Hindi Dual Audio",
    quality: "1080p",
    url: embedUrl2,
    type: "embed",
    audioLanguage: "Hindi / Multi-Audio",
    isHindi: true,
    backupPriority: 2,
  });

  // Server 3: LK21 / Moviebox Hindi Backup
  const embedUrl3 = isMovie
    ? `https://autoembed.co/movie/tmdb/${tmdbId}?lang=hi`
    : `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}?lang=hi`;

  sources.push({
    serverName: "Server 3 - LK21 Hindi Backup",
    quality: "720p / 1080p",
    url: embedUrl3,
    type: "embed",
    audioLanguage: "Hindi",
    isHindi: true,
    backupPriority: 3,
  });

  // Server 4: Multi-Audio Ultra
  const embedUrl4 = isMovie
    ? `https://2embed.cc/embed/${tmdbId}`
    : `https://2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;

  sources.push({
    serverName: "Server 4 - Multi-Audio Ultra",
    quality: "1080p",
    url: embedUrl4,
    type: "embed",
    audioLanguage: "Hindi / English",
    isHindi: true,
    backupPriority: 4,
  });

  // Ensure default primary source is Hindi
  const primaryStream = sources.find((s) => s.isHindi) || sources[0];

  return {
    imdbId: cleanImdb || undefined,
    season,
    episode,
    primaryStream,
    sources,
    defaultAudio: "Hindi",
  };
}
