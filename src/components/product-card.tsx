import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <Link href={`/products/${product.slug}`} className="block bg-mint">
        <Image src={product.images[0]} alt={`${product.name} placeholder image`} width={720} height={540} className="aspect-[4/3] w-full object-cover" />
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-moss">{product.category}</p>
          <h3 className="mt-1 text-lg font-bold leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-ink/70">{product.short_description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
          {product.compare_at_price ? <span className="text-sm text-ink/50 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
          {discount ? <span className="rounded bg-mint px-2 py-1 text-xs font-bold text-moss">{discount}% off</span> : null}
        </div>
        <Link href={`/products/${product.slug}`} className="btn-primary w-full">View Product</Link>
      </div>
    </article>
  );
}
