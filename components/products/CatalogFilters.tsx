"use client";

import { useRouter, usePathname } from "next/navigation";

interface Props {
  categories: string[];
  activeCategory: string;
  currentParams: Record<string, string | undefined>;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function CatalogFilters({ categories, activeCategory, currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...currentParams, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "All" && v !== "newest") params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Category */}
      <div>
        <p className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-4">Category</p>
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => navigate({ category: cat === "All" ? undefined : cat })}
                className={`font-body text-base transition-colors text-left w-full ${
                  (cat === "All" && activeCategory === "All") || activeCategory === cat
                    ? "text-(--color-primary) font-semibold"
                    : "text-(--color-on-surface-variant) hover:text-(--color-primary)"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-4">Price</p>
        <ul className="flex flex-col gap-2">
          {[
            { label: "All prices", value: undefined },
            { label: "Under $30", value: "30" },
            { label: "Under $60", value: "60" },
            { label: "Under $100", value: "100" },
          ].map(({ label, value }) => (
            <li key={label}>
              <button
                onClick={() => navigate({ max: value })}
                className={`font-body text-base transition-colors text-left w-full ${
                  currentParams.max === value
                    ? "text-(--color-primary) font-semibold"
                    : "text-(--color-on-surface-variant) hover:text-(--color-primary)"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <p className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-4">Sort By</p>
        <ul className="flex flex-col gap-2">
          {SORT_OPTIONS.map(({ value, label }) => (
            <li key={value}>
              <button
                onClick={() => navigate({ sort: value })}
                className={`font-body text-base transition-colors text-left w-full ${
                  (currentParams.sort ?? "newest") === value
                    ? "text-(--color-primary) font-semibold"
                    : "text-(--color-on-surface-variant) hover:text-(--color-primary)"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
