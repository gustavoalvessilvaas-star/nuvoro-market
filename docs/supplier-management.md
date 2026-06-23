# Supplier Management

Use `/admin/suppliers`.

## What To Save

- supplier name
- platform
- supplier URL
- backup supplier URL
- linked product
- product cost
- shipping cost
- delivery range
- warehouse location
- tracking availability and quality
- sample ordered, received and approved
- return, observation and compliance notes

## Recommendation Logic

The admin does not pick only the cheapest supplier. It favors:

- sample approved
- tracking available
- backup supplier exists
- reasonable delivery time
- 55%+ product margin

If tracking is poor, sample is missing, backup is missing, delivery is slow or compliance notes are risky, the supplier is marked risky or needs sample.

## Paid Ads Rule

Do not run paid ads for a product until at least one supplier has acceptable cost, tracking, backup supplier and sample confidence.
