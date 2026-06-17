import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/store/search-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/lib/constants";
import { getStoreProducts } from "@/lib/products";

export const metadata = { title: "Shop Products" };

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; q?: string } }) {
  const category = searchParams.category || "All";
  const query = (searchParams.q || "").toLowerCase();
  const products = (await getStoreProducts()).filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesQuery = !query || product.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="container-page py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Nuvoro Market" title="Smart Everyday Finds">
          <p>Browse practical products for home, car, pet care, travel and desk setups.</p>
        </SectionHeading>
        <SearchForm query={searchParams.q} category={category} />
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["All", ...categories].map((item) => (
          <a key={item} href={`/products?category=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${item === category ? "border-moss bg-moss text-white shadow-sm" : "border-line bg-white text-ink/70 hover:border-moss hover:text-moss"}`}>
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
