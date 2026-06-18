# Product Media

Product images must be replaced before paid ads. Do not use copyrighted product images unless the supplier explicitly grants permission.

## Recommended Sizes

- Main product image: 1200 x 900 px
- Gallery images: 1200 x 900 px
- Lifestyle image: 1600 x 1000 px
- Demo video: 1080 x 1920 for TikTok/Reels, 1920 x 1080 for site embeds
- GIF/demo loop: under 8 MB when possible

## Product Fields

The Supabase schema supports:

- `main_image_url`
- `gallery_image_urls`
- `lifestyle_image_url`
- `demo_video_url`
- `gif_url`
- `alt_text`
- `media_status`: `placeholder`, `supplier-approved`, or `original-content`

## Replacement Workflow

1. Ask supplier for written permission to use product media.
2. Prefer ordering a sample and creating original photos/videos.
3. Upload images to Supabase Storage or a trusted image host.
4. Paste URLs into the product media fields.
5. Update `media_status`.
6. Verify product pages on mobile and desktop.

Placeholder images are intentionally branded, but the store is not ready for paid ads until real or supplier-approved media is in place.
