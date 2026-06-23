# Product Management

Use `/admin/products`.

## Create Product

1. Fill name, category and price.
2. Add product cost and shipping cost.
3. Add supplier URL and backup supplier URL.
4. Add main image or upload a product image.
5. Keep new products as `draft` until supplier and media are verified.

## Margin

The admin calculates:

```text
estimated_total_cost = cost_price + shipping_cost
estimated_margin_amount = price - estimated_total_cost
estimated_margin_percent = ((price - estimated_total_cost) / price) * 100
```

Margin quality:

- 0-39%: bad margin
- 40-54%: risky
- 55-69%: acceptable
- 70%+: strong

## Publish Safety

Before setting `active`, verify:

- product name
- category
- price
- supplier URL
- backup supplier URL
- image/media
- cost price
- margin above 55% when possible
- no risky claims in product copy

Inactive and draft products are hidden from the public listing by RLS and storefront product filters.
