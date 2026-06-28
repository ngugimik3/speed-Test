# SwiftTest — Internet Speed Test

A production-quality Internet Speed Test application with a premium dark UI, built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- **Real-world speed measurements** via Cloudflare's global edge network
- **Animated speedometer gauge** with neon gradient arc and smooth needle
- **Live metrics** — download, upload, ping, and jitter updated in real time
- **Test history** — last 20 tests saved in localStorage, with delete/clear
- **Statistics** — fastest speeds, lowest ping, averages, and charts
- **Charts** — download/upload history and ping history via Recharts
- **Settings** — dark/light mode toggle, server selection
- **Glassmorphism UI** — rounded cards, soft shadows, neon gradients
- **Smooth page transitions** with Framer Motion
- **Toast notifications** for test completion and actions
- **Fully responsive** — desktop sidebar + mobile bottom nav

## Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Tailwind CSS | 3 |
| Framer Motion | 11 |
| Recharts | 2 |
| React Router | 6 |
| React Hot Toast | 2 |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── assets/
├── components/
│   ├── Gauge/        # Animated speedometer
│   ├── Charts/       # Recharts visualizations
│   ├── Cards/        # MetricCard, InfoBadge
│   ├── Buttons/      # StartButton
│   ├── Navbar/       # Sidebar + mobile nav
│   └── Loader/       # Spinner, Skeleton, EmptyState
├── context/          # AppContext (history + settings)
├── hooks/            # useSpeedTest
├── layouts/          # MainLayout
├── pages/            # Home, History, Statistics, Settings, About
├── services/         # speedTest.ts — real measurement logic
├── types/            # TypeScript interfaces
└── utils/            # formatters, computeStats, mbpsToAngle
```

## How Measurements Work

Speed is measured using the browser's native `fetch` API against `speed.cloudflare.com`:

- **Ping** — multiple HEAD requests timed with `performance.now()`, averaged (trimming outliers)
- **Jitter** — standard deviation of ping samples
- **Download** — progressively larger payloads (100KB → 1MB → 10MB → 25MB), 85th-percentile result
- **Upload** — POST random bytes in increasing sizes, 85th-percentile result
- **IP / ISP** — fetched from `speed.cloudflare.com/meta`

No third-party speed test services, plugins, or native dependencies are required.

## License

MIT
