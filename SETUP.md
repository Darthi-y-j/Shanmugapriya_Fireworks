# Shanmuga Priya Crackers — Setup Guide

## 1. Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | `https://YOUR_PROJECT_REF.supabase.co` (no `/rest/v1`) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Publishable key (`sb_publishable_…`) — already in `.env` |
| `VITE_SITE_URL` | For production | e.g. `https://www.shanmugapriyacrackers.com` |
| `SUPABASE_DB_PASSWORD` | For migrations | Database password from Supabase Dashboard |

## 2. Database migrations

```powershell
cd "e:\crackers\shanmugas fireworks"
npm install
npm run db:migrate
```

This runs all SQL files in `supabase/migrations/` in order.

## 3. Storage buckets

In Supabase Dashboard → Storage, create public buckets:

- `product-images`
- `category-images`
- `logos`
- `product-videos`

## 4. Auth redirect URLs

Supabase Dashboard → Authentication → URL Configuration:

- **Site URL:** your production domain
- **Redirect URLs:** `https://www.shanmugapriyacrackers.com/**`, `/auth/confirm`, `/reset-password`, plus `http://localhost:5173/**` for dev

## 5. First admin user

1. Register a user via `/register` or Supabase Auth
2. In SQL Editor, add to `admin_users`:

```sql
INSERT INTO admin_users (user_id, role)
VALUES ('YOUR_AUTH_USER_UUID', 'admin');
```

## 6. Client details to collect

See `CLIENT-DETAILS.md` for the full checklist (address, WhatsApp, map, catalogue, social links).

Update placeholders in:

- `src/lib/businessInfo.ts`
- `src/lib/maps.ts`
- Admin → Settings (once DB is live)

## 7. Product catalogue

When the client provides an XLSX price list:

```powershell
npm run import:catalog
```

Or add products manually via `/admin/products`.

## 8. Deploy

```powershell
npm run build
vercel --prod
```

Set the same env vars in Vercel → Settings → Environment Variables.
