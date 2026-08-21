import { pgTable, text, timestamp, integer, real, jsonb, primaryKey } from "drizzle-orm/pg-core";

// Table for caching API responses (TMDB, streams, metadata)
export const cacheEntries = pgTable("cache_entries", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table for user Watchlists
export const watchlists = pgTable("watchlists", {
  id: text("id").primaryKey(), // e.g. `${sessionId}_${contentId}`
  sessionId: text("session_id").notNull(),
  contentId: text("content_id").notNull(),
  mediaType: text("media_type").notNull(), // movie, tv, kdrama, anime
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  voteAverage: real("vote_average"),
  releaseYear: text("release_year"),
  hasHindiAudio: text("has_hindi_audio").default("true"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Table for Watch History ("Continue Watching")
export const watchHistory = pgTable("watch_history", {
  id: text("id").primaryKey(), // e.g. `${sessionId}_${contentId}_s${season}_e${episode}`
  sessionId: text("session_id").notNull(),
  contentId: text("content_id").notNull(),
  mediaType: text("media_type").notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  season: integer("season").default(1),
  episode: integer("episode").default(1),
  progressSeconds: real("progress_seconds").default(0),
  durationSeconds: real("duration_seconds").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table for User Reviews & Ratings
export const contentReviews = pgTable("content_reviews", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  mediaType: text("media_type").notNull(),
  authorName: text("author_name").notNull(),
  rating: real("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
