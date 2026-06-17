import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { AddToCartActions } from "@/components/store/add-to-cart";
import { ProductViewTracker } from "@/components/store/product-view-tracker";
import { ProductCard } from "@/components/product-card";
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

  return (
    <>
      <ProductViewTracker productId={product.id} value={product.price} />
      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_.9fr]">
        <div className="grid gap-4">
          <Image src={product.images[0]} alt={`${product.name} placeholder`} width={900} height={700} className="aspect-[4/3] rounded-lg border border-line bg-mint object-cover" priority />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image) => <Image key={image} src={image} alt={`${product.name} gallery placeholder`} width={220} height={160} className="aspect-[4/3] rounded-md border border-line object-cover" />)}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-moss">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">{product.headline}</h1>
          <p className="mt-4 text-lg text-ink/70">{product.subheadline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-black">{formatCurrency(product.price)}</span>
            {product.compare_at_price ? <span className="text-lg text-ink/45 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
            {discount ? <span className="rounded-md bg-mint px-3 py-2 text-sm font-bold text-moss">Save {discount}%</span> : null}
          </div>
          <div className="mt-6"><AddToCartActions product={product} /></div>
          <div className="mt-6 grid gap-3">
            {product.benefits.map((benefit) => (
              <p key={benefit} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss" /> {benefit}</p>
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-lg border border-line bg-white p-5">
            <p className="flex gap-2 text-sm"><Truck className="h-4 w-4 text-moss" /> {product.shipping_estimate}</p>
            <p className="flex gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-moss" /> 30-day support window after delivery.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page grid gap-8 md:grid-cols-3">
          <div><h2 className="text-2xl font-black">Problem</h2><p className="mt-3 text-ink/70">Small everyday frustrations can slow down routines and create clutter.</p></div>
          <div><h2 className="text-2xl font-black">Solution</h2><p className="mt-3 text-ink/70">{product.name} gives you a practical tool designed around a clear use case.</p></div>
          <div><h2 className="text-2xl font-black">How it works</h2><p className="mt-3 text-ink/70">Order online, receive tracking when available, and use the product as directed by the final supplier instructions.</p></div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-2xl font-black">Product Details</h2>
          <dl className="mt-4 grid gap-3">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-line pb-3 text-sm"><dt className="font-semibold">{key}</dt><dd className="text-right text-ink/70">{value}</dd></div>
            ))}
          </dl>
        </div>
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-2xl font-black">Reviews</h2>
          <p className="mt-3 text-ink/70">Customer review collection is prepared for launch. Add verified reviews after real orders are fulfilled.</p>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-2xl font-black">FAQ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {product.faqs.map((faq) => <div key={faq.question} className="rounded-lg border border-line bg-white p-5"><h3 className="font-bold">{faq.question}</h3><p className="mt-2 text-sm text-ink/70">{faq.answer}</p></div>)}
        </div>
      </section>

      {related.length ? (
        <section className="container-page py-12">
          <h2 className="text-2xl font-black">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 md:hidden">
        <Link href="/checkout" className="btn-primary w-full">Buy Now - {formatCurrency(product.price)}</Link>
      </div>
    </>
  );
}
