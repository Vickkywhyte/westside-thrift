@AGENTS.md

# Westside — Project Guide

Curated vintage menswear e-commerce. Based in Jericho, Ibadan, Nigeria.
Live: https://archive-coast.netlify.app | Supabase project: wluauqcvwpkuxqtpuxib

---

## Stack

| Layer | Detail |
|-------|--------|
| Framework | Next.js 16.2.6 (App Router) |
| Styling | Tailwind CSS v4 — tokens live in `app/globals.css` via `@theme {}`, no `tailwind.config.ts` |
| Database / Auth / Storage | Supabase (`@supabase/ssr`) |
| Payments | Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`) |
| Deploy | Netlify (site ID: `ce8dfa7f-53da-4ea7-bf38-bde0e3a132ed`) |

---

## Critical quirks — read before touching anything

### Node v26 breaks Next.js
`npx next` and `./node_modules/.bin/next` both fail on Node v26 with `Cannot find module '../server/require-hook'`. All scripts in `package.json` use the full path workaround:
```
node node_modules/next/dist/bin/next dev|build|start
```
Never change these back to `next`.

### Next.js 16 uses `proxy.ts`, not `middleware.ts`
The file is `proxy.ts` at the repo root. The export is named `proxy`, not `middleware`. Using the old name causes a build error.

### Tailwind v4 — no config file
All design tokens are in `app/globals.css` inside `@theme {}`. Do not create a `tailwind.config.ts`. CSS custom properties follow the pattern `--color-*`, `--font-*`, `--spacing-*`.

### Supabase client types
Both `lib/supabase/client.ts` and `lib/supabase/server.ts` omit the `Database` generic on purpose — adding it causes `Property 'x' does not exist on type 'never'` errors throughout. Manual types are in `lib/supabase/types.ts`.

### `searchParams` in Next.js 16
Route props like `searchParams` and `params` are Promises — always `await` them:
```ts
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
}
```

---

## File layout

```
app/
  layout.tsx          root layout: NavBar, Footer, grain overlay, fonts
  page.tsx            homepage
  about/              Our Story editorial page
  shop/               catalog (server, filter via searchParams)
  shop/[slug]/        product detail
  cart/               cart (localStorage-driven client component)
  checkout/           Stripe CardElement + Supabase order creation
  auth/login|signup   Supabase Auth forms
  auth/callback       OAuth callback handler
  auth/signout        POST route that signs the user out
  account/            protected: profile + order history
  order-confirmation/ post-checkout success screen
  sell/               vintage sell submission form
  contact/            contact details + mailto form
  shipping/           shipping & returns policy
  privacy/            privacy policy

components/
  layout/NavBar.tsx   sticky nav, cart badge (localStorage), auth state
  layout/Footer.tsx   links, address, contact info
  layout/HeroSection.tsx  client component — mouse parallax hero image
  products/ProductCard.tsx
  products/ProductGallery.tsx
  products/CatalogFilters.tsx  client — updates URL searchParams
  cart/AddToCartButton.tsx     writes to localStorage, fires cart-updated event
  sell/SellForm.tsx            photo upload to Supabase Storage + DB insert

lib/
  supabase/client.ts  createBrowserClient() — use in Client Components
  supabase/server.ts  createServerClient() — use in Server Components (async)
  supabase/types.ts   manual TS types: Product, Profile, CartItem, Order, OrderItem, SellSubmission
```

---

## Supabase schema (6 tables)

| Table | Notes |
|-------|-------|
| `products` | `slug` unique, `images text[]`, `measurements jsonb`, `in_stock bool` |
| `profiles` | extends `auth.users` (trigger auto-creates on signup) |
| `cart_items` | per-user DB cart (guests use localStorage) |
| `orders` | `shipping_address jsonb`, `status` enum: pending/confirmed/shipped/delivered |
| `order_items` | `price_at_purchase` snapshot |
| `sell_submissions` | public insert, photos in Storage bucket `sell-photos` |

RLS is enabled on all tables. Products are public-read. Cart/orders are user-scoped.

---

## Cart strategy

- **Guest**: `localStorage` key `cart` — `Record<productId, quantity>`
- **Logged in**: same localStorage (merge on login is not yet implemented)
- Cart count in NavBar listens for the custom `cart-updated` DOM event
- `AddToCartButton` dispatches that event after every write

---

## Business details

- **Brand**: Westside (all-caps "WESTSIDE" in the nav logo)
- **Address**: Adepate Abebi Crescent, Idishin, Jericho, Ibadan, Oyo State, Nigeria
- **Email**: hello@westside.com
- **Phone**: +234 916 719 4813
- **Currency**: Nigerian Naira (₦) — prices stored as `numeric(10,2)` in Supabase

---

## Design system (summary)

Fonts loaded via `next/font/google` in `app/layout.tsx`:
- `--font-newsreader` → `font-display` / `font-headline`
- `--font-work-sans` → `font-body` / `font-label`
- `--font-space-mono` → `font-technical`

Key color tokens:
- `--color-primary`: `#9c3c24` (rust)
- `--color-secondary`: `#7c5800` (amber)
- `--color-surface`: `#fef9f1` (warm cream)

