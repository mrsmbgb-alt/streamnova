"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User, Sparkles } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  contentId: string | number;
  mediaType: string;
}

export default function ReviewsSection({ contentId, mediaType }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [contentId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?contentId=${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.warn("Failed fetching reviews:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: String(contentId),
          mediaType,
          authorName: authorName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        setAuthorName("");
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch (err) {
      console.error("Submit review error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-neutral-800">
      <div className="flex items-center gap-2 text-white font-bold text-base">
        <MessageSquare className="w-5 h-5 text-red-500" />
        <span>Community Reviews & Discussion</span>
      </div>

      {/* Write a Review */}
      <form onSubmit={handleSubmit} className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Leave a Review</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your Name / Handle"
            className="bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5">
            <span className="text-xs text-neutral-400 font-semibold">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts on the Hindi dubbing, story, audio sync..."
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl p-3 text-xs text-white outline-none resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Posting..." : "Post Review"}</span>
        </button>
      </form>

      {/* Review List */}
      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">{rev.authorName}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rev.rating}/5</span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-neutral-500 italic">No community reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
