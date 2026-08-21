import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import QueryProvider from "@/components/QueryProvider";
import AdSlot from "@/components/AdSlot";

export const viewport: Viewport = {
  themeColor: "#e50914",
};

export const metadata: Metadata = {
  title: {
    default: "StreamNova - Hindi Audio Streaming",
    template: "%s | StreamNova",
  },
  description:
    "Stream Bollywood movies, Hindi dubbed anime, Korean dramas, and TV series in Hindi audio. HD quality streaming with Hindi dubbing.",
  keywords: ["hindi streaming", "bollywood", "hindi dubbed anime", "korean drama hindi", "hindi movies online"],
  openGraph: {
    siteName: "StreamNova",
    type: "website",
    locale: "hi_IN",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-gray-100 antialiased">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen pb-20 lg:pb-0">
            {children}
          </main>
          <BottomNav />
          {/* Footer Ad */}
          <footer className="border-t border-gray-800/50 py-6">
            <div className="flex flex-col items-center gap-4 px-4">
              <AdSlot position="footer" />
              <div className="text-center">
                <p className="text-gray-600 text-xs">
                  © {new Date().getFullYear()} StreamNova • Stream in Hindi Audio
                </p>
                <p className="text-gray-700 text-xs mt-1">
                  All content is sourced from third-party providers. We do not host any videos.
                </p>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
