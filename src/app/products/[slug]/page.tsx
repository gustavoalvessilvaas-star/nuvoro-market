import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { AddToCartActions, StickyBuyNow } from "@/components/store/add-to-cart";
import { ProductViewTracker } from "@/components/store/product-view-tracker";
import { ProductCard } from "@/components/product-card";
import { TrustBadges } from "@/components/store/trust-badges";
import { getActiveProducts, getProductBySlug, getStoreProductBySlug, getStoreProducts } from "@/lib/products";
import { getProductAlt, getProductImages } from "@/lib/product-media";
import { formatCurrency, siteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return getActiveProducts().map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  const images = product ? getProductImages(product) : [];
  return {
    title: product?.seo_title || product?.name || "Product",
    description: product?.seo_description || product?.short_description,
    openGraph: product ? {
      title: product.seo_title || product.name,
      description: product.seo_description || product.short_description,
      images: images[0] ? [{ url: images[0], alt: getProductAlt(product) }] : undefined
    } : undefined
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getStoreProductBySlug(params.slug);
  if (!product) notFound();
  const allProducts = await getStoreProducts();
  const related = allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const frequentlyBought = allProducts.filter((item) => item.id !== product.id).slice(0, 4);
  const productImages = getProductImages(product);
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;
  const isPawTrim = product.slug === "pawtrim-led-grinder";
  const absoluteImages = productImages.map((image) => image.startsWith("http") ? image : siteUrl(image));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description,
    image: absoluteImages,
    brand: {
      "@type": "Brand",
      name: "Nuvoro Market"
    },
    category: product.category,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: siteUrl(`/products/${product.slug}`),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
  const problemBullets = isPawTrim
    ? ["Traditional clippers can feel stressful for pets and owners.", "Dark nails can make it harder to see where to trim.", "Pets may move suddenly, making nail care feel rushed.", "Professional grooming can be inconvenient for routine touch-ups."]
    : ["Small everyday frustrations can slow down routines.", "Cheap tools often feel random instead of useful.", "A clear use case makes a product easier to trust."];
  const howToUse = isPawTrim
    ? ["Let your pet get comfortable with the sound.", "Turn on the LED and approach slowly.", "Use light, gradual passes instead of forcing it.", "Take breaks and reward calm behavior.", "Follow the final supplier safety instructions."]
    : ["Review the included instructions.", "Use the product for its intended everyday task.", "Start gently and adjust based on your setup.", "Contact support if anything arrives damaged or unclear."];

  return (
    <>
      <ProductViewTracker productId={product.id} value={product.price} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <section className="dark-section">
        <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_.9fr]">
        <div className="grid gap-4">
          <Image src={productImages[0]} alt={getProductAlt(product, "main image")} width={900} height={700} className="aspect-[4/3] rounded-[2rem] border border-white/15 bg-white/10 object-cover shadow-glow" priority />
          <div className="grid grid-cols-4 gap-3">
            {productImages.slice(0, 4).map((image, index) => <Image key={image} src={image} alt={getProductAlt(product, `gallery image ${index + 1}`)} width={220} height={160} className="aspect-[4/3] rounded-2xl border border-white/15 bg-white/10 object-cover" />)}
          </div>
        </div>
        <div className="premium-panel h-fit p-6 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">{product.category}</p>
          <h1 className="mt-3 text-balance text-4xl font-black leading-tight text-white">{product.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-white/70">{product.subheadline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-black">{formatCurrency(product.price)}</span>
            {product.compare_at_price ? <span className="text-lg text-white/45 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
            {discount ? <span className="rounded-full bg-coral px-3 py-2 text-sm font-black text-white">Save {discount}%</span> : null}
          </div>
          <div className="mt-6"><AddToCartActions product={product} /></div>
          <div className="mt-6 grid gap-3">
            {product.benefits.map((benefit) => (
              <p key={benefit} className="flex gap-2 text-sm font-medium text-white/75"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua" /> {benefit}</p>
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="flex gap-2 text-sm text-white/75"><Truck className="h-4 w-4 text-aqua" /> {product.shipping_estimate}</p>
            <p className="flex gap-2 text-sm text-white/75"><ShieldCheck className="h-4 w-4 text-aqua" /> 30-day support window after delivery.</p>
          </div>
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

      {isPawTrim ? (
        <section className="soft-section py-12">
          <div className="container-page grid gap-6 lg:grid-cols-3">
            <div className="card-surface p-6">
              <h2 className="text-2xl font-black">What&apos;s Included</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
                {["PawTrim LED Grinder", "Charging cable or battery note based on final supplier model", "Basic instruction insert placeholder", "Protective packaging details to confirm before launch"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-moss" /> {item}</li>)}
              </ul>
            </div>
            <div className="card-surface p-6">
              <h2 className="text-2xl font-black">Why Pet Owners Choose It</h2>
              <p className="mt-4 text-sm leading-6 text-ink/70">PawTrim is built around a calmer routine: better visibility, gradual passes and a compact tool that helps owners feel more in control.</p>
              <p className="mt-4 rounded-2xl bg-cloud p-4 text-sm font-bold text-ink/70">Verified reviews coming soon after real customer orders are fulfilled.</p>
            </div>
            <div className="card-surface p-6">
              <h2 className="text-2xl font-black">Shipping & Support</h2>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
                <p>Processing: 2-4 business days placeholder.</p>
                <p>Tracking is added when available from the supplier or carrier.</p>
                <a href="/policies/shipping-policy" className="font-black text-moss">Read shipping policy</a>
                <a href="/contact" className="font-black text-moss">Contact support</a>
              </div>
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

      {isPawTrim ? (
        <section className="container-page py-12">
          <h2 className="text-2xl font-black">Frequently Bought Together</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">Use existing catalog items as complementary smart finds until dedicated pet accessories are approved.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{frequentlyBought.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <StickyBuyNow product={product} />
      </div>
    </>
  );
}
