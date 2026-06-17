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

## Flow

1. Customer adds products to cart.
2. Checkout form sends cart and shipping data to `/api/checkout/stripe`.
3. Server creates a pending order and Stripe Checkout Session.
4. Stripe redirects to Checkout.
5. Webhook receives `checkout.session.completed`.
6. Order is marked paid, Purchase event is logged and confirmation email is sent.
