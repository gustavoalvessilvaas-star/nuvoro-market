# Setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Create `.env.local` from `.env.example`.
4. Configure Supabase first because products, orders, tracking and admin views depend on it.
5. Configure Stripe test keys and webhook secret.
6. Run `supabase/schema.sql`, `supabase/seed.sql`, and any newer files in `supabase/migrations/`.
7. Upload final brand assets to `public/brand/` before launch.
8. Run `npm run dev`.

The app falls back to seed products when Supabase is not configured, but checkout requires Stripe and production order storage requires Supabase.

Legal note: policy pages are starter templates for operational clarity, not legal advice. Have counsel review policies before launch.
