import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

interface Props {
  product: Product;
  badge?: string;
}

export default function ProductCard({ product, badge }: Props) {
  const image = product.images?.[0];

  return (
    <Link href={`/shop/${product.slug}`} className="group cursor-pointer block">
      <div className="aspect-[3/4] bg-(--color-surface-container-low) border border-(--color-outline-variant) overflow-hidden mb-4 relative">
        <div
          className="absolute inset-0 bg-(--color-on-surface)/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        />
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-(--color-surface-container-highest) flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-(--color-outline)">hanger</span>
          </div>
        )}
        {badge && (
          <span className="absolute top-4 left-4 bg-(--color-tertiary) text-white font-technical text-[11px] px-2 py-1 z-20">
            {badge}
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-(--color-on-surface)/40 flex items-center justify-center z-20">
            <span className="font-label text-xs tracking-widest uppercase text-white border border-white px-3 py-1">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="font-headline text-lg font-medium text-(--color-on-surface) leading-snug">
          {product.name}
        </h4>
        <div className="flex justify-between items-center">
          <span className="font-technical text-[12px] text-(--color-on-surface-variant) uppercase tracking-tight">
            {product.era ?? product.condition ?? ""}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-label text-xs tracking-widest text-(--color-primary)">
              ₦{product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="font-technical text-[11px] text-(--color-on-surface-variant) line-through">
                ₦{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
