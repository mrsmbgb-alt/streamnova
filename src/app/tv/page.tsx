import type { Metadata } from "next";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Hindi TV Series - Watch Online",
  description: "Watch Hindi TV series and shows online in HD quality.",
};

export default function TVPage() {
  return (
    <CategoryPageClient
      category="tvseries"
      title="Hindi TV Series"
      subtitle="Hindi TV Shows & Web Series"
      mediaType="tv"
      heroGradient="from-blue-900/40"
    />
  );
}
