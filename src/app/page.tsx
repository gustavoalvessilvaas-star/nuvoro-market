import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Truck } from "lucide-react";
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
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-3 py-3 text-xs font-bold text-ink/70 sm:grid-cols-3">
          {[
            { label: "Secure Stripe checkout", Icon: ShieldCheck },
            { label: "US launch support flow", Icon: CheckCircle2 },
            { label: "Tracking when available", Icon: Truck }
          ].map(({ label, Icon }) => (
            <p key={label} className="flex items-center gap-2"><Icon className="h-4 w-4 text-moss" /> {label}</p>
          ))}
        </div>
      </section>

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

      <section className="container-page pb-6">
        <div className="grid gap-6 rounded-[2rem] border border-moss/25 bg-mint p-5 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center lg:p-7">
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

      <section className="container-page py-14">
        <div className="grid gap-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft lg:grid-cols-[.8fr_1fr] lg:items-center lg:p-8">
          <div>
            <p className="eyebrow">Useful Drops</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Get practical product finds before they hit the front page.</h2>
          </div>
          <NewsletterForm />
        </div>
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
