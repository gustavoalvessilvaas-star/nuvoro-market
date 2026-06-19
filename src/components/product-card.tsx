import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { QuickAddButton } from "@/components/store/add-to-cart";
import { getPrimaryProductImage, getProductAlt } from "@/lib/product-media";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;
  const primaryImage = getPrimaryProductImage(product);

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-soft hover:-translate-y-1 hover:shadow-glow">
      <Link href={`/products/${product.slug}`} className="relative block bg-gradient-to-br from-mint via-white to-blue/10">
        {discount ? <span className="absolute left-3 top-3 z-10 rounded-full bg-night px-3 py-1 text-xs font-black text-white">Save {discount}%</span> : null}
        <Image src={primaryImage} alt={getProductAlt(product)} width={720} height={540} className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="grid gap-4 p-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue">{product.category}</p>
          <h3 className="mt-2 text-lg font-black leading-tight text-ink">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">{product.short_description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
          {product.compare_at_price ? <span className="text-sm text-ink/50 line-through">{formatCurrency(product.compare_at_price)}</span> : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <QuickAddButton product={product} />
          <Link href={`/products/${product.slug}`} className="btn-secondary w-full">Details</Link>
        </div>
      </div>
    </article>
  );
}
