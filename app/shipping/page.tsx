import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Returns | Westside",
  description: "Everything you need to know about Westside shipping, delivery, and our returns policy.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-[720px] mx-auto px-4 py-16 md:py-24">
      <div className="mb-12">
        <span className="font-technical text-[11px] text-(--color-secondary) uppercase tracking-widest block mb-3">Policies</span>
        <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-4">Shipping &amp; Returns</h1>
        <p className="font-body text-base text-(--color-on-surface-variant)">Last updated: May 2025</p>
      </div>

      <div className="space-y-12 font-body text-base text-(--color-on-surface-variant) leading-relaxed">

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-4">Processing Time</h2>
          <p>All orders are processed within <strong className="text-(--color-on-surface)">1–3 business days</strong> of purchase. Each item is individually inspected, professionally steamed, and carefully packaged before leaving our studio in Jericho, Ibadan.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-6">Delivery Estimates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { zone: "Lagos & Ibadan", time: "1–2 business days", price: "₦1,500" },
              { zone: "Other Nigerian States", time: "2–5 business days", price: "₦2,500" },
              { zone: "West Africa", time: "5–10 business days", price: "₦8,000" },
              { zone: "International", time: "10–21 business days", price: "From ₦15,000" },
            ].map(({ zone, time, price }) => (
              <div key={zone} className="p-5 border border-(--color-outline-variant)/30 bg-(--color-surface-container-low)">
                <p className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-2">{zone}</p>
                <p className="font-headline text-base font-medium text-(--color-on-surface)">{time}</p>
                <p className="font-technical text-[12px] text-(--color-on-surface-variant) mt-1">{price}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-technical text-[12px] text-(--color-on-surface-variant)/70">
            Free shipping on all Nigerian orders above ₦25,000.
          </p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-4">Tracking</h2>
          <p>Once your order ships, you will receive a confirmation email with a tracking number. You can use this to monitor your delivery in real time. If you do not receive an email within 3 business days of ordering, please check your spam folder or <Link href="/contact" className="text-(--color-primary) underline underline-offset-4">contact us</Link>.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-4">Returns Policy</h2>
          <p className="mb-4">Because every item in our collection is unique and one-of-a-kind, we operate a <strong className="text-(--color-on-surface)">final sale policy</strong> on most items. All condition notes and measurements are listed clearly on every product page before purchase.</p>
          <p className="mb-4">However, we will accept returns in the following situations:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>The item received is significantly different from what was described (e.g., wrong item, major undisclosed damage).</li>
            <li>The item arrives damaged in transit.</li>
            <li>You received the wrong size or product.</li>
          </ul>
          <p>To initiate a return for any of the above reasons, please email us at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a> within <strong className="text-(--color-on-surface)">48 hours</strong> of receiving your order. Include your order number and photos of the issue.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-4">Exchanges</h2>
          <p>We do not offer size exchanges as each piece is one-of-a-kind. We encourage you to review the flat measurements on every product page carefully before purchasing. If you are unsure about sizing, email us at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a> and we will help.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-4">Questions?</h2>
          <p>Reach us any time at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a> or call <a href="tel:+2349167194813" className="text-(--color-primary) underline underline-offset-4">+234 916 719 4813</a>. We aim to respond within one business day.</p>
        </section>
      </div>
    </div>
  );
}
