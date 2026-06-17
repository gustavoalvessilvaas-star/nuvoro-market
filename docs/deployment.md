# Vercel Deployment

1. Push the repository to GitHub.
2. Create a new Vercel project.
3. Set Framework Preset to Next.js.
4. Add all variables from `.env.example`.
5. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
6. Deploy.
7. Add the production Stripe webhook endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`.
8. Connect the domain after DNS access is available.

Recommended domain: `nuvoromarket.com` if available. If unavailable, research close alternatives such as `shopnuvoro.com` or `nuvoromarketshop.com`; do not hardcode them before purchase.
