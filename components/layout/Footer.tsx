import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-16 bg-(--color-surface-container) border-t border-(--color-outline-variant)/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-(--spacing-margin-desktop) py-16 max-w-(--spacing-container-max) mx-auto">
        <div className="flex flex-col gap-4">
          <div className="font-headline text-2xl font-semibold text-(--color-on-surface)">WESTSIDE</div>
          <p className="font-body text-base text-(--color-on-surface-variant) leading-relaxed">
            Curated vintage for the modern wardrobe. Based in Jericho, Ibadan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-1">Shop</span>
          {[
            { href: "/shop", label: "New Arrivals" },
            { href: "/shop?category=Outerwear", label: "Tops & Jackets" },
            { href: "/shop?category=Denim", label: "Denim" },
            { href: "/shop?category=Accessories", label: "Accessories" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="font-body text-base text-(--color-on-surface-variant) hover:text-(--color-secondary) transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-1">Support</span>
          {[
            { href: "/shipping", label: "Shipping & Returns" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link key={label} href={href} className="font-body text-base text-(--color-on-surface-variant) hover:text-(--color-secondary) transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-1">Visit</span>
          <p className="font-body text-base text-(--color-on-surface-variant)">
            Adepate Abebi Crescent,<br />
            Idishin, Jericho, Ibadan<br />
            Oyo State, Nigeria
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <a href="mailto:hello@westside.com" className="font-technical text-[12px] text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">
              hello@westside.com
            </a>
            <a href="tel:+2349167194813" className="font-technical text-[12px] text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">
              +234 916 719 4813
            </a>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-(--spacing-margin-desktop) py-6 border-t border-(--color-outline-variant)/20 max-w-(--spacing-container-max) mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="font-technical text-[13px] text-(--color-on-surface-variant)/60">
          © {new Date().getFullYear()} Westside. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/shipping" className="font-technical text-[12px] text-(--color-on-surface-variant)/60 hover:text-(--color-primary) transition-colors">Shipping & Returns</Link>
          <Link href="/privacy" className="font-technical text-[12px] text-(--color-on-surface-variant)/60 hover:text-(--color-primary) transition-colors">Privacy</Link>
          <Link href="/contact" className="font-technical text-[12px] text-(--color-on-surface-variant)/60 hover:text-(--color-primary) transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
