# SEO Playbook (SPA / Vite + React)

Copy this checklist onto another project. Prime Crackers is a **Vite + React Router SPA** (not Next.js), so crawlers only see `index.html` until JavaScript runs. The work below is built for that constraint.

**Reference site:** [https://www.primecracker.com](https://www.primecracker.com)

---

## 1. Decide the canonical brand first

Pick these once and reuse them everywhere (HTML, React, sitemap, robots, OG, schema). Never mix `www` / apex / old domains.

| Constant | This project | Change per client |
| --- | --- | --- |
| `SITE_URL` | `https://www.primecracker.com` | Production URL, **no trailing slash** |
| `SITE_NAME` | `Prime Crackers` | Legal / brand name |
| Locale | `en-IN` / `en_IN` | `html lang`, `og:locale`, schema `inLanguage` |
| Geo | Sivakasi, Tamil Nadu, IN | NAP (name, address, phone) |
| Theme color | `#004D55` | Brand hex |
| Default OG | `/og-share.png` | 1200×630 WhatsApp/Facebook card
| Social | Instagram, YouTube | `sameAs` URLs |

Store them in **one** source of truth, then duplicate the URL list for Node build scripts (Vite aliases do not apply in `scripts/`).

This repo:

- `src/lib/siteConfig.ts` — React app
- `scripts/seo-config.mjs` — sitemap generator (keep in sync)

---

## 2. File map (copy this structure)

```
index.html                          ← crawler-visible homepage SEO + noscript body
public/robots.txt
public/sitemap.xml                  ← generated at build
public/site.webmanifest
public/og-share.png
public/favicon.ico, favicon-32x32.png, favicon-192x192.png, apple-touch-icon.png
api/sitemap.xml.js                  ← Vercel: serve XML with correct Content-Type
scripts/seo-config.mjs
scripts/generate-sitemap.mjs
scripts/generate-favicons.mjs
scripts/optimize-page-images.mjs    ← WebP sidecars for large PNG/JPG
src/lib/siteConfig.ts
src/lib/seo.ts                      ← buildCanonicalUrl()
src/lib/structuredData.ts
src/components/shared/SEO.tsx
src/components/shared/RouteSEO.tsx
src/components/shared/JsonLd.tsx
```

Wrap the app with `HelmetProvider` (`react-helmet-async`). Every public page renders `<SEO />`. Private pages use `noIndex`.

---

## 3. Homepage HTML that Google can read without JS

Because this is a SPA, **homepage title, description, canonical, OG, Twitter, and body copy must live in `index.html`**, not only in React.

### Head (minimum)

```html
<html lang="en-IN">
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="index, follow" />
<title>Primary keyword | Brand</title>          <!-- ~50–60 chars -->
<meta name="description" content="…" />        <!-- ~140–160 chars -->
<link rel="canonical" href="https://www.example.com/" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
<!-- og:* + twitter:* matching title/description/canonical/image -->
<!-- favicons + manifest + theme-color -->
<link rel="preload" as="image" href="/hero.webp" type="image/webp" fetchpriority="high" />
```

### Body fallback (critical for SPA)

Put crawlable copy in a `<main id="static-seo-fallback">`:

- One **H1** with the same primary keyword as the document title
- 2–4 short **H2** sections with unique paragraphs (not keyword stuffing)
- Internal links to About, Products, Categories, FAQ, Contact, Safety, Delivery
- A few high-quality external links (Maps, Wikipedia industry page, official regulator) with `rel="noopener noreferrer"`
- `<noscript>` note that JS is required for the shop

On hydrate, **remove** the fallback so users do not see duplicate content:

```ts
document.getElementById('static-seo-fallback')?.remove()
```

React then renders the real homepage, including a visible SEO content block (`HomeSeoSection`) with the same topics, internal links, and share/copy URL.

---

## 4. Title and description rules

| Page | Title pattern | Notes |
| --- | --- | --- |
| Home | `{Primary keyword} \| {Brand}` | Use `titleIsFull` — do not append `\| Brand` twice |
| Inner pages | `{Page} \| {Brand}` | Default in `<SEO />` |
| Product | `{Product name} \| {Brand}` | Description from product text, else `{name} — {price} at {Brand}` |

**Home title (this project):** `Sivakasi Diwali Fireworks Wholesale | Prime Crackers`  
Align the **on-page H1** with that keyword (`Diwali Crackers from Sivakasi`).

**Home description:** brand tagline + offer + location + delivery. Write for humans; do not repeat the same phrase five times.

Optional static keywords / geo in `index.html` only:

```html
<meta name="keywords" content="Brand, primary products, city, category terms" />
<meta name="geo.region" content="IN-TN" />
<meta name="geo.placename" content="Sivakasi" />
```

---

## 5. React SEO component (every route)

`<SEO />` via `react-helmet-async` with `prioritizeSeoTags` should set:

- `<title>`
- `description`, `robots`, `application-name`, `theme-color`
- `google-site-verification` from `VITE_GOOGLE_SITE_VERIFICATION` (optional)
- Canonical (`SITE_URL` + path; homepage is `{SITE_URL}/`)
- Favicons + web manifest
- Open Graph: `site_name`, `title`, `description`, `type`, `url`, `image` + width/height/type/alt, `locale`
- Twitter: `summary_large_image` + matching title/description/image/alt

**Canonical helper**

- Explicit `http(s)` URL → use as-is
- Path override (`/about`) → `{SITE_URL}/about`
- Homepage pathname `/` → `{SITE_URL}/` (trailing slash)

**OG image**

- Absolute URL if already `http`
- Else prefix `SITE_URL`
- Default: `{SITE_URL}/og-share.png`
- Product pages: pass the product image

**Early canonical:** mount `<RouteSEO />` in the customer layout so a canonical exists before lazy page chunks load (needed with React 19 + helmet).

---

## 6. Index vs noindex

**Index** (also list in sitemap): `/`, `/about`, `/contact`, `/faq`, `/delivery`, `/safety`, `/privacy`, `/terms`, `/products`, `/products/:slug`, `/categories`, other public content pages.

**`noindex, nofollow`** (and **Disallow** in robots.txt): login, register, auth confirm, reset password, cart, wishlist, search, account/*, admin/*.

Do not put private URLs in the sitemap.

---

## 7. Structured data (JSON-LD)

Inject with a tiny component:

```tsx
<script type="application/ld+json">{JSON.stringify(data)}</script>
```

| Page | Graph |
| --- | --- |
| Home | `Organization` + `Store` + `WebSite` (SearchAction) |
| Product | `Product` + `Offer` + `BreadcrumbList` |
| Listing pages | `BreadcrumbList` only |

Organization fields: name, url, logo, description, email, telephone, `PostalAddress`, `sameAs` social profiles. Use stable `@id`s:

- `{SITE_URL}/#organization`
- `{SITE_URL}/#website`

Product: name, description, url, sku, image[], brand, category, Offer (`priceCurrency`, `price`, `InStock` / `OutOfStock`, seller `@id`).

Optional next step (not in this repo yet): `FAQPage` schema on `/faq`.

---

## 8. On-page content SEO

- **One H1 per page.** Home H1 matches the primary keyword.
- Public pages get unique meta **and** unique visible copy.
- Homepage extra block: keyword-rich but readable paragraph, NAP/location, USP, internal chips (Shop, About, Contact, FAQ, Safety, Delivery), share + copy canonical URL.
- Use real `<a>` / React Router `<Link>` — not click-only `div`s.
- Decorative images: `alt=""`, `aria-hidden`, `loading="lazy"`. Product images: descriptive `alt`.
- Decorative headings in cards can be `h3`; keep a clear H1 → H2 outline on home.

---

## 9. Images and speed (ranking signals)

Build pipeline:

```json
"build": "node scripts/generate-favicons.mjs && node scripts/optimize-page-images.mjs && node scripts/generate-sitemap.mjs && tsc -b && vite build"
```

- **Favicons** from the logo: 32, 192, 512 (apple-touch), plus `favicon.ico`. Bump `FAVICON_VERSION` when icons change.
- **WebP**: convert large PNG/JPG (skip tiny files, skip favicons/og-share). Serve `<picture>` with WebP + PNG/JPG fallback.
- **LCP:** preload the homepage hero WebP in `index.html` with `fetchpriority="high"`. Hero background `priority`; below-fold sections lazy.
- Long-cache hashed/static assets on the CDN (`max-age=31536000, immutable` for images/fonts/video).
- `preconnect` Google Fonts; `display=swap`.

---

## 10. Sitemap

Generate `public/sitemap.xml` on every production build.

Include:

- Static public routes with `changefreq` + `priority` (home `1.0` daily; about/contact `0.8` monthly; legal `0.5` yearly)
- Every **active product** `/products/{slug}` (`weekly`, `0.8`)

Slug source: live CMS/API first, local catalog fallback.

XML: escape `& < > " '`. `lastmod` as `YYYY-MM-DD`.

**Hosting (Vercel):** `sitemap.xml` is often served as HTML if it hits the SPA rewrite. Route `/sitemap.xml` → serverless handler that reads `public/sitemap.xml` and returns `application/xml`. Set `Content-Type` + `Cache-Control` in `vercel.json`. Link sitemap from `robots.txt` and `index.html`.

---

## 11. robots.txt

```
User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /login
Disallow: /register
Disallow: /auth/
Disallow: /cart
Disallow: /wishlist

Sitemap: https://www.example.com/sitemap.xml
```

Use the **canonical host** in the Sitemap line.

---

## 12. Domains and hosting

- Pick one host (`www` or apex). 301 everything else to it (`vercel.json` redirects).
- SPA fallback: filesystem first, then `/(.*) → /index.html`.
- Homepage header: `Link: <https://www.example.com/>; rel="canonical"`.
- `robots.txt`: `text/plain`, cache ~1 day.

---

## 13. PWA / social snippet assets

`site.webmanifest`: name, short_name, description, `start_url` `/`, `theme_color`, `background_color`, `lang`, icons 32 / 192 / 512.

OG image: branded, readable at small size, absolute URL in meta tags.

---

## 14. Per-page checklist (copy onto the next site)

- [ ] `SITE_URL`, `SITE_NAME`, NAP, social URLs, theme color in config
- [ ] `index.html` title, description, canonical, OG/Twitter, keywords/geo, sitemap link
- [ ] Static `<main>` fallback + remove on hydrate
- [ ] `HelmetProvider` + `<SEO />` on every route
- [ ] `<RouteSEO />` in layout for early canonical
- [ ] Home JSON-LD Organization + WebSite
- [ ] Product JSON-LD Product + Offer + Breadcrumb
- [ ] Unique H1 / title / description per public page
- [ ] Homepage keyword section + internal links
- [ ] `noIndex` on auth, cart, account, admin, search
- [ ] `robots.txt` Disallow those paths + Sitemap URL
- [ ] Sitemap: static pages + product slugs, generated in `npm run build`
- [ ] Favicons + manifest + OG image
- [ ] WebP + hero preload
- [ ] 301 old domains → canonical host
- [ ] Sitemap served as XML (not the SPA HTML)
- [ ] Google Search Console verification env var
- [ ] Submit sitemap in Search Console after launch

---

## 15. After launch

1. Search Console: verify property, submit `sitemap.xml`.
2. Rich Results Test: home Organization/WebSite, one product URL.
3. URL Inspection: homepage HTML should show the static H1 and meta, not an empty `#root`.
4. Confirm `https://example.com/sitemap.xml` is XML and lists products.
5. Confirm `https://example.com/robots.txt` points at that sitemap.
6. Share a URL on WhatsApp / Facebook and check the OG preview.

---

## 16. What to rewrite per client (do not copy blindly)

- Keywords in titles, H1, fallback HTML, and homepage SEO section
- Address block in Organization schema
- Currency (`INR`) and availability in Offer
- SearchAction `urlTemplate` (must match the real search/filter URL)
- Static sitemap paths
- Brand colors, logo, OG image
- External links (Maps, industry wiki, regulator)
- `og:locale` / `lang`

Prime Crackers-specific copy (wholesale Diwali fireworks, Sivakasi, 50% off, WhatsApp enquiry) belongs only on fireworks sites.
