import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { AddToCartActions, StickyBuyNow } from "@/components/store/add-to-cart";
import { ProductViewTracker } from "@/components/store/product-view-tracker";
import { ProductCard } from "@/components/product-card";
import { TrustBadges } from "@/components/store/trust-badges";
import { getActiveProducts, getProductBySlug, getStoreProductBySlug, getStoreProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return getActiveProducts().map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  return { title: product?.name || "Product", description: product?.short_description };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getStoreProductBySlug(params.slug);
  if (!product) notFound();
  const related = (await getStoreProducts()).filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;
  const isPawTrim = product.slug === "pawtrim-led-grinder";
  const problemBullets = isPawTrim
    ? ["Traditional clippers can feel stressful for pets and owners.", "Dark nails can make it harder to see where to trim.", "Pets may move suddenly, making nail care feel rushed.", "Professional grooming can be inconvenient for routine touch-ups."]
    : ["Small everyday frustrations can slow down routines.", "Cheap tools often feel random instead of useful.", "A clear use case makes a product easier to trust."];
  const howToUse = isPawTrim
    ? ["Let your pet get comfortable with the sound.", "Turn on the LED and approach slowly.", "Use light, gradual passes instead of forcing it.", "Take breaks and reward calm behavior.", "Follow the final supplier safety instructions."]
    : ["Review the included instructions.", "Use the product for its intended everyday task.", "Start gently and adjust based on your setup.", "Contact support if anything arrives damaged or unclear."];

  return (
    <>
      <ProductViewTracker productId={product.id} value={product.price} />
      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_.9fr]">
        <div className="grid gap-4">
          <Image src={product.images[0]} alt={`${product.name} placeholder`} width={900} height={700} className="aspect-[4/3] rounded-[2rem] border border-line bg-mint object-cover shadow-soft" priority />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image) => <Image key={image} src={image} alt={`${product.name} gallery placeholder`} width={220} height={160} className="aspect-[4/3] rounded-2xl border border-line bg-white object-cover" />)}
          </div>
        </div>
        <div className="card-surface h-fit p-6 lg:p-8">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">{product.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-ink/70">{product.subheadline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-black">{formatCurrency(product.price)}</span>
            {product.compare_at_price ? <span className="text-lg text-ink/45 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
            {discount ? <span className="rounded-full bg-mint px-3 py-2 text-sm font-bold text-moss">Save {discount}%</span> : null}
          </div>
          <div className="mt-6"><AddToCartActions product={product} /></div>
          <div className="mt-6 grid gap-3">
            {product.benefits.map((benefit) => (
              <p key={benefit} className="flex gap-2 text-sm font-medium text-ink/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss" /> {benefit}</p>
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-cloud p-5">
            <p className="flex gap-2 text-sm"><Truck className="h-4 w-4 text-moss" /> {product.shipping_estimate}</p>
            <p className="flex gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-moss" /> 30-day support window after delivery.</p>
          </div>
        </div>
      </section>

      <section className="container-page pb-8">
        <TrustBadges compact />
      </section>

      <section className="soft-section py-12">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="card-surface p-6">
            <h2 className="text-2xl font-black">The Problem</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
              {problemBullets.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-moss" /> {item}</li>)}
            </ul>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-2xl font-black">The Nuvoro Solution</h2>
            <p className="mt-4 text-sm leading-6 text-ink/70">{isPawTrim ? "PawTrim helps turn nail care into a slower, more controlled routine. The LED supports visibility, while the grinder approach can feel less abrupt than clipping all at once." : `${product.name} gives you a practical tool designed around a clear everyday use case.`}</p>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-2xl font-black">How to Use</h2>
            <ol className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
              {howToUse.map((item, index) => <li key={item} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-xs font-black text-moss">{index + 1}</span>{item}</li>)}
            </ol>
          </div>
        </div>
      </section>

      {isPawTrim ? (
        <section className="container-page py-12">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="text-2xl font-black">Traditional Clipper</h2>
              <ul className="mt-4 grid gap-3 text-sm text-ink/70">
                <li>Can feel abrupt for nervous pets.</li>
                <li>Requires more confidence around dark nails.</li>
                <li>One quick cut can feel stressful if your pet moves.</li>
              </ul>
            </div>
            <div className="card-surface border-moss bg-mint p-6">
              <h2 className="text-2xl font-black">PawTrim LED Grinder</h2>
              <ul className="mt-4 grid gap-3 text-sm text-ink/75">
                <li>Gradual grinding for more controlled passes.</li>
                <li>LED light supports better visibility.</li>
                <li>Compact tool for routine at-home grooming.</li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page grid gap-8 py-12 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="text-2xl font-black">Product Details</h2>
          <dl className="mt-4 grid gap-3">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-line pb-3 text-sm"><dt className="font-semibold">{key}</dt><dd className="text-right text-ink/70">{value}</dd></div>
            ))}
          </dl>
        </div>
        <div className="card-surface p-6">
          <h2 className="text-2xl font-black">Reviews</h2>
          <p className="mt-3 text-ink/70">Customer review collection is prepared for launch. Add verified reviews after real orders are fulfilled.</p>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-2xl font-black">FAQ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {product.faqs.map((faq) => <div key={faq.question} className="card-surface p-5"><h3 className="font-bold">{faq.question}</h3><p className="mt-2 text-sm text-ink/70">{faq.answer}</p></div>)}
        </div>
      </section>

      {related.length ? (
        <section className="container-page py-12">
          <h2 className="text-2xl font-black">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <StickyBuyNow product={product} />
      </div>
    </>
  );
}
