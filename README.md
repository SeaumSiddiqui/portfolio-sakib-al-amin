# Client portfolio

Portfolio for a motion, 3D and graphic designer. Light grey canvas, black "instrument" panels, mono HUD labels — the work is the only colour.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP (CustomEase, ScrollTrigger) · Lenis · React Three Fiber + drei · hls.js · Sanity 6 (Studio at `/studio`)

## Run it

```bash
npm install
cp .env.example .env.local   # optional until Sanity is connected
npm run dev                  # http://localhost:3000
```

Without a Sanity project ID the site runs on the placeholder content in `src/content/fallback.ts`.

## Connect Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and put its ID in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. In the project's **API → CORS origins**, add `http://localhost:3000` (and the production URL) with **Allow credentials** on.
3. Restart `npm run dev` and open `/studio`. Fill in **Site settings**, **About**, then add **Projects** and **Services**.
4. Optional: create an **Editor** token and set `SANITY_API_WRITE_TOKEN` so the enquiry form saves submissions under **Enquiries**.

Content is cached for 60 seconds (`REVALIDATE_SECONDS` in `src/lib/data.ts`). Any field left empty falls back to the placeholder value.

## Where things live

| Path | What |
|---|---|
| `src/styles/tokens.css` | **Every design token**: colours, type scale, radii, easing, durations, grain, grid curve. Tailwind utilities and GSAP both read from here. |
| `src/styles/components.css` | Shared component classes (`.label`, `.instrument`, `.chip`, `.segment`, `.highlight-bars`, `.grain`). |
| `src/app/fonts.ts` | Font loading. Swap to Neue Haas Display + PP Supply Mono via `next/font/local` once licensed. |
| `src/lib/motion.ts` | GSAP setup; builds its eases from the CSS tokens. |
| `src/components/frame/` | Persistent HUD: status bar + live clock, showreel/booking chips, menu, preloader, full-screen film player. |
| `src/components/home/WorkStrip.tsx` | Self-playing home strip (drag / wheel to nudge). |
| `src/components/work/CurvedGrid.tsx` | Endless curved project grid (drag, wheel, arrow keys). Flat grid on phones. |
| `src/components/project/` | Project hero, render-pass breakdown, real-time 3D turntable. |
| `src/components/services/ProcessDiagram.tsx` | Services diagram that draws on scroll. |
| `src/sanity/` | Schemas, Studio structure, client, GROQ queries. |
| `src/lib/data.ts` | Data access with fallback to placeholder content. |

## Media

Each media field takes an image, an uploaded video, or a video URL (`.mp4`, or HLS `.m3u8` e.g. from Mux). Card loops should be short, muted and under ~4 MB. 3D model sections take a `.glb`.
