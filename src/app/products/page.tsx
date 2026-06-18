import { ProductCard } from "@/components/product-card";
import { ProductListTracker } from "@/components/store/product-list-tracker";
import { SearchForm } from "@/components/store/search-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/lib/constants";
import { getStoreProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export const metadata = { title: "Shop Products" };

function discountAmount(product: Product) {
  return product.compare_at_price ? product.compare_at_price - product.price : 0;
}

function sortProducts(products: Product[], sort: string) {
  const sorted = [...products];
  if (sort === "price-asc") return sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return sorted.sort((a, b) => b.price - a.price);
  if (sort === "biggest-discount") return sorted.sort((a, b) => discountAmount(b) - discountAmount(a));
  if (sort === "newest") return sorted.sort((a, b) => Date.parse(b.created_at || "") - Date.parse(a.created_at || ""));
  if (sort === "best-sellers") return sorted.sort((a, b) => Number(b.slug === "pawtrim-led-grinder") - Number(a.slug === "pawtrim-led-grinder"));
  return sorted;
}

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; q?: string; sort?: string } }) {
  const category = searchParams.category || "All";
  const searchQuery = searchParams.q || "";
  const query = searchQuery.toLowerCase();
  const sort = searchParams.sort || "featured";
  const filteredProducts = (await getStoreProducts()).filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchableText = [product.name, product.short_description, product.category].join(" ").toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    return matchesCategory && matchesQuery;
  });
  const products = sortProducts(filteredProducts, sort);

  return (
    <section className="container-page py-10">
      <ProductListTracker productIds={products.map((product) => product.id)} category={category} query={searchQuery} sort={sort} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Nuvoro Market" title="Smart Everyday Finds">
          <p>Browse practical products for home, car, pet care, travel and desk setups.</p>
        </SectionHeading>
        <SearchForm query={searchParams.q} category={category} sort={sort} />
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["All", ...categories].map((item) => (
          <a key={item} href={`/products?category=${encodeURIComponent(item)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${item === category ? "border-moss bg-moss text-white shadow-sm" : "border-line bg-white text-ink/70 hover:border-moss hover:text-moss"}`}>
            {item}
          </a>
        ))}
      </div>
      {products.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="card-surface mt-8 p-10 text-center">
          <p className="text-lg font-black">No active products found.</p>
          <p className="mt-2 text-sm text-ink/60">Try a different category or search term.</p>
          <a href="/products" className="btn-primary mt-5">Reset Filters</a>
        </div>
      )}
    </section>
  );
}
