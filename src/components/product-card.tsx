import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-line/80 bg-white shadow-sm shadow-ink/5 hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block bg-mint">
        <Image src={product.images[0]} alt={`${product.name} placeholder image`} width={720} height={540} className="aspect-[4/3] w-full object-cover" />
      </Link>
      <div className="grid gap-4 p-4">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3 className="mt-2 text-lg font-black leading-tight text-ink">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">{product.short_description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
          {product.compare_at_price ? <span className="text-sm text-ink/50 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
          {discount ? <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-moss">{discount}% off</span> : null}
        </div>
        <Link href={`/products/${product.slug}`} className="btn-primary w-full">View Product</Link>
      </div>
    </article>
  );
}
