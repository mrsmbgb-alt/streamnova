import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(), // movie, tv, anime, korean
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  overview: text("overview"),
  rating: text("rating"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const continueWatching = pgTable("continue_watching", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  progressSeconds: integer("progress_seconds").default(0),
  totalSeconds: integer("total_seconds").default(0),
  season: integer("season"),
  episode: integer("episode"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  userRating: integer("user_rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
