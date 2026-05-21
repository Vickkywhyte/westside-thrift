import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/products/ProductCard";
import HeroSection from "@/components/layout/HeroSection";

export const revalidate = 3600;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      <HeroSection />

      {/* Story Teaser */}
      <section className="py-20 bg-(--color-surface)">
        <div className="max-w-[720px] mx-auto px-4 md:px-0">
          <div className="border-l-2 border-(--color-primary) pl-8 py-2">
            <p className="font-headline text-2xl italic text-(--color-on-surface-variant) leading-relaxed">
              &ldquo;Westside started with a single rack of vintage denim and a belief that style shouldn&rsquo;t be a luxury reserved for the few.&rdquo;
            </p>
          </div>
          <div className="mt-8 flex justify-end">
            <Link href="/about" className="font-label text-xs tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5">
              Read the full story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 px-4 md:px-(--spacing-margin-desktop) max-w-(--spacing-container-max) mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-(--color-outline-variant)/30 pb-6">
            <div>
              <span className="font-technical text-[12px] text-(--color-secondary) uppercase tracking-widest block mb-2">
                Fresh Finds
              </span>
              <h2 className="font-headline text-3xl font-medium text-(--color-on-surface)">
                New to the Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-label text-xs tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} badge={i === 0 ? "New" : undefined} />
            ))}
          </div>
        </section>
      )}

      {/* Values Grid */}
      <section className="py-20 px-4 md:px-(--spacing-margin-desktop) max-w-(--spacing-container-max) mx-auto border-t border-(--color-outline-variant)/30">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="font-technical text-[12px] text-(--color-secondary) uppercase tracking-widest block mb-2">
              Our Compass
            </span>
            <h2 className="font-headline text-3xl font-medium text-(--color-on-surface)">
              Built on Craft &amp; Integrity
            </h2>
          </div>
          <p className="font-body text-base text-(--color-on-surface-variant) max-w-sm">
            How we operate, from the first hunt to the final stitch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "eco", title: "Sustainable", body: "Extending the lifecycle of existing garments is the purest form of environmentalism. No new production, just new lives." },
            { icon: "sell", title: "Affordable", body: "Great vintage shouldn't be gatekept. We keep our margins slim so authentic pieces stay accessible to everyone." },
            { icon: "verified", title: "Honest", body: "Full transparency on condition. If it has a pinhole or a faint stain, we'll show you. Character is honesty." },
            { icon: "location_on", title: "Local", body: "Rooted in Bodija, Ibadan. We source thoughtfully and support our community at every step." },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="p-8 border border-(--color-outline-variant)/30 bg-(--color-surface-container-low) flex flex-col gap-6 hover:shadow-[0_12px_24px_rgba(176,125,98,0.15)] transition-all duration-300"
            >
              <span className="material-symbols-outlined text-4xl text-(--color-primary)">{icon}</span>
              <h3 className="font-headline text-2xl font-medium">{title}</h3>
              <p className="font-body text-base text-(--color-on-surface-variant)">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — Sell */}
      <section className="px-4 md:px-(--spacing-margin-desktop) pb-20 max-w-(--spacing-container-max) mx-auto">
        <div className="bg-(--color-primary) p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 border-[20px] border-white/10 rounded-full" />
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Got vintage to sell?
            </h2>
            <p className="font-body text-lg text-white/90 leading-relaxed">
              We&rsquo;re always looking for quality vintage pieces. Turn your wardrobe archives into cash or store credit.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/sell"
              className="bg-white text-(--color-primary) px-10 py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-secondary-fixed) transition-colors text-center"
            >
              Send Us Photos
            </Link>
            <p className="font-technical text-[12px] text-white/70 text-center">
              Response within 48 hours
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
