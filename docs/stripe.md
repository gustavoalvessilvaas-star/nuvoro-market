# Stripe

## Environment

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Local Webhook

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Vercel Webhook

Create a Stripe webhook endpoint:

```txt
https://YOUR_DOMAIN/api/webhooks/stripe
```

Subscribe to:

- `checkout.session.completed`

Copy the signing secret that starts with `whsec_` into `STRIPE_WEBHOOK_SECRET`.

## Test Card

Use Stripe test mode:

```txt
4242 4242 4242 4242
Future date: 12/34
CVC: 123
ZIP: 10001
```

## Flow

1. Customer adds products to cart.
2. Checkout form sends cart and shipping data to `/api/checkout/stripe`.
3. Server creates a pending order and Stripe Checkout Session.
4. Stripe redirects to Checkout.
5. Webhook receives `checkout.session.completed`.
6. Order is marked paid, Purchase event is logged and confirmation email is sent.

Do not use live keys until Supabase orders, Stripe webhook, confirmation email and the thank-you redirect are tested end to end.
