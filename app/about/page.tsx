import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Westside",
  description: "How Westside became Ibadan's go-to curated vintage destination.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0 bg-(--color-surface-container-high)">
          <div className="absolute inset-0 bg-gradient-to-t from-(--color-on-surface)/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 px-4 md:px-(--spacing-margin-desktop) pb-12 max-w-(--spacing-container-max) mx-auto w-full">
          <p className="font-technical text-[12px] text-(--color-secondary-fixed) mb-3 uppercase tracking-widest">
            Est. 2021 • Jericho, Ibadan
          </p>
          <h1 className="font-display text-[42px] md:text-[56px] font-semibold text-(--color-surface-bright) leading-none tracking-tight">
            One vision. <br />
            One wardrobe. <br />
            Westside.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-(--color-surface)">
        <div className="max-w-[720px] mx-auto px-4 md:px-0">
          <div className="flex flex-col gap-12">
            <div className="border-l-2 border-(--color-primary) pl-8 py-2">
              <p className="font-headline text-2xl italic text-(--color-on-surface-variant) leading-relaxed">
                &ldquo;Westside started with a single rack of vintage denim and a belief that great style shouldn&rsquo;t be a luxury reserved for the few.&rdquo;
              </p>
            </div>

            <div className="space-y-8 font-body text-lg text-(--color-on-surface-variant) leading-relaxed">
              <p>
                It began in a small studio on the west side of Ibadan. The mission was simple but ambitious: find garments built to last, pieces with real character, and return them to the people who would love them most. In an era of fast fashion, we chose to look backward to find the path forward.
              </p>
              <p>
                We spent weekends hunting through markets, estates, and forgotten wardrobes across Nigeria and beyond. We weren&rsquo;t just looking for clothes — we were looking for stories. Every worn-in leather jacket and faded band tee carries the DNA of its previous life: the places it traveled, the moments it witnessed.
              </p>
              <p>
                Today, Westside has grown beyond that first rack, but the spirit remains unchanged. We curate for the person who values character over trends, who wants to dress with intention and stand out without trying. We believe in the thrill of the find, the feel of real fabric, and the honest beauty of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 md:px-(--spacing-margin-desktop) max-w-(--spacing-container-max) mx-auto border-t border-(--color-outline-variant)/30">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="font-technical text-[12px] text-(--color-secondary) uppercase tracking-widest block mb-2">Our Compass</span>
            <h2 className="font-headline text-3xl font-medium text-(--color-on-surface)">Built on Craft &amp; Integrity</h2>
          </div>
          <p className="font-body text-base text-(--color-on-surface-variant) max-w-sm">
            How we operate, from the first hunt to the final stitch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "eco", title: "Sustainable", body: "Extending the lifecycle of existing garments is the purest form of environmentalism. No new production, just new lives." },
            { icon: "sell", title: "Affordable", body: "Great vintage shouldn't be gatekept. We keep our margins honest so authentic pieces stay accessible to everyone." },
            { icon: "verified", title: "Honest", body: "Full transparency on condition. If it has a pinhole or a faint stain, we'll show you. Character is honesty." },
            { icon: "location_on", title: "Local", body: "Rooted in Jericho, Ibadan. We support our community at every step and source thoughtfully across Nigeria." },
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

      {/* CTA */}
      <section className="px-4 md:px-(--spacing-margin-desktop) pb-24 max-w-(--spacing-container-max) mx-auto">
        <div className="bg-(--color-primary) p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 border-[20px] border-white/10 rounded-full" />
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Got vintage to sell?
            </h2>
            <p className="font-body text-lg text-white/90 leading-relaxed">
              We&rsquo;re always looking for quality vintage pieces with character. Turn your wardrobe archives into cash or store credit.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto shrink-0">
            <Link href="/sell" className="bg-white text-(--color-primary) px-10 py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-secondary-fixed) transition-colors text-center">
              Send Us Photos
            </Link>
            <p className="font-technical text-[12px] text-white/70 text-center">Response within 48 hours</p>
          </div>
        </div>
      </section>
    </>
  );
}
