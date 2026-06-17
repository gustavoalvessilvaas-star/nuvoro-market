import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { TrustBadges } from "@/components/store/trust-badges";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, siteConfig } from "@/lib/constants";
import { getStoreProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getStoreProducts();
  const featured = products[0];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page grid min-h-[76vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="eyebrow">Smart Everyday Essentials</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">{siteConfig.slogan}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-ink/70">{siteConfig.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary gap-2">Shop Smart Finds <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/products/${featured.slug}`} className="btn-secondary">View Featured Product</Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-ink/70 sm:grid-cols-3">
              {["No inflated claims", "Curated practical finds", "Secure Stripe checkout"].map((item) => (
                <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-moss" /> {item}</p>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-white/80 p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2 px-2 text-sm font-bold text-moss"><Sparkles className="h-4 w-4" /> Featured smart find</div>
            <ProductCard product={featured} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured" title="Best Sellers" />
          <Link href="/products" className="hidden text-sm font-bold text-moss sm:inline-flex">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="soft-section py-14">
        <div className="container-page">
          <SectionHeading title="Shop by Category" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="card-surface p-5 font-black hover:-translate-y-1 hover:border-moss hover:shadow-soft">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <TrustBadges />
      </section>

      <section className="bg-mint py-14">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-ink">Curated to feel useful, not random.</h2>
            <p className="mt-4 text-ink/75">Nuvoro Market focuses on practical finds with clear benefits, straightforward pricing and a clean support experience.</p>
          </div>
          <div className="grid gap-3">
            {["Products are selected around everyday use cases.", "Offers are written with practical benefits, not inflated claims.", "Manual fulfillment fields are built in for responsible supplier operations."].map((item) => (
              <p key={item} className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm">{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeading title="FAQ" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Where do you ship?", "Nuvoro Market is built for United States customers at launch."],
            ["How long does delivery take?", "Estimated delivery varies by product and supplier. Most seed products use a 7-14 business day placeholder estimate."],
            ["Can I track my order?", "Yes. Use the order tracking page with your order ID and email."],
            ["How do returns work?", "Review the return and refund policies before purchasing. Legal review is recommended before launch."]
          ].map(([q, a]) => (
            <div key={q} className="card-surface p-5">
              <h3 className="font-bold">{q}</h3>
              <p className="mt-2 text-sm text-ink/70">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
