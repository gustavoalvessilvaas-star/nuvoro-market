# Brand Assets

The storefront now uses the provided Nuvoro logo as the primary brand asset.

## Upload Paths

Place approved assets in `public/brand/`:

- `public/brand/nuvoro-logo.svg`
- `public/brand/nuvoro-logo.png`
- `public/brand/nuvoro-icon.png`
- `public/brand/nuvoro-og.png`
- `public/nuvoro-logo.png` is the currently used public logo path.
- `public/nuvoro-icon.png` is the currently used favicon/app icon path.
- `public/nuvoro-og.png` is the currently used Open Graph image path.

## Current Fallback

The app loads `public/nuvoro-logo.png` first, then falls back to `public/brand/nuvoro-logo.png`, SVG or a text wordmark if the image is missing.

## Before Launch

Use only original, licensed or approved brand files. After adding the logo, redeploy Vercel and test desktop header, mobile header, footer and social preview.
