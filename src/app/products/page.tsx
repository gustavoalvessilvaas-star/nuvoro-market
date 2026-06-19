import { ProductCard } from "@/components/product-card";
import { ProductListTracker } from "@/components/store/product-list-tracker";
import { SearchForm } from "@/components/store/search-form";
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
    <>
      <ProductListTracker productIds={products.map((product) => product.id)} category={category} query={searchQuery} sort={sort} />
      <section className="dark-section">
        <div className="container-page py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Nuvoro Market</p>
            <h1 className="mt-3 text-4xl font-black text-white">Smart Everyday Finds</h1>
            <p className="mt-3 text-white/70">Browse practical products for home, car, pet care, travel and desk setups.</p>
          </div>
        </div>
      </section>
      <section className="container-page -mt-8 py-10">
        <div className="card-surface p-4 sm:p-5">
          <SearchForm query={searchParams.q} category={category} sort={sort} />
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {["All", ...categories].map((item) => (
              <a key={item} href={`/products?category=${encodeURIComponent(item)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${item === category ? "border-night bg-night text-white shadow-sm" : "border-line bg-white text-ink/70 hover:border-aqua hover:text-moss"}`}>
                {item}
              </a>
            ))}
          </div>
        </div>
        {products.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </>
  );
}
