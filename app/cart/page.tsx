"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/types";

interface CartEntry {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("cart");
      if (!stored) { setEntries([]); setLoading(false); return; }

      const cart: Record<string, number> = JSON.parse(stored);
      const ids = Object.keys(cart);
      if (ids.length === 0) { setEntries([]); setLoading(false); return; }

      const supabase = createClient();
      const { data: products } = await supabase.from("products").select("*").in("id", ids);

      if (products) {
        setEntries(products.map((p) => ({ product: p, quantity: cart[p.id] ?? 1 })));
      }
    } catch {
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadCart(); }, []);

  const updateQty = (productId: string, delta: number) => {
    try {
      const stored = localStorage.getItem("cart");
      const cart: Record<string, number> = stored ? JSON.parse(stored) : {};
      const next = (cart[productId] ?? 0) + delta;
      if (next <= 0) {
        delete cart[productId];
      } else {
        cart[productId] = next;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      loadCart();
    } catch {}
  };

  const remove = (productId: string) => updateQty(productId, -99);

  const subtotal = entries.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-(--color-outline) animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-10">Your Cart</h1>

      {entries.length === 0 ? (
        <div className="py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-(--color-outline) block mb-4">shopping_bag</span>
          <p className="font-headline text-xl text-(--color-on-surface-variant) mb-2">Your cart is empty.</p>
          <p className="font-body text-base text-(--color-on-surface-variant) mb-8">The archive awaits.</p>
          <Link href="/shop" className="bg-(--color-primary) text-white px-8 py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors">
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Line items */}
          <div className="flex-1 flex flex-col divide-y divide-(--color-outline-variant)/30">
            {entries.map(({ product, quantity }) => (
              <div key={product.id} className="py-6 flex gap-5">
                <Link href={`/shop/${product.slug}`} className="w-24 h-24 shrink-0 bg-(--color-surface-container-low) overflow-hidden border border-(--color-outline-variant)/30">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-(--color-outline)">hanger</span>
                    </div>
                  )}
                </Link>

                <div className="flex-1 flex flex-col gap-2">
                  <Link href={`/shop/${product.slug}`} className="font-headline text-lg font-medium text-(--color-on-surface) hover:text-(--color-primary) transition-colors leading-snug">
                    {product.name}
                  </Link>
                  {product.era && (
                    <span className="font-technical text-[12px] text-(--color-on-surface-variant)">{product.era}</span>
                  )}

                  <div className="flex items-center gap-3 mt-1">
                    <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 border border-(--color-outline-variant) flex items-center justify-center hover:bg-(--color-surface-container) transition-colors">
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-technical text-[13px] w-4 text-center">{quantity}</span>
                    <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 border border-(--color-outline-variant) flex items-center justify-center hover:bg-(--color-surface-container) transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                    <button onClick={() => remove(product.id)} className="ml-2 font-technical text-[12px] text-(--color-on-surface-variant) hover:text-(--color-error) transition-colors">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="font-label text-xs tracking-widest text-(--color-primary) shrink-0">
                  ₦{(product.price * quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 p-8 flex flex-col gap-5 sticky top-24">
              <h2 className="font-headline text-xl font-medium">Order Summary</h2>
              <div className="flex justify-between font-body text-base text-(--color-on-surface-variant)">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-base text-(--color-on-surface-variant)">
                <span>Shipping</span>
                <span className="font-technical text-[12px] text-(--color-secondary)">Calculated at checkout</span>
              </div>
              <div className="border-t border-(--color-outline-variant)/30 pt-4 flex justify-between font-headline text-xl font-medium">
                <span>Total</span>
                <span className="text-(--color-primary)">₦{subtotal.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="w-full bg-(--color-primary) text-white py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors text-center block mt-2">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="font-technical text-[12px] text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors text-center">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
