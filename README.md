# StreamNova 🎬

> একটি পূর্ণাঙ্গ Netflix-স্টাইলের হিন্দি অডিও স্ট্রিমিং প্ল্যাটফর্ম

**StreamNova** is a full-stack Hindi audio streaming platform built with Next.js 15, featuring Bollywood movies, Hindi dubbed anime, Korean dramas, and TV series.

---

## 🚀 Features

- 🎵 **Hindi Audio Default** — All content defaults to Hindi audio/dubbed versions
- 🎬 **4 Content Categories** — Movies, TV Series, K-Drama, Anime
- 🔍 **Smart Search** — Search across all content types
- ❤️ **Watchlist** — Save content to watch later (localStorage)
- 🌙 **Dark Netflix-style UI** — Smooth animations and skeleton loading
- 📱 **Mobile-First** — Bottom navigation + responsive design
- 🌐 **i18n** — English & Hindi UI language support
- 💰 **Ad Slots** — Pre-configured header, inline, and footer ad slots
- ⚡ **Fast Loading** — ISR caching, React Query client-side cache
- 🎭 **Genre Filtering** — Filter content by Action, Comedy, Drama, etc.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Data Fetching | TanStack React Query + Axios |
| Database | PostgreSQL + Drizzle ORM |
| Content API | TMDB (The Movie Database) |
| Video Embed | VidSrc.to + Embed.su |

---

## 📦 Setup & Installation

### 1. Clone & Install

```bash
git clone https://github.com/your-username/streamnova.git
cd streamnova
npm install
```

### 2. Get TMDB API Key (Free)

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create a free account
3. Go to **Settings → API → Create (Developer)**
4. Copy your **API Key (v3 auth)**

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/streamnova_db
TMDB_API_KEY=your_tmdb_api_key_here
```

### 4. Database Setup

```bash
npx drizzle-kit push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Cloudflare Pages Deployment

### Prerequisites
- Cloudflare account
- GitHub repo with your code
- PostgreSQL database (e.g., Neon, Supabase, or Cloudflare D1)

### Step 1: Connect Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages → Create application → Pages**
3. Connect your GitHub repository

### Step 2: Build Configuration

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `npm run build` |
| Build output | `.next` |
| Node.js version | 18 or 20 |

### Step 3: Environment Variables

Add in Cloudflare Pages **Settings → Environment variables**:

```
DATABASE_URL = your_production_postgres_url
TMDB_API_KEY = your_tmdb_api_key
```

### Step 4: Enable Cloudflare CDN Caching

Add `_headers` file to `public/` directory:
```
/api/tmdb/*
  Cache-Control: public, max-age=3600, s-maxage=3600
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=86400
```

### Step 5: Deploy

```bash
git push origin main
# Cloudflare auto-deploys on push
```

---

## 🔀 Vercel Backup Deployment

If Cloudflare has issues, deploy to Vercel instantly:

### Quick Deploy
```bash
npm install -g vercel
vercel --prod
```

### Or via Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables (same as Cloudflare)
4. Deploy!

> ✅ **Zero config change needed** — Same `.env` variables work on both platforms.

---

## 📺 Video Streaming

StreamNova uses free embed sources for video streaming:

| Source | URL Pattern | Notes |
|--------|------------|-------|
| VidSrc (Primary) | `vidsrc.to/embed/movie/{tmdb_id}` | Hindi audio available |
| EmbedSu (Backup) | `embed.su/embed/movie/{tmdb_id}` | Hindi dub fallback |

### Hindi Audio Logic
```
1. Content with original_language=hi → Native Hindi ✓
2. Content from KO/JA/EN → Hindi Dubbed via embed sources ✓
3. Player auto-detects Hindi audio track
4. User can switch tracks in player if multiple available
```

---

## 💰 Ad Integration

Pre-configured ad slots are ready. Replace with your ad network code:

### AdSense / Ad Network Setup

Edit `src/components/AdSlot.tsx`:
```tsx
// Replace the ad-slot div content with your ad network script
<div className={`ad-slot ${adSizes[position]}`}>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
  <ins className="adsbygoogle"
    data-ad-client="ca-pub-YOUR_ID"
    data-ad-slot="YOUR_SLOT" />
</div>
```

### Pop-under Ad

Edit `src/components/AdSlot.tsx`:
```typescript
export function triggerPopunder(adUrl = "https://your-ad-network.com/popunder") {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (w) w.location.href = adUrl;
}
```

Pop-under triggers automatically when user clicks **"Watch Now"**.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── tmdb/          # TMDB API proxy routes
│   ├── movie/[id]/        # Movie detail page
│   ├── tv/[id]/           # TV show detail page
│   ├── anime/[id]/        # Anime detail page
│   ├── korean/[id]/       # K-Drama detail page
│   ├── movies/            # Movies category page
│   ├── tv/                # TV series category page
│   ├── anime/             # Anime category page
│   ├── korean/            # K-Drama category page
│   ├── search/            # Search page
│   ├── watchlist/         # User watchlist
│   └── settings/          # App settings (language, etc.)
├── components/
│   ├── Navbar.tsx         # Top navigation
│   ├── BottomNav.tsx      # Mobile bottom nav
│   ├── HeroBanner.tsx     # Featured content hero
│   ├── ContentCard.tsx    # Movie/show card
│   ├── ContentRow.tsx     # Horizontal scrollable row
│   ├── VideoPlayer.tsx    # Embedded video player
│   ├── GenreFilter.tsx    # Genre filter buttons
│   ├── AdSlot.tsx         # Ad placement components
│   └── SkeletonCard.tsx   # Loading skeletons
├── lib/
│   ├── tmdb.ts            # TMDB API functions
│   ├── store.ts           # Zustand state management
│   └── i18n.ts            # Translations (EN/HI)
├── hooks/
│   └── useLanguage.ts     # Language hook
└── db/
    ├── index.ts           # Database connection
    └── schema.ts          # Drizzle schema
```

---

## 🌐 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/tmdb/home` | GET | Home page data (ISR cached 1h) |
| `/api/tmdb/movie/[id]` | GET | Movie details |
| `/api/tmdb/tv/[id]` | GET | TV show details |
| `/api/tmdb/search?q=` | GET | Search content |
| `/api/tmdb/category?cat=&page=` | GET | Category listing |
| `/api/health` | GET | Health check |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `TMDB_API_KEY` | ✅ | TMDB API key (free at themoviedb.org) |

---

## 📱 Mobile Features

- Bottom navigation bar (Home, Movies, Search, Anime, Watchlist)
- Touch-friendly card hover effects
- Responsive grid layouts (2 → 6 columns)
- Horizontal scrollable content rows
- Mobile-optimized hero banner

---

## ⚡ Performance

- **ISR** — API routes cached for 1 hour
- **React Query** — Client-side cache (5 min stale, 30 min gc)
- **Image optimization** — Next.js `<Image>` with TMDB CDN
- **Code splitting** — Automatic with Next.js App Router
- **Skeleton loading** — Netflix-style loading states

---

## 📄 License

MIT License — Free to use and modify.

---

*Made with ❤️ for Hindi content lovers*
# streamnova
