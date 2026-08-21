import type { Metadata } from "next";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Korean Drama Hindi Dubbed - K-Drama Online",
  description: "Watch Korean dramas with Hindi dubbing online in HD quality.",
};

export default function KoreanPage() {
  return (
    <CategoryPageClient
      category="korean"
      title="Korean Drama"
      subtitle="K-Drama with Hindi Audio"
      mediaType="korean"
      heroGradient="from-purple-900/40"
    />
  );
}
