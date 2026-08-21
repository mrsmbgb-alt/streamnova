import type { Metadata } from "next";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Hindi Dubbed Anime - Watch Anime Online",
  description: "Watch anime with Hindi dubbing online in HD quality.",
};

export default function AnimePage() {
  return (
    <CategoryPageClient
      category="anime"
      title="Hindi Dubbed Anime"
      subtitle="Popular Anime with Hindi Audio"
      mediaType="anime"
      heroGradient="from-indigo-900/40"
    />
  );
}
