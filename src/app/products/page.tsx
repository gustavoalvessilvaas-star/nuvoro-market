import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/store/search-form";
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
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-moss">Nuvoro Market</p>
          <h1 className="mt-2 text-4xl font-black">Smart Everyday Finds</h1>
          <p className="mt-3 max-w-2xl text-ink/70">Browse practical products for home, car, pet care, travel and desk setups.</p>
        </div>
        <SearchForm query={searchParams.q} category={category} />
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["All", ...categories].map((item) => (
          <a key={item} href={`/products?category=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={`shrink-0 rounded-md border px-4 py-2 text-sm font-semibold ${item === category ? "border-moss bg-moss text-white" : "border-line bg-white"}`}>
            {item}
          </a>
        ))}
      </div>
      {products.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-line bg-white p-10 text-center">No active products found.</div>
      )}
    </section>
  );
}
