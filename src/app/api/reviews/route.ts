import { NextResponse } from "next/server";
import { db } from "@/db";
import { contentReviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");

  if (!contentId) {
    return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
  }

  try {
    const reviews = await db
      .select()
      .from(contentReviews)
      .where(eq(contentReviews.contentId, contentId))
      .orderBy(desc(contentReviews.createdAt))
      .limit(20);

    return NextResponse.json({ reviews });
  } catch (err) {
    console.warn("Reviews fetch failed:", err);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contentId, mediaType = "movie", authorName, rating, comment } = body;

    if (!contentId || !authorName || !comment || !rating) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(contentReviews).values({
      id,
      contentId: String(contentId),
      mediaType,
      authorName,
      rating: Number(rating),
      comment,
    });

    return NextResponse.json({ success: true, reviewId: id });
  } catch (err) {
    console.error("Post review error:", err);
    return NextResponse.json({ success: false, error: "Failed to post review" }, { status: 500 });
  }
}
