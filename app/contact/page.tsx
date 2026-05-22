import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Westside",
  description: "Get in touch with the Westside team. We're based in Jericho, Ibadan.",
};

export default function ContactPage() {
  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-16 md:py-24">
      <div className="max-w-4xl">
        <div className="mb-16">
          <span className="font-technical text-[11px] text-(--color-secondary) uppercase tracking-widest block mb-3">
            Get in Touch
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-medium text-(--color-on-surface) mb-4">
            We&rsquo;d love to hear from you.
          </h1>
          <p className="font-body text-lg text-(--color-on-surface-variant) max-w-xl leading-relaxed">
            Whether it&rsquo;s a question about an item, a wholesale enquiry, or you just want to talk vintage — we&rsquo;re here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact details */}
          <div className="flex flex-col gap-8">
            {[
              {
                icon: "mail",
                label: "Email",
                value: "hello@westside.com",
                href: "mailto:hello@westside.com",
                note: "We respond within 24–48 hours",
              },
              {
                icon: "call",
                label: "Phone / WhatsApp",
                value: "+234 916 719 4813",
                href: "tel:+2349167194813",
                note: "Mon–Sat, 9am–6pm WAT",
              },
              {
                icon: "location_on",
                label: "Studio Address",
                value: "Adepate Abebi Crescent,\nIdishin, Jericho, Ibadan\nOyo State, Nigeria",
                href: null,
                note: "By appointment only",
              },
            ].map(({ icon, label, value, href, note }) => (
              <div key={label} className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl text-(--color-primary)">{icon}</span>
                </div>
                <div>
                  <p className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="font-headline text-lg font-medium text-(--color-on-surface) hover:text-(--color-primary) transition-colors block">
                      {value}
                    </a>
                  ) : (
                    <p className="font-headline text-lg font-medium text-(--color-on-surface) whitespace-pre-line">{value}</p>
                  )}
                  <p className="font-technical text-[12px] text-(--color-on-surface-variant) mt-1">{note}</p>
                </div>
              </div>
            ))}

            {/* Response time note */}
            <div className="p-6 bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 border-l-2 border-l-(--color-primary)">
              <p className="font-body text-base text-(--color-on-surface-variant) leading-relaxed">
                <strong className="text-(--color-on-surface)">For sell submissions</strong>, please use our dedicated{" "}
                <a href="/sell" className="text-(--color-primary) underline underline-offset-4">Sell page</a>{" "}
                so we can review your photos and items properly.
              </p>
            </div>
          </div>

          {/* Inline contact form */}
          <div>
            <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-6">Send a Message</h2>
            <form
              action={`mailto:hello@westside.com`}
              method="get"
              encType="text/plain"
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
                  placeholder="Full name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
                  placeholder="What&rsquo;s this about?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Message</label>
                <textarea
                  name="body"
                  required
                  rows={5}
                  className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors resize-none"
                  placeholder="Tell us what you need..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-(--color-primary) text-white py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors"
              >
                Send Message
              </button>

              <p className="font-technical text-[11px] text-(--color-on-surface-variant)/60 text-center">
                This will open your email client. Or email us directly at hello@westside.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
