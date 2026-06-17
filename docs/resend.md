# Resend

Resend is the default transactional email adapter.

Required variables:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `SUPPORT_EMAIL`

Templates exist for order confirmation, payment approved, shipped, delivered and support notifications in `src/lib/email.ts`. If `RESEND_API_KEY` is missing, messages are logged in development.
