import { NextResponse } from "next/server";
import { db } from "@/db";
import { watchHistory } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || "guest_default";

  try {
    const history = await db
      .select()
      .from(watchHistory)
      .where(eq(watchHistory.sessionId, sessionId))
      .orderBy(desc(watchHistory.updatedAt))
      .limit(15);

    return NextResponse.json({ history });
  } catch (err) {
    console.warn("History fetch failed:", err);
    return NextResponse.json({ history: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sessionId = "guest_default",
      contentId,
      mediaType = "movie",
      title,
      posterPath,
      season = 1,
      episode = 1,
      progressSeconds = 0,
      durationSeconds = 0,
    } = body;

    if (!contentId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `${sessionId}_${contentId}_s${season}_e${episode}`;

    await db
      .insert(watchHistory)
      .values({
        id,
        sessionId,
        contentId: String(contentId),
        mediaType,
        title,
        posterPath,
        season,
        episode,
        progressSeconds,
        durationSeconds,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: watchHistory.id,
        set: {
          progressSeconds,
          durationSeconds,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Watch history save error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
