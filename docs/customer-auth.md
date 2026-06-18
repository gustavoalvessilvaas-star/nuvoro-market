# Customer Auth

Nuvoro Market now includes a customer login experience powered by Supabase Auth.

## Routes

- `/login`
- `/register`
- `/forgot-password`
- `/account`

## Required Supabase Settings

Use the existing environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: must be the project base URL only, for example `https://PROJECT_REF.supabase.co`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key from Supabase Project Settings > API.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only service role key, used by API routes and never exposed to the browser.
- `NEXT_PUBLIC_SITE_URL`: local or production site origin, for example `http://localhost:3000` or `https://nuvoro-market.vercel.app`.

Do not use these invalid Supabase URL formats:

- `https://PROJECT_REF.supabase.co/auth/v1`
- `https://PROJECT_REF.supabase.co/rest/v1`
- `https://PROJECT_REF.supabase.co/anything-else`

If the URL contains a path, Supabase Auth can fail with errors such as `Invalid path specified in request URL`.

In Supabase Auth settings:

1. Enable Email/Password sign-ins.
2. Add the local URL to allowed redirect URLs:
   - `http://localhost:3000/account`
3. Add the production Vercel URL when deployed:
   - `https://YOUR-PRODUCTION-DOMAIN/account`
4. Configure email templates if you want branded confirmation and password reset emails.

For production on Vercel, set the same variables in Project Settings > Environment Variables and redeploy after changing them.

## Account Orders

The account page requests recent orders through `/api/account/orders`.

That API route:

1. Requires a Supabase access token from the logged-in user.
2. Validates the token with Supabase Auth.
3. Uses the service role key server-side to load recent orders where `customer_email` matches the authenticated user email.

Normal customers do not receive the service role key in the browser.

## Admin Separation

Customer login is separate from `/admin/login`. Admin access should continue to be limited to Supabase Auth users listed in the `admin_users` table before production launch.
