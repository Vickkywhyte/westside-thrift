import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/products/ProductCard";
import CatalogFilters from "@/components/products/CatalogFilters";

export const metadata: Metadata = {
  title: "Shop | Westside",
  description: "Browse hand-curated vintage clothing from the 1960s–1990s.",
};

const CATEGORIES = ["All", "Outerwear", "Denim", "Tops", "Bottoms", "Accessories", "Knitwear"];

interface SearchParams extends Record<string, string | undefined> {
  category?: string;
  max?: string;
  new?: string;
  sort?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("products").select("*").eq("in_stock", true);

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  if (params.max) {
    query = query.lte("price", Number(params.max));
  }

  if (params.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products, error } = await query;

  const activeCategory = params.category ?? "All";

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="font-technical text-[12px] text-(--color-secondary) uppercase tracking-widest block mb-2">
          The Archive
        </span>
        <h1 className="font-headline text-4xl font-medium text-(--color-on-surface)">
          {params.max === "30" ? "Under $30" : params.new ? "New Arrivals" : activeCategory === "All" ? "All Items" : activeCategory}
        </h1>
        {products && (
          <p className="font-technical text-[12px] text-(--color-on-surface-variant) mt-2">
            {products.length} item{products.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar filters */}
        <aside className="w-full md:w-52 shrink-0">
          <CatalogFilters categories={CATEGORIES} activeCategory={activeCategory} currentParams={params} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {error ? (
            <p className="font-body text-(--color-error)">Something went wrong loading products.</p>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-(--color-outline) block mb-4">hanger</span>
              <p className="font-headline text-xl text-(--color-on-surface-variant)">Nothing here yet.</p>
              <p className="font-body text-base text-(--color-on-surface-variant) mt-2">
                The hunt is ongoing. Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
