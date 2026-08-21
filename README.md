# 🎬 StreamNova - Cloud-Native Hindi Audio Streaming Website

StreamNova is a 100% FREE, cloud-native streaming web platform where users can watch Movies, TV Series, Korean Dramas, and Anime—all with primary Hindi audio. Built using Next.js 14 App Router, Tailwind CSS, TMDB API, 8StreamApi, Moviebox API, and PostgreSQL/Upstash Redis.

---

## 🌟 Key Features

- **Hindi Audio Default**: Every movie, series, K-drama, and anime prioritizes Hindi dual audio streams.
- **API Stack Integration**:
  - **TMDB API**: High-speed metadata, posters, cast, trailers, and IMDb IDs (`tt1877830`).
  - **8StreamApi (Primary)**: Fetches stream links using IMDb ID.
  - **Moviebox & LK21 APIs (Backup)**: Direct fallback streaming sources.
  - **Multi-Server Player**: 4 streaming servers with Hindi dub audio selection & episode switcher.
- **Dark Theme (Netflix-Style UI)**: Responsive design from mobile 320px to 4K displays.
- **Watchlist & History**: Save favorites and track watch progress ("Continue Watching").
- **Ad Network Ready**: Top Header (728x90), Middle In-Feed, Footer, and Pop-Under on "Watch Now" interaction.
- **Cloud-Native**: Zero recurring costs; ready for Cloudflare Pages & Vercel deployment.

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/streamnova.git
cd streamnova
npm install
```

### Step 2: Deploy 8StreamApi (Primary Streaming Service)

1. Fork the 8StreamApi repository: [https://github.com/himanshu8443/8StreamApi](https://github.com/himanshu8443/8StreamApi)
2. Deploy to Vercel as a Serverless Function.
3. Copy your deployed Vercel URL (e.g., `https://8streamapi.vercel.app`).

### Step 3: Deploy Main App on Cloudflare Pages

1. Push your code to GitHub.
2. Go to **Cloudflare Pages** dashboard -> **Create a project** -> **Connect Git**.
3. Configure Build Settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add Environment Variables:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
   NEXT_PUBLIC_8STREAM_API_URL=https://your-8stream-api.vercel.app
   NEXT_PUBLIC_BACKUP_API_URL=https://moviebox-api.vercel.app
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db
   ```
5. Click **Save and Deploy**.

### Step 4: Backup Deployment on Vercel

1. Import the same GitHub repository on Vercel.
2. Add the environment variables above.
3. Click **Deploy**.

---

## 🔑 Environment Variables

Create `.env.local` for environment variables:

```env
# TMDB API Key (Free)
NEXT_PUBLIC_TMDB_API_KEY=8415443a5716e25442a9d80d2a84fb83

# Primary & Backup Streaming APIs
NEXT_PUBLIC_8STREAM_API_URL=https://8stream-api.vercel.app
NEXT_PUBLIC_BACKUP_API_URL=https://moviebox-api.vercel.app

# PostgreSQL Database URL
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

---

## 🛠️ Data Flow Architecture

```
User Request → TMDB API (Fetch metadata + IMDb ID)
            → 8StreamApi (Fetch .m3u8 / embed using IMDb ID)
            → Fallback to Moviebox / VidLink / LK21 if primary is down
            → Filter Hindi audio streams
            → Render Video Player
```

---

## ⚡ Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Database / ORM**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS + Lucide Icons
- **Icons**: Lucide React
- **Streaming Engine**: 8StreamApi, Moviebox, VidLink, AutoEmbed, SuperEmbed

---

## 📄 License

MIT License. Free for open-source and personal streaming websites.
