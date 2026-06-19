# Nuvoro Market

Nuvoro Market is a production-shaped Next.js MVP for a United States dropshipping validation store positioned around Smart Everyday Essentials.

## Stack

- Next.js App Router, React, TypeScript strict mode
- Tailwind CSS and custom accessible components
- Supabase/PostgreSQL, Supabase Auth and Supabase Storage
- Stripe Checkout and webhook
- PayPal placeholder structure
- Resend transactional email adapter
- GA4, Meta Pixel, internal event logging and Meta CAPI preparation

## Local Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add Supabase and Stripe test credentials.
5. Run Supabase SQL from `supabase/schema.sql`, then `supabase/seed.sql`.
6. Start the app with `npm run dev`.
7. Open `http://localhost:3000`.

If you want to use the portable Node runtime downloaded by Codex in this workspace, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-local.ps1
```

## Required Environment Variables

See `.env.example` for the full list:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_ENABLED=false`
- `RESEND_API_KEY`
- `SUPPORT_EMAIL`
- `FROM_EMAIL`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `META_CAPI_PIXEL_ID`
- `ADMIN_EMAIL`

`NEXT_PUBLIC_SUPABASE_URL` must be only the Supabase project base URL, like `https://PROJECT_REF.supabase.co`. Do not include `/auth/v1`, `/rest/v1`, or any other path.

## Manual Launch Checklist

- Read `docs/access-and-integrations.md` for the exact app/tool access observed in this Codex environment.
- Read `docs/github-publish.md` to push the local commit to the GitHub repository once it is connected.
- Read `docs/customer-auth.md` to configure Supabase Auth redirects and customer account behavior.
- Read `docs/brand-assets.md`, `docs/product-media.md`, `docs/manual-fulfillment.md`, `docs/admin-guide.md`, `docs/qa-checklist.md` and `docs/pre-launch-checklist.md` before launch.
- Create a Supabase project, run schema and seed SQL, create an admin auth user, then insert that auth user ID into `admin_users`.
- Run the latest idempotent migrations, including `supabase/migrations/2026-06-19_admin_ops_fields.sql`.
- Create Stripe products or use dynamic Checkout line items as implemented, configure webhook `/api/webhooks/stripe`, and test with Stripe CLI.
- Upload the final logo files to `public/brand/`.
- Verify product suppliers, shipping times, returns, product compliance and replace branded temporary product visuals.
- Configure Resend domain authentication and sender email.
- Add GA4 and Meta Pixel IDs only after accounts are ready.
- Connect a Vercel project and set all production environment variables.
- Replace policy templates with legally reviewed versions before launch.

## Notes

External credentials are intentionally optional. Missing optional keys skip their integrations or return clear setup errors so the storefront does not crash.

The storefront is visually stronger and functionally prepared, but it is not ready for paid ads until final product media, logo/favicon, supplier sample testing, Stripe webhook testing and legal policy review are complete.
