# NIJI

**Discover what's actually in stock near you.**

NIJI (also called NijiHaat) is a hyperlocal product Geolocation search engine that connects shoppers with nearby local shops — groceries, stationery, pharmacies, and more. Instead of scrolling through generic marketplace listings, users search for a product and instantly see which nearby shops actually have it, sorted by distance.

---

## Why NIJI

Local shops rarely have any online presence beyond a Google Maps pin. NIJI gives them a real, searchable storefront — and gives shoppers a fast way to answer the question *"does anyone near me sell this?"* without calling around or walking store to store.

---

## Features

- 🔍 **Fast, typo-tolerant product search** powered by Meilisearch
- 📍 **Geo-aware results** — search radius and distance-based sorting using the shopper's live location
- 🤖 **AI-generated search keywords** — Gemini expands every product listing with synonyms and related terms at upload time, so a search for "curd" still finds "yogurt"
- 🏪 **Shop owner dashboard** — manage products, view listings, and track shop performance
- 🔐 **Full authentication system** — separate shopper and shop-owner roles with JWT-based auth
- 🖼️ **Image uploads** via Cloudinary
- ⚡ **Resilient sync pipeline** — a queue-based system keeps the search index consistent with the database even if a step fails mid-way, with automatic retries

---

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- CSS Modules

**Backend**
- Node.js + Express
- PostgreSQL (hosted on Supabase)
- JWT authentication with bcrypt

**Search**
- Meilisearch — deployed as an independent microservice
- Google Gemini API — automatic keyword/synonym generation for every product

**Infrastructure**
- Cloudinary — image storage and delivery
- Vercel — frontend hosting
- Render — backend hosting
- Koyeb — Meilisearch microservice hosting

---

## Architecture

NIJI is split into three independently deployable services:

```
┌─────────────┐       ┌──────────────┐       ┌────────────────────┐
│  Frontend   │──────▶│   Backend    │──────▶│  Search Microservice │
│  (React)    │       │  (Express)   │       │   (Meilisearch)      │
└─────────────┘       └──────┬───────┘       └────────────────────┘
                              │                          ▲
                              ▼                          │
                       ┌─────────────┐                   │
                       │  Supabase   │                   │
                       │ (Postgres)  │                   │
                       └──────┬──────┘                   │
                              │                           │
                              ▼                           │
                       ┌─────────────┐                    │
                       │   Gemini    │────────────────────┘
                       │  (keywords) │   push to index
                       └─────────────┘
```

**The sync pipeline**, in short: when a product is created, its data is queued for processing. Gemini generates search keywords from the product's name and description, which are saved to Postgres. The enriched product is then pushed to the Meilisearch index. If either step fails, the product stays in a queue table and is automatically retried — and if the search index itself is ever lost or restarted, it's rebuilt from scratch directly from the database. Nothing depends on the search index being durable.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (Postgres)
- A Meilisearch instance (local binary or Docker)
- A Cloudinary account
- A Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/niji.git
cd niji
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in Supabase, Cloudinary, Gemini, and Meilisearch service URL
npm start
```

### 3. Search microservice setup

```bash
cd meilisearch
npm install
cp .env.example .env   # fill in Meilisearch host/key and Supabase service role key
npm start
```

### 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # fill in backend and search API URLs
npm run dev
```

---

## Project Structure

```
niji/
├── frontend/        # React + TypeScript client
├── backend/         # Express API — auth, shops, products
└── meilisearch/     # Independent search microservice
```

---

## Roadmap

- [ ] Shop-level search alongside product search
- [ ] In-app chat between shoppers and shop owners
- [ ] Order/reservation flow

---

## License

This project is currently unlicensed — all rights reserved.
