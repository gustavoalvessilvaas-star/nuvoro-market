import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/products", "/cart", "/checkout", "/order-tracking", "/contact", "/about", "/login", "/register", "/journal"];
  const productPaths = getActiveProducts().map((product) => `/products/${product.slug}`);
  const journalPaths = ["/journal/pet-grooming-at-home", "/journal/smart-home-organization-finds", "/journal/car-essentials-for-daily-driving"];

  return [...staticPaths, ...productPaths, ...journalPaths].map((path) => ({
    url: siteUrl(path),
    lastModified: new Date()
  }));
}
