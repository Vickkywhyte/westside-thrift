import type { Metadata } from "next";
import SellForm from "@/components/sell/SellForm";

export const metadata: Metadata = {
  title: "Sell Your Vintage | Westside",
  description: "Turn your closet archives into cash or store credit. We buy 1960s–1990s workwear, military surplus, and collegiate knits.",
};

export default function SellPage() {
  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <span className="font-technical text-[12px] text-(--color-secondary) uppercase tracking-widest block mb-3">
            The Hunt Continues
          </span>
          <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-4">
            Got vintage to sell?
          </h1>
          <p className="font-body text-lg text-(--color-on-surface-variant) leading-relaxed">
            We&rsquo;re always looking for 1960s–1990s workwear, military surplus, denim, and collegiate knits. Send us photos and we&rsquo;ll get back to you within 48 hours with an offer or pass.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "camera_alt", title: "Send Photos", body: "Clear shots of the front, back, label, and any condition notes." },
            { icon: "timer", title: "48hr Response", body: "We review every submission personally. No bots, no algorithms." },
            { icon: "payments", title: "Cash or Credit", body: "Choose cash payout or Westside store credit (10% bonus)." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="p-6 border border-(--color-outline-variant)/30 bg-(--color-surface-container-low) flex flex-col gap-3">
              <span className="material-symbols-outlined text-2xl text-(--color-primary)">{icon}</span>
              <h3 className="font-headline text-base font-medium">{title}</h3>
              <p className="font-body text-sm text-(--color-on-surface-variant)">{body}</p>
            </div>
          ))}
        </div>

        <SellForm />
      </div>
    </div>
  );
}
