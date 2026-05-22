import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/products/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";
import type { ShippingAddress } from "@/lib/supabase/types";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name, description").eq("slug", slug).single();

  return {
    title: data ? `${data.name} | Westside` : "Product | Westside",
    description: data?.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .eq("category", product.category ?? "")
    .neq("id", product.id)
    .limit(4);

  const measurements = product.measurements as Record<string, string> | null;

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 font-technical text-[12px] text-(--color-on-surface-variant)">
        <Link href="/shop" className="hover:text-(--color-primary) transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        {product.category && (
          <>
            <Link href={`/shop?category=${product.category}`} className="hover:text-(--color-primary) transition-colors">{product.category}</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </>
        )}
        <span className="text-(--color-on-surface)">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Gallery */}
        <div className="md:col-span-7">
          <ProductGallery images={product.images ?? []} name={product.name} />
        </div>

        {/* Info */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div>
            {product.condition && (
              <span className="inline-block px-3 py-1 bg-(--color-secondary-container) text-(--color-on-secondary-container) font-technical text-[12px] rounded-full mb-4">
                {product.condition}
              </span>
            )}
            <h1 className="font-headline text-3xl font-medium text-(--color-on-surface) mb-3">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-2xl font-medium text-(--color-primary)">
                ₦{product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="font-technical text-[13px] text-(--color-on-surface-variant) line-through">
                  ₦{product.original_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-(--color-outline-variant)/30 pt-6 flex flex-col gap-6">
            {!product.in_stock && (
              <div className="flex items-center gap-2 text-(--color-error) font-technical text-[12px]">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                <span>This piece has found its home.</span>
              </div>
            )}

            {product.in_stock && (
              <div className="flex items-center gap-2 text-(--color-error) font-technical text-[12px]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Only 1 left in stock — Archival Hunt in progress</span>
              </div>
            )}

            {product.fit_note && (
              <div>
                <h3 className="font-label text-xs tracking-widest uppercase mb-3">Fit Note</h3>
                <p className="font-body text-base text-(--color-on-surface-variant) bg-(--color-surface-container-low) p-4 border-l-2 border-(--color-primary) italic">
                  &ldquo;{product.fit_note}&rdquo;
                </p>
              </div>
            )}

            {measurements && Object.keys(measurements).length > 0 && (
              <div>
                <h3 className="font-label text-xs tracking-widest uppercase mb-4">Flat Measurements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(measurements).map(([key, val]) => (
                    <div key={key} className="border border-(--color-outline-variant)/30 p-3 flex justify-between items-center bg-white/50">
                      <span className="font-technical text-[12px] text-(--color-on-surface-variant) capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-technical text-[12px] font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-2">
              <AddToCartButton product={product} />
              <button className="w-full border border-(--color-outline) text-(--color-on-surface) py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-surface-container) transition-colors duration-300">
                Wishlist
              </button>
            </div>

            {/* Accordion */}
            <div className="pt-4 space-y-0">
              <details className="group border-b border-(--color-outline-variant)/30 pb-4" open>
                <summary className="list-none flex justify-between items-center cursor-pointer font-label text-xs tracking-widest uppercase py-3">
                  Description
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-3 font-body text-base text-(--color-on-surface-variant) space-y-3">
                  {product.description && <p>{product.description}</p>}
                  <ul className="list-disc list-inside space-y-1 font-technical text-[12px]">
                    {product.era && <li>{product.era}</li>}
                    {product.condition && <li>Condition: {product.condition}</li>}
                  </ul>
                </div>
              </details>

              <details className="group border-b border-(--color-outline-variant)/30 pb-4">
                <summary className="list-none flex justify-between items-center cursor-pointer font-label text-xs tracking-widest uppercase py-3">
                  Shipping &amp; Authentication
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-3 font-body text-base text-(--color-on-surface-variant)">
                  <p>Every item is hand-curated in Jericho, Ibadan and professionally steamed before shipment. Includes a certificate of authenticity and archival care guide.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="mt-24">
          <div className="flex justify-between items-end mb-10 border-b border-(--color-outline-variant)/30 pb-6">
            <div>
              <h2 className="font-headline text-2xl font-medium text-(--color-on-surface)">More from the Era</h2>
              {product.category && (
                <p className="font-body text-base text-(--color-on-surface-variant) italic">The {product.category} Collection</p>
              )}
            </div>
            <Link href={`/shop?category=${product.category}`} className="font-label text-xs tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5">
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
