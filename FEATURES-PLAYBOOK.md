# Prime Crackers — Features Playbook

Use this document to rebuild the same product on another fireworks / catalogue / enquiry website.  
Pair it with **`SEO-PLAYBOOK.md`** for search-engine setup.

**Reference stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Supabase (PostgreSQL, Auth, Storage, RLS) · Vercel

**Reference site:** [https://www.primecracker.com](https://www.primecracker.com)

---

## 1. What this product is

A **catalogue + enquiry platform** — not a payment checkout.

| Has | Does not have |
| --- | --- |
| Product catalogue with categories, search, filters | Online payment gateway |
| Multi-item cart | Automatic order fulfilment |
| WhatsApp enquiry after form submit | Shopping cart synced to cloud |
| Admin panel for products & enquiries | Customer wishlist in database |
| Customer accounts (optional) | Service worker / offline mode |

**Core flow:** Browse → Add to cart → Fill details → Save enquiry in Supabase → Open WhatsApp with pre-filled message.

---

## 2. Tech stack to copy

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | Fast SPA, lazy routes |
| Styling | Tailwind CSS 4 | Utility-first, responsive |
| Routing | React Router 7 | Customer + admin routes |
| Meta / SEO | `react-helmet-async` | Per-page title, OG, JSON-LD |
| Backend | Supabase | Auth, DB, storage, RLS |
| PDF (admin) | jsPDF + jspdf-autotable | Enquiry PDF download |
| Images | sharp (build) + browser WebP | Smaller assets |
| Hosting | Vercel | SPA + `vercel.json` redirects |

**Key dependencies:** `@supabase/supabase-js`, `react-router-dom`, `react-helmet-async`, `lucide-react`, `jspdf`, `xlsx` (catalog import)

---

## 3. Project structure to replicate

```
src/
├── App.tsx                    # All routes
├── main.tsx                   # Entry + static SEO fallback removal
├── layouts/
│   ├── PrimeLayout.tsx        # Customer shell (header, footer, cart bar)
│   └── AdminLayout.tsx        # Admin shell + auth guard
├── pages/
│   ├── customer/              # Public + account pages
│   └── admin/                 # Admin CRUD pages
├── components/
│   ├── prime/                 # Branded homepage / catalogue UI
│   ├── customer/              # Shared customer components
│   ├── admin/                 # Admin forms, dialogs
│   └── shared/                # SEO, JsonLd, ScrollToTop
├── contexts/                  # Auth, Cart, Wishlist, Settings, Toast, Shop
├── services/                  # Supabase data layer
├── lib/                       # Business logic, WhatsApp, PDF, SEO helpers
└── types/database.ts          # TypeScript types for DB rows

supabase/migrations/           # SQL schema (run in order)
scripts/                       # Build: favicons, sitemap, images, catalog import
public/                        # Static assets, robots.txt, manifest
api/sitemap.xml.js             # Vercel sitemap handler
data/catalog.json              # Offline catalog fallback
index.html                     # Crawler-visible SEO fallback
vercel.json                    # Redirects, SPA fallback, cache headers
```

---

## 4. Customer website — pages & routes

**Router:** `src/App.tsx` · **Layout:** `src/layouts/PrimeLayout.tsx`

| Route | Page file | Purpose |
| --- | --- | --- |
| `/` | `HomePage.tsx` | Hero video, service bar, categories, shop catalogue (`#shop`), SEO section |
| `/about` | `AboutPage.tsx` | Brand story, stats, how-it-works, policies, WhatsApp CTA |
| `/contact` | `ContactPage.tsx` | Contact cards, map embed, enquiry form, WhatsApp CTA |
| `/cart` | `CartPage.tsx` | Cart review, delivery form, spin wheel, referral, WhatsApp submit |
| `/wishlist` | `PrimeLikesPage.tsx` | Saved favourites (localStorage) |
| `/products/:slug` | `PrimeProductDetailPage.tsx` | Product detail, qty, add to cart, related products |
| `/login` | `LoginPage.tsx` | Sign in, resend confirmation |
| `/register` | `RegisterPage.tsx` | Sign up (name, phone, email, password) |
| `/forgot-password` | `ForgotPasswordPage.tsx` | Request reset email |
| `/reset-password` | `ResetPasswordPage.tsx` | Set new password |
| `/auth/confirm` | `AuthConfirmPage.tsx` | Email confirmation handler |
| `/account/*` | `AccountPage.tsx` | Protected account area (see §6) |
| `/faq` | `FAQPage.tsx` | Accordion FAQ |
| `/delivery` | `DeliveryPage.tsx` | Delivery policy |
| `/why-no-online-payment` | `PaymentPolicyPage.tsx` | Payment / no-checkout policy |
| `/safety` | `SafetyPage.tsx` | Safety guide + Do's & Don'ts |
| `/privacy` | `PrivacyPolicyPage.tsx` | Privacy policy |
| `/terms` | `TermsPage.tsx` | Terms & conditions |

**Legacy redirects (catalogue lives on homepage):**

| Old route | Redirect |
| --- | --- |
| `/products` | `/#shop` |
| `/categories`, `/categories/:slug`, `/search`, `/gift-box` | `/` |

---

## 5. Homepage features

| Feature | File(s) |
| --- | --- |
| Hero video + poster (reduced-motion fallback) | `PrimeHero.tsx`, `PRIME_BRAND.heroVideo` in `primeBrand.ts` |
| Member offer card (logged-in users) | `HeroMemberOfferCard.tsx` |
| Service highlights bar (4 icons) | `PrimeServiceBar.tsx` |
| Category grid | `PrimeCategoryGrid.tsx` |
| Why choose bar | `PrimeWhyChooseBar.tsx` |
| Full shop catalogue (`#shop` anchor) | `PrimeShopCatalog.tsx`, `PrimeShopContext.tsx` |
| Category sticky tabs + filter drawer | `PrimeCategoryTab.tsx`, `PrimeFilterDrawer.tsx` |
| Table / card view toggle | `PrimeViewToggle.tsx`, `PrimeProductTable.tsx` |
| Search in header | `PrimeHeader.tsx`, `productSearch.ts` |
| Sort (name, price, newest) | `productSort.ts` |
| SEO content block (keywords, internal links, share) | `HomeSeoSection.tsx` |
| Lazy below-fold sections | `LazySection.tsx` |
| Sticky bottom cart bar | `PrimeCartBar.tsx` |

---

## 6. Customer authentication & account

**Core:** `src/contexts/AuthContext.tsx`  
**Redirects:** `src/lib/authRedirects.ts` (production uses `SITE_URL`, dev uses `localhost`)

| Flow | Details |
| --- | --- |
| Register | `signUpCustomer()` → Supabase email confirm → `/auth/confirm` |
| Login | `signInCustomer()` — admins blocked from customer area |
| Email confirm | `AuthConfirmPage.tsx` → sign out → `/login?verified=1` |
| Resend confirm | Login page button |
| Forgot password | Email → `/reset-password` |
| Admin login | Separate `/admin/login` + `is_admin()` RPC check |

**Account sub-routes** (`AccountPage.tsx`):

| Path | Page | Feature |
| --- | --- | --- |
| `/account` | `AccountDashboard.tsx` | Dashboard shortcuts |
| `/account/personal` | `PersonalInfoPage.tsx` | Name, phone, email |
| `/account/addresses` | `AddressesPage.tsx` | Saved addresses (**localStorage**) |
| `/account/enquiries` | `EnquiriesPage.tsx` | Enquiry history from Supabase |
| `/account/wishlist` | `AccountWishlistPage.tsx` | Wishlist in account UI |
| `/account/security` | `SecurityPage.tsx` | Change password |
| `/account/help` | `HelpSupportPage.tsx` | WhatsApp help |

**Protected routes:** `CustomerRoute.tsx` wraps `/account/*`

---

## 7. Cart & WhatsApp enquiry flow

**This is the main business feature.**

| Piece | File | Notes |
| --- | --- | --- |
| Cart state | `cartStore.ts`, `CartContext.tsx` | localStorage key `prime-enquiry-cart` |
| Cart page UI | `CartPage.tsx` | Full checkout-style form |
| WhatsApp message builder | `whatsapp.ts` | Formats cart items, address, referral, spin reward |
| Save enquiry | `enquiries.ts` | `submit_enquiry` RPC → fallback direct insert |
| Single-product enquiry | `EnquiryForm.tsx`, `WhatsAppEnquiryButton.tsx` | Contact page |
| Delivery address | `deliveryAddress.ts` | Door, street, landmark, pincode |
| GPS location | `geolocation.ts` | Browser GPS + reverse geocode |
| Gift box line items | `giftBox.ts` | Expands gift-box products in cart |
| Admin PDF download | `cartEnquiryPdf.ts` | jsPDF branded PDF (**admin only**) |

**Cart form fields:**
- Name, phone (prefilled if logged in)
- Structured delivery address + “Use current location”
- Optional message
- Referral code (validated against admin list)
- Spin-to-win reward (logged-in customers only)

**Submit sequence:**
1. Validate form
2. `createCartEnquiry()` → save to `enquiries` table
3. Show success toast
4. Open `wa.me` with formatted message

**Enquiry types in DB:** `cart`, `contact`, `account`, `order` (multi-item cart)

---

## 8. Product catalogue

| Feature | File(s) |
| --- | --- |
| Fetch products / categories | `services/products.ts`, `services/categories.ts` |
| Product detail | `PrimeProductDetailPage.tsx` |
| Product cards | `PrimeProductCard.tsx`, `ProductCard.tsx` |
| Pricing (original, discount %, selling) | `pricing.ts` |
| Brand badge | `brand.ts`, `ProductBrandBadge.tsx` |
| Highlight badges (featured, best seller) | `ProductHighlightBadges.tsx` |
| Pieces per pack | `ProductPiecesBadge.tsx` |
| Stock display | `stock.ts`, `StockAlertContext.tsx` |
| Image URLs + WebP | `utils.ts` `getImageUrl()`, `optimizedAssets.ts` |
| Product link prefetch | `productLink.ts` |
| Catalog import from XLSX | `scripts/generate-aura-catalog-from-xlsx.mjs`, `import-catalog.mjs` |

**Product DB fields:** name, slug, category_id, description, specifications (JSONB), price, original_price, discount_percentage, pieces, brand, tag, image_url, gallery_urls, video_url, youtube_url, stock_quantity, stock_alert_limit, is_available, is_featured, is_recommended, is_best_seller, sort_order, is_archived

---

## 9. Wishlist / Likes

| Piece | File | Storage |
| --- | --- | --- |
| Wishlist store | `wishlistStore.ts` | localStorage |
| Context | `WishlistContext.tsx` | React state |
| Button on products | `WishlistButton.tsx` | Heart toggle |
| Likes page | `PrimeLikesPage.tsx` | `/wishlist` route |

Not synced to Supabase — per-device only.

---

## 10. Referral codes & Spin to Win

### Referral codes
- Admin sets list in **Settings → referral codes** (newline-separated)
- Validation: `referralCode.ts`
- Cart UI: optional field on `CartPage.tsx`
- DB column: `enquiries.referral_code` (migration `024_referral_code.sql`)
- Included in WhatsApp message when provided

### Spin to Win
- Component: `SpinToWinWheel.tsx`
- Logic: `spinToWin.ts` — reward segments based on cart total
- **Cart page only**, logged-in customers
- Reward appended to WhatsApp message
- One spin per cart session

### Gift box (dormant)
- Builder: `GiftBoxPage.tsx` exists in repo
- Route `/gift-box` redirects to `/` — feature not live
- Helpers in `giftBox.ts` still used if gift-box items are in cart

---

## 11. Admin panel

**Layout:** `AdminLayout.tsx` · **Guard:** `is_admin()` Supabase RPC

| Route | Page | Features |
| --- | --- | --- |
| `/admin/login` | `AdminLoginPage.tsx` | Admin login |
| `/admin` | `AdminDashboardPage.tsx` | Stats, recent enquiries, low-stock alerts |
| `/admin/products` | `AdminProductsPage.tsx` | List, search, reorder, archive, delete, export Excel, clear catalog |
| `/admin/products/new` | `AdminProductFormPage.tsx` | Create product |
| `/admin/products/:id/edit` | `AdminProductFormPage.tsx` | Edit product |
| `/admin/categories` | `AdminCategoriesPage.tsx` | Category CRUD, archive |
| `/admin/enquiries` | `AdminEnquiriesPage.tsx` | Contact / single-product enquiries |
| `/admin/orders` | `AdminEnquiriesPage.tsx` (order mode) | Multi-item cart enquiries |
| `/admin/customers` | `AdminCustomersPage.tsx` | Customer list from enquiry data |
| `/admin/settings` | `AdminSettingsPage.tsx` | Business info form |

**Admin enquiry inbox:**
- Filter by status: new, contacted, completed, cancelled
- Reply on WhatsApp (pre-filled message)
- Download enquiry PDF
- Mark admin replied + timestamp
- Delete enquiry
- Stock adjustment on status change
- Show referral code

**Admin components:** `ProductForm.tsx`, `CategoryForm.tsx`, `ImageUploader.tsx`, `VideoUploader.tsx`, `RecordSaleDialog.tsx`, `StockAlertModal.tsx`, `SettingsForm.tsx`

---

## 12. Configurable business settings

**DB table:** `website_settings` (single row)  
**Service:** `services/settings.ts` · **Admin:** `SettingsForm.tsx`

| Field | Editable in admin |
| --- | --- |
| Business name | Yes |
| Tagline | Yes |
| Logo | Yes (upload to storage) |
| Phone | Yes |
| WhatsApp number | Yes (required) |
| Email | Yes |
| Address | Yes |
| About text | Yes |
| Facebook / Instagram / YouTube | Yes |
| Referral codes list | Yes |
| Business hours | Yes |
| Policy stats (delivery areas, happy customers, etc.) | Yes (JSON in social_links.policies) |

**Hardcoded fallbacks:** `lib/businessInfo.ts` (default WhatsApp numbers, address, policies)

**Site constants (code):** `lib/siteConfig.ts` — `SITE_URL`, `SITE_NAME`, favicon paths, OG image, sitemap routes

**Brand tokens:** `lib/primeBrand.ts` — colors, hero assets, trust badges, service highlights

---

## 13. SEO (summary — see SEO-PLAYBOOK.md)

| Layer | File |
| --- | --- |
| Static HTML fallback in `index.html` | Crawler-readable H1/H2 before JS |
| Per-page `<SEO />` component | `components/shared/SEO.tsx` |
| JSON-LD | `structuredData.ts`, `JsonLd.tsx` |
| Sitemap generator | `scripts/generate-sitemap.mjs` |
| robots.txt | `public/robots.txt` |
| Canonical + OG + Twitter | `SEO.tsx`, `RouteSEO.tsx` |
| noIndex on private pages | cart, login, account, wishlist |

---

## 14. UI / UX features to copy

| Feature | File |
| --- | --- |
| Scroll reveal animations | `ScrollRevealInit.tsx`, `[data-reveal]` in CSS |
| Fade-up animations | `AnimateIn.tsx` |
| Important notice modal (first visit) | `ImportantNoticeModal.tsx` |
| Floating social buttons (IG, FB, YouTube) | `FloatingActionButtons.tsx` |
| Toast notifications | `ToastContext.tsx`, `Toast.tsx` |
| Festive page backgrounds | `FestivePageBackground.tsx` |
| Optimized WebP backgrounds | `OptimizedBackground.tsx` |
| Wave dividers | `WaveDivider.tsx` |
| Scroll to top on route change | `ScrollToTop.tsx` |
| Legal page template | `LegalDocumentLayout.tsx` |
| Safety Do's & Don'ts | `DosAndDontsSection.tsx` |
| Loading / empty states | `LoadingState.tsx`, `EmptyState.tsx` |

**Chatbot:** `Chatbot.tsx` + `chatbotApi.ts` exist but are **not mounted** in layout. Groq/FastAPI backend is optional.

---

## 15. Supabase backend

### Tables

| Table | Purpose |
| --- | --- |
| `categories` | Product categories |
| `products` | Catalogue |
| `customers` | Leads + auth-linked profiles |
| `enquiries` | All enquiry types + items JSONB |
| `admin_users` | Maps auth user UUID → admin role |
| `website_settings` | Single-row business config |
| `product_ratings` | Ratings table (**no UI yet**) |

### RPCs

| Function | Purpose |
| --- | --- |
| `is_admin()` | Check if current user is admin |
| `submit_enquiry(...)` | Safe enquiry insert with auth binding |
| `upsert_customer_lead(...)` | Contact form customer upsert |

### Storage buckets (public)

| Bucket | Purpose |
| --- | --- |
| `product-images` | Product photos |
| `category-images` | Category images |
| `logos` | Site logo |
| `product-videos` | Product demo videos |

### RLS pattern
- **Public read:** active categories, available products, settings
- **Public insert:** enquiries (via RPC), customer leads
- **Authenticated:** own enquiries, own customer row
- **Admin:** full CRUD on everything

### Migrations
Run all files in `supabase/migrations/` in numeric order.  
Runner: `npm run db:migrate` (needs `SUPABASE_DB_PASSWORD`).

Key migrations:
- `001` — core schema
- `005` — cart items on enquiries
- `012` — customer auth linkage
- `014` — archive products/categories
- `016` — submit_enquiry RPC
- `017` — stock columns + order enquiry type
- `024` — referral_code
- `025` — Prime branding cleanup

---

## 16. Build scripts

| Script | Command | Purpose |
| --- | --- | --- |
| Dev server | `npm run dev` | Local development |
| Production build | `npm run build` | favicons → WebP → sitemap → tsc → vite build |
| Favicons + OG image | `npm run favicons` | Generate from logo |
| Image optimization | `npm run optimize-images` | PNG/JPG → WebP sidecars |
| Sitemap | `npm run sitemap` | `public/sitemap.xml` |
| Catalog import | `npm run import:catalog` | XLSX → Supabase |
| DB migrate | `npm run db:migrate` | Apply SQL migrations |
| Lint | `npm run lint` | oxlint |
| Preview build | `npm run preview` | Test production build locally |

---

## 17. Deployment

**Host:** Vercel (`vercel.json`)

```powershell
npm install
npm run build          # test locally first
git add .
git commit -m "Deploy"
git push origin main   # auto-deploy if Vercel connected to GitHub
```

**Or Vercel CLI:**
```powershell
npm install -g vercel
vercel login
vercel --prod
```

### Required environment variables (Vercel → Settings → Environment Variables)

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_SITE_URL` | `https://www.yoursite.com` — auth email redirects + SEO |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional GSC meta tag |

### Supabase auth URLs (after deploy)

| Setting | Value |
| --- | --- |
| Site URL | `https://www.yoursite.com` |
| Redirect URLs | `https://www.yoursite.com/**`, `/auth/confirm`, `/reset-password`, plus localhost for dev |

### Domain redirects (`vercel.json`)
- Redirect apex + alternate domains to canonical `www` host
- SPA fallback: all routes → `index.html`
- `/sitemap.xml` → `api/sitemap.xml.js`

---

## 18. Third-party integrations

| Service | Usage | File |
| --- | --- | --- |
| Supabase | DB, auth, storage | `lib/supabase.ts` |
| WhatsApp | `wa.me` deep links | `lib/whatsapp.ts` |
| Google Maps | Embed + directions | `lib/maps.ts` |
| Instagram / Facebook / YouTube | Footer + floating buttons | Settings `social_links` |
| BigDataCloud | Reverse geocode for cart GPS | `lib/geolocation.ts` |
| Google Fonts | Rubik, Playfair, Dancing Script | `index.html` |
| Groq (optional) | Chatbot LLM | External API, not required |

---

## 19. Branding checklist for a new site

Copy and replace in a new project:

| What | Where |
| --- | --- |
| Site name & URL | `src/lib/siteConfig.ts`, `scripts/seo-config.mjs` |
| Colors (teal, gold) | `src/lib/primeBrand.ts`, `src/index.css` `@theme` |
| Logo | `public/prime-logo.png` → regenerate favicons |
| Hero video + poster | `public/hero-fireworks.mp4`, `hero-fireworks-bg.webp` |
| OG share image | `scripts/generate-favicons.mjs` → `og-share.png` |
| Business phone, email, address | Admin settings + `businessInfo.ts` defaults |
| WhatsApp numbers | `businessInfo.ts` + admin settings |
| Social profiles | Admin settings + `BRAND_SOCIAL_PROFILES` in siteConfig |
| Legal page copy | `lib/legalContent.ts`, `paymentPolicyContent.ts` |
| FAQ questions | `FAQPage.tsx` inline array |
| Email templates | `supabase/email-templates/confirm-signup.html` |
| SMTP sender | Supabase Dashboard (see `company-smtp-setup.sql`) |

---

## 20. Replication order (recommended)

Use this sequence when building the same product on a new site:

### Phase 1 — Foundation
- [ ] Vite + React + TypeScript + Tailwind scaffold
- [ ] Supabase project + run migrations `001`–`016` minimum
- [ ] `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] `siteConfig.ts` with new brand name and URL
- [ ] `PrimeLayout` with header + footer
- [ ] `SettingsContext` + `website_settings` row

### Phase 2 — Catalogue
- [ ] Categories + products services
- [ ] Admin: categories CRUD, products CRUD, image upload
- [ ] Homepage shop section (`PrimeShopCatalog`)
- [ ] Product detail page
- [ ] Search, filter, sort

### Phase 3 — Enquiry flow
- [ ] Cart store (localStorage)
- [ ] Cart page + delivery form
- [ ] `submit_enquiry` RPC wired
- [ ] WhatsApp message builder
- [ ] Admin enquiries inbox

### Phase 4 — Auth & account
- [ ] Register / login / email confirm / password reset
- [ ] `authRedirects.ts` with production `SITE_URL`
- [ ] Account pages (profile, enquiries, security)
- [ ] Customer route guard

### Phase 5 — Polish
- [ ] Wishlist (localStorage)
- [ ] Spin to win + referral codes
- [ ] About, Contact, FAQ, legal pages
- [ ] Important notice modal
- [ ] Floating social buttons
- [ ] Admin PDF download, stock alerts, Excel export

### Phase 6 — SEO & deploy
- [ ] Follow `SEO-PLAYBOOK.md`
- [ ] `npm run build` pipeline (favicons, sitemap, WebP)
- [ ] Vercel deploy + env vars
- [ ] Supabase auth URL config
- [ ] Google Search Console sitemap submit

---

## 21. Known caveats (read before cloning)

1. **Cart & wishlist are localStorage** — not synced across devices or to Supabase.
2. **Saved addresses are localStorage** — not in database.
3. **Gift box route is disabled** — code exists, `/gift-box` redirects home.
4. **Chatbot is not wired** — component exists but not shown in layout.
5. **Product ratings table exists** — no customer UI yet.
6. **PDF download is admin-only** — customers do not get PDFs from cart.
7. **Catalogue is on homepage** — `/products` redirects to `/#shop`, not a separate page.
8. **Legacy pages in repo** — `ProductsPage.tsx`, `CategoriesPage.tsx`, etc. are not routed.

---

## 22. Quick file index

| Feature | Start here |
| --- | --- |
| Routes | `src/App.tsx` |
| Customer layout | `src/layouts/PrimeLayout.tsx` |
| Admin layout | `src/layouts/AdminLayout.tsx` |
| Auth | `src/contexts/AuthContext.tsx` |
| Cart | `src/contexts/CartContext.tsx`, `src/pages/customer/CartPage.tsx` |
| WhatsApp | `src/lib/whatsapp.ts` |
| Enquiries | `src/services/enquiries.ts` |
| Products | `src/services/products.ts` |
| Settings | `src/services/settings.ts` |
| SEO | `src/components/shared/SEO.tsx`, `SEO-PLAYBOOK.md` |
| Brand | `src/lib/primeBrand.ts`, `src/lib/siteConfig.ts` |
| DB schema | `supabase/migrations/001_initial_schema.sql` |
| Deploy | `vercel.json`, `.env.example` |

---

*Generated from Prime Crackers codebase. Update this file when you add or remove major features.*
