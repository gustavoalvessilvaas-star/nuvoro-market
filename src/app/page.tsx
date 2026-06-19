import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { QuickAddButton } from "@/components/store/add-to-cart";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { TrustBadges } from "@/components/store/trust-badges";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, siteConfig } from "@/lib/constants";
import { getStoreProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const products = await getStoreProducts();
  const featured = products[0];
  const smartDeal = products.find((product) => product.slug === "pawtrim-led-grinder") || featured;
  const dealDiscount = smartDeal.compare_at_price ? Math.round((1 - smartDeal.price / smartDeal.compare_at_price) * 100) : null;

  return (
    <>
      <section className="dark-section relative overflow-hidden">
        <div className="container-page grid min-h-[76vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Smart Everyday Essentials</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{siteConfig.slogan}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-white/70">{siteConfig.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary gap-2">Shop Smart Finds <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/products/${smartDeal.slug}`} className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white hover:text-ink">View Today&apos;s Deal</Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-white/70 sm:grid-cols-3">
              {["No inflated claims", "Curated practical finds", "Secure Stripe checkout"].map((item) => (
                <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-aqua" /> {item}</p>
              ))}
            </div>
          </div>
          <div className="premium-panel p-4">
            <div className="mb-3 flex items-center gap-2 px-2 text-sm font-bold text-aqua"><Sparkles className="h-4 w-4" /> Featured smart find</div>
            <ProductCard product={featured} />
          </div>
        </div>
      </section>

      <section className="container-page pb-6">
        <div className="grid gap-6 rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center lg:p-7">
          <div>
            <p className="eyebrow">Today&apos;s Smart Deal</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{smartDeal.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{smartDeal.short_description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-black">{formatCurrency(smartDeal.price)}</span>
              {smartDeal.compare_at_price ? <span className="font-semibold text-ink/45 line-through">{formatCurrency(smartDeal.compare_at_price)}</span> : null}
              {dealDiscount ? <span className="rounded-full bg-coral px-3 py-1 text-xs font-black text-white">Save {dealDiscount}%</span> : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
            <Link href={`/products/${smartDeal.slug}`} className="btn-secondary">View Details</Link>
            <QuickAddButton product={smartDeal} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured" title="Best Sellers" />
          <Link href="/products" className="hidden text-sm font-bold text-moss sm:inline-flex">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section id="categories" className="soft-section py-14">
        <div className="container-page">
          <SectionHeading title="Shop by Category" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="card-surface min-h-32 p-5 font-black hover:-translate-y-1 hover:border-aqua hover:shadow-glow">
                {category}
                <span className="mt-4 block text-sm font-medium leading-6 text-ink/60">Curated practical finds for this routine.</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <TrustBadges />
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft lg:grid-cols-[.8fr_1fr] lg:items-center lg:p-8">
          <div>
            <p className="eyebrow">Useful Drops</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Get practical product finds before they hit the front page.</h2>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section className="dark-section py-14">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Why Nuvoro</p>
            <h2 className="mt-2 text-3xl font-black text-white">Curated to feel useful, not random.</h2>
            <p className="mt-4 text-white/70">Nuvoro Market focuses on practical finds with clear benefits, straightforward pricing and a clean support experience.</p>
          </div>
          <div className="grid gap-3">
            {["Products are selected around everyday use cases.", "Offers are written with practical benefits, not inflated claims.", "Manual fulfillment fields are built in for responsible supplier operations."].map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-white/80">{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Product Discovery</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Small upgrades that make everyday life easier.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">Every product starts with a clear use case: a cleaner home routine, calmer pet care, better car organization, easier travel or a more comfortable desk setup.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Clear use case", "Practical price point", "Supplier review fields", "No fake social proof"].map((item) => (
              <div key={item} className="card-surface p-5">
                <CheckCircle2 className="h-5 w-5 text-moss" />
                <p className="mt-3 font-black">{item}</p>
              </div>
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
            ["How do returns work?", "Review the return and refund policies before purchasing. Legal review is recommended before launch."],
            ["Are payments secure?", "Card payments are processed through Stripe. Nuvoro Market does not store full card numbers."],
            ["How are products selected?", "Products are selected around clear everyday use cases, margin checks, supplier review and honest benefit-focused copy."]
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
