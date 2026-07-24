# NIJI 🌈

**A local product search engine** — find what's actually in stock, nearby, right now.

NIJI (Japanese for "rainbow") is Project 1 of a portfolio series exploring full-stack search infrastructure: fast, geo-aware product discovery backed by a real inverted-index search engine rather than a bolted-on SQL `LIKE` query.

> ⚠️ **Status: Active development.** Core auth, search indexing, and geo-radius queries are working. Frontend UI is mid-iteration.

---

## What it does

- 🔍 **Full-text product search** powered by [Meilisearch](https://www.meilisearch.com/), with denormalized documents for fast, typo-tolerant queries
- 📍 **Nearby-shops search** using PostGIS + Haversine SQL for accurate geo-radius filtering
- 🔐 **Role-based auth** — separate flows for consumers browsing products and shop owners managing inventory
- ⚡ **Fire-and-forget indexing** — writes to Postgres sync to Meilisearch without blocking the request path

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Soft-UI design tokens (Manrope + IBM Plex Mono) |
| Backend | Express, JWT, bcrypt |
| Database | Supabase-hosted PostgreSQL (PostGIS + SSL) |
| Search | Meilisearch |
| Auth | Custom JWT-based auth with `AuthContext` / `useAuth` / `ProtectedRoute` |

---

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   React SPA │─────▶│  Express API │─────▶│ Supabase (PG +  │
│  (consumer/ │      │  (JWT auth)  │      │    PostGIS)      │
│  shop-owner)│      └──────┬───────┘      └─────────────────┘
└─────────────┘             │
                             ▼
                     ┌───────────────┐
                     │  Meilisearch  │
                     │ (denormalized │
                     │   documents)  │
                     └───────────────┘
```

- **Auth flow:** Consumers and shop owners route through separate protected paths via `ProtectedRoute`, with role checks handled in `AuthContext`.
- **Search flow:** Product writes to Postgres trigger a fire-and-forget sync to Meilisearch, keeping the write path fast while search stays near-real-time.
- **Geo flow:** Nearby-shop queries run Haversine distance calculations directly in SQL against PostGIS-enabled tables.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project (Postgres + PostGIS enabled)
- A running [Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/installation) instance (local or hosted)

### Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/niji.git
cd niji

# Install dependencies (backend + frontend)
npm install

# Configure environment variables
cp .env.example .env
# Fill in Supabase connection string, JWT secret, Meilisearch host/API key
```

### Environment Variables

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=
```

### Run locally

```bash
npm run dev
```

---

## Roadmap

- [x] Migrate from local PERN to Supabase-hosted Postgres
- [x] Full JWT auth with role-based routing
- [x] Meilisearch integration with denormalized indexing
- [x] Geo-radius nearby-shops search (Haversine SQL)
- [ ] Finish product card components (Soft-UI tokens)
- [ ] Meilisearch curriculum Module 2
- [ ] Shop-owner inventory dashboard
- [ ] Search relevance tuning / ranking rules
- [ ] Deployment pipeline

---

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.
