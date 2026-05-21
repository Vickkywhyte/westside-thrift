import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed | Westside" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-(--color-tertiary) rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-3xl text-white">check</span>
        </div>

        <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-4">
          Order Received.
        </h1>
        <p className="font-body text-lg text-(--color-on-surface-variant) mb-3 leading-relaxed">
          Thank you for supporting Westside. Every piece you wear carries a story forward.
        </p>

        {order && (
          <p className="font-technical text-[12px] text-(--color-on-surface-variant) mb-8">
            Order ID: <span className="text-(--color-primary)">{order.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        <div className="bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 p-8 mb-8 text-left">
          <h2 className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-4">What&rsquo;s Next</h2>
          <ul className="flex flex-col gap-3">
            {[
              "We'll review your order and send a confirmation email within 24 hours.",
              "Each item is professionally steamed and packaged in our Bodija studio.",
              "You'll receive a tracking number once your order ships.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="font-technical text-[12px] text-(--color-primary) shrink-0 mt-0.5">0{i + 1}</span>
                <span className="font-body text-base text-(--color-on-surface-variant)">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="bg-(--color-primary) text-white px-8 py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors">
            Continue Shopping
          </Link>
          <Link href="/account" className="border border-(--color-outline) text-(--color-on-surface) px-8 py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-surface-container) transition-colors">
            View Account
          </Link>
        </div>
      </div>
    </div>
  );
}
