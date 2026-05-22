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

      {/* ── NEW ARRIVALS ── */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="px-4 md:px-(--spacing-margin-desktop) py-24 max-w-(--spacing-container-max) mx-auto">
          <div className="flex justify-between items-end mb-14">
            <div>
              <span className="font-technical text-[10px] tracking-[0.3em] text-(--color-secondary) uppercase block mb-3">
                Fresh to the Archive
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-(--color-on-surface) tracking-tight leading-none">
                New Arrivals.
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-label text-[11px] tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5 hover:opacity-60 transition-opacity hidden md:block"
            >
              View All
            </Link>
          </div>

          {/* Large hero card + 3 smaller */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {featuredProducts[0] && (
              <Link
                href={`/shop/${featuredProducts[0].slug}`}
                className="lg:col-span-5 group relative block overflow-hidden bg-(--color-surface-container-low)"
                style={{ aspectRatio: "3/4" }}
              >
                {featuredProducts[0].images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredProducts[0].images[0]}
                    alt={featuredProducts[0].name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="font-technical text-[10px] tracking-[0.25em] text-white/50 uppercase mb-1">
                    {featuredProducts[0].era ?? featuredProducts[0].condition}
                  </p>
                  <p className="font-headline text-xl font-medium text-white leading-snug mb-2">
                    {featuredProducts[0].name}
                  </p>
                  <p className="font-technical text-[12px]" style={{ color: "rgba(220,170,140,0.9)" }}>
                    ₦{Number(featuredProducts[0].price).toLocaleString()}
                  </p>
                </div>
                <span className="absolute top-5 left-5 bg-(--color-primary) text-white font-technical text-[10px] px-2.5 py-1 tracking-[0.2em] uppercase">
                  New
                </span>
              </Link>
            )}

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredProducts.slice(1, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="mt-8 md:hidden flex justify-center">
            <Link href="/shop" className="font-label text-[11px] tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5">
              View All
            </Link>
          </div>
        </section>
      )}

      {/* ── EDITORIAL DARK BLOCK ── */}
      <section className="bg-[#0f0f0f] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image panel */}
          <div className="relative overflow-hidden" style={{ minHeight: "540px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&q=90"
              alt="Editorial fashion"
              className="w-full h-full object-cover absolute inset-0"
              style={{ filter: "contrast(1.05) brightness(0.9)" }}
            />
            {/* Overlay tint */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(156,60,36,0.25) 0%, transparent 60%)" }} />

            {/* Corner label */}
            <div className="absolute top-8 left-8 z-10">
              <span className="font-technical text-[9px] tracking-[0.4em] text-white/40 uppercase">
                Westside ◆ 2021
              </span>
            </div>
          </div>

          {/* Text panel */}
          <div className="flex flex-col justify-center px-10 md:px-14 lg:px-20 py-20">
            <span className="font-technical text-[9px] tracking-[0.4em] uppercase mb-8 block" style={{ color: "rgba(220,170,140,0.7)" }}>
              Est. 2021 · Jericho, Ibadan
            </span>
            <blockquote className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight mb-8">
              &ldquo;We didn&rsquo;t open a shop.<br />We opened an archive.&rdquo;
            </blockquote>
            <p className="font-body text-base leading-relaxed mb-10 max-w-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Westside started with a single rack of vintage denim and a belief that great style shouldn&rsquo;t be a luxury reserved for the few. Every piece we carry has a story.
            </p>
            <Link
              href="/about"
              className="font-label text-[11px] tracking-[0.25em] uppercase w-fit pb-0.5 hover:opacity-60 transition-opacity"
              style={{ color: "rgba(220,170,140,0.8)", borderBottom: "1px solid rgba(220,170,140,0.3)" }}
            >
              Read the full story
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-4 md:px-(--spacing-margin-desktop) max-w-(--spacing-container-max) mx-auto">
        <div className="mb-14 text-center">
          <span className="font-technical text-[10px] tracking-[0.3em] text-(--color-secondary) uppercase block mb-3">
            Our Compass
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-(--color-on-surface) tracking-tight">
            Built on Craft &amp; Integrity.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--color-outline-variant)" }}>
          {[
            { icon: "eco", title: "Sustainable", body: "No new production, just new lives for existing garments." },
            { icon: "sell", title: "Affordable", body: "Authentic vintage accessible to everyone — not gatekept." },
            { icon: "verified", title: "Honest", body: "Full transparency on condition. Character is honesty." },
            { icon: "location_on", title: "Local", body: "Rooted in Jericho, Ibadan. Community first." },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="bg-(--color-surface) p-8 md:p-10 flex flex-col gap-5 hover:bg-(--color-surface-container-low) transition-colors group"
            >
              <span className="material-symbols-outlined text-3xl text-(--color-primary) transition-transform duration-300 group-hover:scale-110">
                {icon}
              </span>
              <h3 className="font-label text-[11px] tracking-[0.2em] uppercase text-(--color-on-surface)">
                {title}
              </h3>
              <p className="font-body text-sm text-(--color-on-surface-variant) leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SELL CTA ── */}
      <section className="px-4 md:px-(--spacing-margin-desktop) pb-24 max-w-(--spacing-container-max) mx-auto">
        <div
          className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 p-12 md:p-20"
          style={{ background: "var(--color-primary)" }}
        >
          {/* Decorative circle */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border-[40px] border-white/5 pointer-events-none" />
          <div className="absolute -right-4 -bottom-20 w-48 h-48 rounded-full border-[24px] border-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="font-technical text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-5">
              Sell with Westside
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Got vintage to sell?
            </h2>
            <p className="font-body text-lg text-white/75 leading-relaxed">
              We&rsquo;re always hunting for quality vintage. Turn your wardrobe archives into cash or Westside store credit with a 10% bonus.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/sell"
              className="bg-white px-10 py-5 font-label text-xs tracking-[0.2em] uppercase text-center transition-colors hover:bg-(--color-secondary-fixed)"
              style={{ color: "var(--color-primary)" }}
            >
              Send Us Photos
            </Link>
            <p className="font-technical text-[11px] text-white/40 text-center">
              Response within 48 hours
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
