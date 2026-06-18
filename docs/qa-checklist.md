# QA Checklist

- Product page -> Add to Cart -> mini-cart opens.
- Product page -> Buy Now -> checkout contains product.
- Product listing -> Quick Add -> mini-cart opens.
- Cart quantity update works.
- Cart removal works.
- Refresh page and cart persists.
- Empty checkout state shows useful CTA.
- Checkout accepts phone as optional.
- Missing Stripe key shows safe setup error.
- Stripe test checkout creates session.
- Stripe webhook marks order paid.
- Order tracking returns only matching order ID and email.
- Contact form validates, submits and logs fallback safely.
- Customer register/login/account works with Supabase Auth.
- Admin login remains separate.
- Mobile nav opens and closes.
- No public page exposes secret keys.