Material Symbols loaded via Google Fonts CDN in `app/layout.tsx`. Use `<span className="material-symbols-outlined">icon_name</span>`.

Film grain overlay: fixed `div.grain-overlay` at `z-[60]`, pointer-events none.

---

## Stripe

Publishable key is in `app/checkout/page.tsx` — test key `pk_test_51TZBFM...`.

### Full payment flow
1. Client: `loadStripe(pk)` → `<Elements>` + `<CardElement>`
2. On submit: POST `/api/create-payment-intent` with `{ amount: subtotal }` → returns `{ clientSecret, paymentIntentId }`
3. Client: `stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } })` — this actually charges the card
4. On success: insert order to Supabase with `stripe_payment_intent_id` stored
5. Redirect to `/order-confirmation?order=<id>`
6. Stripe fires `payment_intent.succeeded` → webhook updates `orders.status` to `"completed"`

### API routes
- `app/api/create-payment-intent/route.ts` — creates PaymentIntent server-side (needs `STRIPE_SECRET_KEY`)
- `app/api/webhooks/stripe/route.ts` — verifies signature, handles `payment_intent.succeeded`, updates order status via service-role Supabase client

### Required env vars (all must be set in Netlify)
| Var | Where to get it |
|-----|----------------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → signing secret (`whsec_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role key |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |

---

## Order notification emails (Resend)

When a customer completes checkout, the client fires a fire-and-forget POST to `/api/notify-order`. This never blocks the checkout redirect — errors are swallowed silently.

### API route
`app/api/notify-order/route.ts` — receives `{ orderId, items, total, address, customerEmail }`, sends a branded HTML email via Resend.

### Email details
- **From**: `orders@westside.com` (must be a verified domain in Resend)
- **To**: `victorthesis80@gmail.com`
- **Subject**: `New Order #XXXXXXXX — ₦xx,xxx`
- Email includes: order ID, itemised list, total, shipping address, customer email, link to Supabase dashboard

### Required env var
`RESEND_API_KEY` — set in Netlify. The sender domain (`westside.com`) must be verified in Resend's dashboard. If using an unverified domain, change `from` to `onboarding@resend.dev` temporarily.

### Registering the webhook in Stripe
1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Add endpoint: `https://archive-coast.netlify.app/api/webhooks/stripe`
3. Select event: `payment_intent.succeeded`
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Netlify env vars
5. Update `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` with real values (currently placeholder strings)

### Database
`orders` table has a `stripe_payment_intent_id text` column (added May 2026) with an index for fast webhook lookups. Webhook uses the Supabase service-role key to bypass RLS when updating orders.

---

## Known environment issues & fixes applied

### Netlify env vars pointed to wrong Supabase project (fixed May 2026)
The Netlify site had `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` pointing to an old project (`sehexlmcbqfmhhtwqfzw`) instead of the live one (`wluauqcvwpkuxqtpuxib`). This caused "something went wrong loading products" on the live site while local dev worked fine. Fixed by deleting and re-setting both vars in Netlify's environment variable settings via the MCP. **If products ever disappear on the live site, check Netlify env vars first.**

### Product images were expired Google AI URLs (fixed May 2026)
Original seed images used `lh3.googleusercontent.com/aida` URLs which expired. All 12 products now use `images.unsplash.com` URLs with real Unsplash photo IDs. Images are stored as `text[]` in the `products.images` column.

### Email confirmation link went to localhost (fixed May 2026)
Supabase sends email confirmation links using its configured Site URL, which was still `localhost:3000` from development. The fix is two-part:
1. **Code** (`app/auth/signup/page.tsx`): Pass `emailRedirectTo: window.location.origin + '/auth/callback'` in the `signUp()` call. This overrides the site URL per-request.
2. **Supabase dashboard (manual)**: Go to [Authentication → URL Configuration](https://supabase.com/dashboard/project/wluauqcvwpkuxqtpuxib/auth/url-configuration), set **Site URL** to `https://archive-coast.netlify.app`, and add `https://archive-coast.netlify.app/**` to **Redirect URLs**. Supabase validates `emailRedirectTo` against this allowlist — without it, the code fix is ignored and links fall back to the site URL.

---

## Deploying

```bash
# build locally first to catch errors
npm run build

# deploy via Netlify MCP (site ID above) or:
npx -y @netlify/mcp@latest --site-id ce8dfa7f-53da-4ea7-bf38-bde0e3a132ed
```

Netlify reads `NODE_VERSION = "20"` from `netlify.toml` — do not change this; Node 26 breaks the build.
