# Vercel

## Deployment

Connect the GitHub repository `gustavoalvessilvaas-star/nuvoro-market` to a Vercel project and use the default Next.js settings.

## Environment Variables

Add all variables from `.env.example` in Vercel Project Settings > Environment Variables. At minimum for a working storefront:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Use test keys first. Redeploy after changing variables.

## Domain

After connecting a custom domain, update:

- `NEXT_PUBLIC_SITE_URL`
- Supabase Auth Site URL and redirect URLs
- Stripe webhook endpoint
- Meta/GA4 domain settings if used
