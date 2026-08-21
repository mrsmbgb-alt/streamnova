"use client";

import { Settings, Globe, Moon, Bell, Shield, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingsPage() {
  const { uiLanguage, setUILanguage, watchlist, continueWatching } = useAppStore();
  const { t } = useLanguage();

  const languages = [
    { code: "en" as const, label: "English", native: "English" },
    { code: "hi" as const, label: "Hindi", native: "हिंदी" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={28} className="text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-black text-white">{t("settings")}</h1>
      </div>

      <div className="space-y-4">
        {/* UI Language */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-blue-400" />
            <h2 className="text-white font-semibold text-lg">{t("uiLanguage")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setUILanguage({ code: lang.code, label: lang.label })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  uiLanguage.code === lang.code
                    ? "border-red-500 bg-red-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                }`}
              >
                <p className="text-white font-semibold">{lang.native}</p>
                <p className="text-gray-400 text-sm">{lang.label}</p>
                {uiLanguage.code === lang.code && (
                  <span className="inline-block mt-2 text-red-400 text-xs font-semibold">✓ Active</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Language Info */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-orange-400" />
            <h2 className="text-white font-semibold text-lg">Audio Language</h2>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
            <p className="text-orange-300 text-sm">
              All content streams with <strong>Hindi Audio</strong> by default.
              Use player controls to switch audio tracks if available.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-green-400" />
            <h2 className="text-white font-semibold text-lg">Your Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <p className="text-3xl font-black text-white">{watchlist.length}</p>
              <p className="text-gray-400 text-sm mt-1">In Watchlist</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <p className="text-3xl font-black text-white">{continueWatching.length}</p>
              <p className="text-gray-400 text-sm mt-1">Continue Watching</p>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-purple-400" />
            <h2 className="text-white font-semibold text-lg">Privacy & Data</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            StreamNova stores your watchlist and preferences locally in your browser.
            No account required. Your data stays on your device.
          </p>
          <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm">
            <Shield size={14} />
            Data stored locally in browser storage
          </div>
        </div>

        {/* About */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-black text-xl">Stream<span className="text-red-500">Nova</span></span>
            <span className="text-gray-600 text-sm">v1.0.0</span>
          </div>
          <p className="text-gray-400 text-sm">
            A Netflix-style Hindi audio streaming platform featuring Bollywood movies,
            Hindi dubbed anime, Korean dramas, and TV series.
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Content metadata provided by TMDB. Videos streamed from third-party sources.
          </p>
        </div>
      </div>
    </div>
  );
}
