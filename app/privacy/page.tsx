import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Westside",
  description: "How Westside collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-4 py-16 md:py-24">
      <div className="mb-12">
        <span className="font-technical text-[11px] text-(--color-secondary) uppercase tracking-widest block mb-3">Legal</span>
        <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-4">Privacy Policy</h1>
        <p className="font-body text-base text-(--color-on-surface-variant)">Last updated: May 2025</p>
      </div>

      <div className="space-y-10 font-body text-base text-(--color-on-surface-variant) leading-relaxed">

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Who We Are</h2>
          <p>Westside (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a curated vintage clothing business based in Bodija, Ibadan, Nigeria. We can be reached at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a> or <a href="tel:+2349167194813" className="text-(--color-primary) underline underline-offset-4">+234 916 719 4813</a>.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Information We Collect</h2>
          <p className="mb-3">We collect information you provide directly when you:</p>
          <ul className="list-disc list-inside space-y-2 mb-3">
            <li>Create an account (name, email address, password)</li>
            <li>Place an order (name, shipping address, order details)</li>
            <li>Submit a sell request (name, email, item descriptions, photos)</li>
            <li>Contact us via email or phone</li>
          </ul>
          <p>We also automatically collect basic usage data such as pages visited and browser type through our hosting infrastructure.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to your enquiries</li>
            <li>To improve our website and product offering</li>
            <li>To prevent fraud and maintain account security</li>
          </ul>
          <p className="mt-3">We do <strong className="text-(--color-on-surface)">not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Data Storage &amp; Security</h2>
          <p>Your data is stored securely using Supabase (hosted on ISO 27001-certified infrastructure). Passwords are encrypted and never stored in plain text. Payment card details are handled exclusively by Stripe and are never stored on our servers.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Cookies</h2>
          <p>We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect site functionality.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent for marketing communications at any time</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a>.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Changes to This Policy</h2>
          <p>We may update this policy from time to time. Significant changes will be communicated via email to registered users. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <div className="border-t border-(--color-outline-variant)/30" />

        <section>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-3">Contact</h2>
          <p>Questions about this policy? Reach us at <a href="mailto:hello@westside.com" className="text-(--color-primary) underline underline-offset-4">hello@westside.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
