import type { Product } from "@/lib/types";

function normalizeGallery(value: Product["gallery_image_urls"]) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function getProductImages(product: Product) {
  const images = [
    product.main_image_url,
    ...normalizeGallery(product.gallery_image_urls),
    product.lifestyle_image_url,
    product.gif_url,
    ...(product.images || [])
  ].filter(Boolean) as string[];

  return Array.from(new Set(images));
}

export function getPrimaryProductImage(product: Product) {
  return getProductImages(product)[0] || "/placeholders/pawtrim-led-grinder.svg";
}

export function getProductAlt(product: Product, context = "product image") {
  return product.alt_text || `${product.name} ${context}`;
}
