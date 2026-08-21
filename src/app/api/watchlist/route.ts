import { NextResponse } from "next/server";
import { db } from "@/db";
import { watchlists } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || "guest_default";

  try {
    const items = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.sessionId, sessionId));

    return NextResponse.json({ watchlist: items });
  } catch (err) {
    console.warn("Database watchlist fetch failed, returning empty list:", err);
    return NextResponse.json({ watchlist: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId = "guest_default", contentId, mediaType, title, posterPath, backdropPath, voteAverage, releaseYear } = body;

    if (!contentId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `${sessionId}_${contentId}`;

    await db
      .insert(watchlists)
      .values({
        id,
        sessionId,
        contentId: String(contentId),
        mediaType: mediaType || "movie",
        title,
        posterPath,
        backdropPath,
        voteAverage: voteAverage ? Number(voteAverage) : null,
        releaseYear: releaseYear ? String(releaseYear) : null,
        hasHindiAudio: "true",
      })
      .onConflictDoNothing();

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Watchlist save error:", err);
    return NextResponse.json({ success: false, error: "Failed to save to watchlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || "guest_default";
  const contentId = searchParams.get("contentId");

  if (!contentId) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 });
  }

  try {
    const id = `${sessionId}_${contentId}`;
    await db.delete(watchlists).where(eq(watchlists.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Watchlist delete error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete from watchlist" }, { status: 500 });
  }
}
