"use client";

import { useState } from "react";
import type { Product } from "@/lib/supabase/types";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    try {
      const stored = localStorage.getItem("cart");
      const cart: Record<string, number> = stored ? JSON.parse(stored) : {};
      cart[product.id] = (cart[product.id] ?? 0) + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // localStorage unavailable
    }
  };

  if (!product.in_stock) {
    return (
      <button disabled className="w-full bg-(--color-surface-container) text-(--color-on-surface-variant) py-5 font-label text-xs tracking-widest uppercase cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-5 font-label text-xs tracking-widest uppercase transition-all duration-300 shadow-lg ${
        added
          ? "bg-(--color-tertiary) text-white shadow-none"
          : "bg-(--color-primary) text-white hover:bg-(--color-primary-container) shadow-(--color-primary)/10"
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">check</span>
          Added to Cart
        </span>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
