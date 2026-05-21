"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?new=true", label: "New Arrivals" },
  { href: "/shop?max=30", label: "Under $30" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateCart = () => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const cart: Record<string, number> = JSON.parse(stored);
          setCartCount(Object.values(cart).reduce((a, b) => a + b, 0));
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    updateCart();
    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 bg-(--color-surface) border-b border-(--color-outline-variant)/30 transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="flex justify-between items-center px-4 md:px-(--spacing-margin-desktop) py-4 max-w-(--spacing-container-max) mx-auto">
        <Link
          href="/"
          className="font-headline text-2xl font-semibold text-(--color-primary) tracking-tight"
        >
          WESTSIDE
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
            return (
              <Link
                key={href}
                href={href}
                className={`font-technical text-xs tracking-widest uppercase transition-colors duration-200 ${
                  active
                    ? "text-(--color-primary) border-b border-(--color-primary) pb-0.5"
                    : "text-(--color-on-surface-variant) hover:text-(--color-primary)"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>

          <Link
            href={user ? "/account" : "/auth/login"}
            aria-label="Account"
            className="text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-(--color-primary) text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
