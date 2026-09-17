# Shanmuga Priya Crackers — Product Catalogue & Enquiry Platform

A modern fireworks catalogue website with WhatsApp enquiry flow and admin panel for Shanmugapriya Fire Works.

## Features

- Product catalogue with search, filters, and sorting
- Cart → WhatsApp enquiry (no online payment)
- Customer accounts and wishlist
- Admin panel for products, categories, enquiries, and settings
- SEO-optimized SPA (static fallback, sitemap, JSON-LD)

## Tech Stack

- React 19, TypeScript, Vite, Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage)
- Vercel hosting

## Quick Start

```powershell
cd "e:\crackers\shanmugas fireworks"
npm install
npm run dev
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add **Supabase Project URL** and publishable key (key is already in `.env`)
3. Run `npm run db:migrate` (requires `SUPABASE_DB_PASSWORD`)
4. See [SETUP.md](SETUP.md) for full setup
5. See [CLIENT-DETAILS.md](CLIENT-DETAILS.md) for client information to collect

## Build & Deploy

```powershell
npm run build
npx vercel --prod
```

Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SITE_URL` in Vercel environment variables.

## Brand Assets

- Logo: `public/shanmuga-priya-logo.png` (from `Shanmuga Priya Logo.pdf`)
- Favicons and OG image: generated via `npm run favicons`

## Placeholders (awaiting client)

- Shop address and Google Maps embed
- WhatsApp and phone numbers
- Social media URLs
- Product catalogue (import via admin or `npm run import:catalog`)
