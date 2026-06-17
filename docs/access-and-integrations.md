# Access And Integrations Report

This report records what was available in the Codex environment during project creation and what still needs manual setup.

## Connected And Usable

- GitHub connector: available for repository and content operations exposed by the Codex GitHub app.
- Local filesystem: available for creating and editing project files.
- Git: available locally.

## Not Directly Connected In This Session

- Supabase
- Stripe
- Vercel
- Resend
- Meta
- Google Analytics 4
- PayPal

These services are prepared in code with environment variables, fallback behavior and documentation, but their dashboards still need manual account setup and credentials.

## Local Runtime Notes

- `node` was not available on the PATH in this Codex session, so local install/build/dev-server verification could not be completed here.
- `gh` was not available on the PATH in this Codex session.
- The project can be run locally after installing Node.js 20 or newer.

## Manual Credentials Needed

- Supabase project URL, anon key and service role key.
- Stripe secret key, publishable key and webhook signing secret.
- Resend API key plus verified sender/domain.
- GA4 Measurement ID.
- Meta Pixel ID.
- Meta Conversions API access token and Pixel/Dataset ID.
- PayPal client ID and secret, only when PayPal is ready to enable.
- Vercel project environment variables.

## Repository Notes

Files can be created directly in the local project directory. To write directly to GitHub, use the GitHub repository `owner/name` and push this project as a branch or import these files into the connected repository.

## What Is Prepared

- Supabase SQL schema, RLS policies, storage bucket policy and seed data.
- Stripe Checkout API route and Stripe webhook route.
- Resend email adapter and transactional templates.
- GA4 and Meta Pixel script placeholders.
- Meta CAPI helper with missing-key fallback.
- PayPal placeholder variables and disabled checkout state.
- Vercel deployment documentation.
