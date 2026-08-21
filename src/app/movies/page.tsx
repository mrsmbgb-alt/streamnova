import type { Metadata } from "next";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Hindi Movies - Bollywood & Hindi Dubbed",
  description: "Watch Bollywood and Hindi dubbed movies online in HD quality.",
};

export default function MoviesPage() {
  return (
    <CategoryPageClient
      category="movies"
      title="Hindi Movies"
      subtitle="Bollywood & Hindi Dubbed Collection"
      mediaType="movie"
      heroGradient="from-orange-900/40"
    />
  );
}
