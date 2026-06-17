import Link from "next/link";
import { ArrowRight, BadgeCheck, LockKeyhole, PackageCheck, Truck, type LucideIcon } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, siteConfig } from "@/lib/constants";
import { getStoreProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getStoreProducts();
  const featured = products[0];

  return (
    <>
      <section className="bg-white">
        <div className="container-page grid min-h-[76vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-moss">Smart Everyday Essentials</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{siteConfig.slogan}</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/70">{siteConfig.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary gap-2">Shop Smart Finds <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/products/${featured.slug}`} className="btn-secondary">View Featured Product</Link>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-cloud p-4 shadow-soft">
            <ProductCard product={featured} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-moss">Featured</p>
            <h2 className="mt-2 text-3xl font-black">Best Sellers</h2>
          </div>
          <Link href="/products" className="hidden text-sm font-bold text-moss sm:inline-flex">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-3xl font-black">Shop by Category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="rounded-lg border border-line bg-cloud p-5 font-bold hover:border-moss">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { Icon: Truck, title: "Free Shipping", text: "Simple free shipping on every order." },
          { Icon: LockKeyhole, title: "Secure Checkout", text: "Stripe-powered checkout with encrypted payment handling." },
          { Icon: BadgeCheck, title: "30-Day Guarantee", text: "Contact support within 30 days if something is not right." },
          { Icon: PackageCheck, title: "Tracking Included", text: "Tracking details are added once available from the supplier." }
        ] satisfies Array<{ Icon: LucideIcon; title: string; text: string }>).map(({ Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-line bg-white p-5">
            <Icon className="h-6 w-6 text-moss" />
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-2 text-sm text-ink/70">{text}</p>
          </div>
        ))}
      </section>

      <section className="bg-mint py-14">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">Curated to feel useful, not random.</h2>
            <p className="mt-4 text-ink/75">Nuvoro Market focuses on practical finds with clear benefits, straightforward pricing and a clean support experience.</p>
          </div>
          <div className="grid gap-3">
            {["Products are selected around everyday use cases.", "Offers are written with practical benefits, not inflated claims.", "Manual fulfillment fields are built in for responsible supplier operations."].map((item) => (
              <p key={item} className="rounded-md bg-white p-4 text-sm font-medium">{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-3xl font-black">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Where do you ship?", "Nuvoro Market is built for United States customers at launch."],
            ["How long does delivery take?", "Estimated delivery varies by product and supplier. Most seed products use a 7-14 business day placeholder estimate."],
            ["Can I track my order?", "Yes. Use the order tracking page with your order ID and email."],
            ["How do returns work?", "Review the return and refund policies before purchasing. Legal review is recommended before launch."]
          ].map(([q, a]) => (
            <div key={q} className="rounded-lg border border-line bg-white p-5">
              <h3 className="font-bold">{q}</h3>
              <p className="mt-2 text-sm text-ink/70">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
