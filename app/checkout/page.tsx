"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createClient } from "@/lib/supabase/client";
import type { Product, ShippingAddress } from "@/lib/supabase/types";

const stripePromise = loadStripe(
  "pk_test_51TZBFMRXFwg106Achr6vGTdhSShVufUbeDEmBU6zD6R9D5JcSoDbOJ595Nlf2EMIlTUCn3YA07SN3Tt7bc1wDUtN00mKqPEssS"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: "var(--font-work-sans), sans-serif",
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#9c3c24" },
  },
};

interface CartEntry { product: Product; quantity: number; }

const INITIAL_ADDRESS: ShippingAddress = {
  full_name: "", address_line1: "", address_line2: "",
  city: "", state: "", zip: "", country: "NG",
};

function CheckoutForm({ entries, subtotal }: { entries: CartEntry[]; subtotal: number }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [address, setAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);
  const [guestEmail, setGuestEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check auth state on mount — guest checkout allowed if not logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email ?? null);
      }
    });
  }, []);

  const set = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Payment provider not loaded. Please refresh.");
      setLoading(false);
      return;
    }

    if (entries.length === 0) {
      setError("Your cart is empty.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    // Step 1: create PaymentIntent
    const piRes = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: subtotal }),
    });
    const piData = await piRes.json();

    if (!piRes.ok || !piData.clientSecret) {
      setError(piData.error ?? "Failed to initialise payment. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2: charge the card
    const { error: confirmError } = await stripe.confirmCardPayment(piData.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: address.full_name },
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please check your card details.");
      setLoading(false);
      return;
    }

    // Step 3: save order via server-side route (handles both guest + authed, fixes RLS)
    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId ?? null,
        items: entries.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
        })),
        total: subtotal,
        shippingAddress: address,
        stripePaymentIntentId: piData.paymentIntentId,
      }),
    });
    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.orderId) {
      setError("Payment succeeded but order save failed. Please contact hello@westside.com with your payment reference: " + piData.paymentIntentId);
      setLoading(false);
      return;
    }

    // Step 4: notify admin — fire-and-forget
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderData.orderId,
        items: entries.map(({ product, quantity }) => ({
          name: product.name,
          quantity,
          price: product.price,
        })),
        total: subtotal,
        address,
        customerEmail: userEmail ?? guestEmail,
      }),
    }).catch(() => {});

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
    router.push(`/order-confirmation?order=${orderData.orderId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
      {error && (
        <div className="bg-(--color-error-container) text-(--color-on-error-container) font-technical text-[12px] p-4">
          {error}
        </div>
      )}

      {/* Guest banner — shown only when not logged in */}
      {!userId && (
        <div className="flex items-center justify-between gap-4 border border-(--color-outline-variant)/40 bg-(--color-surface-container-low) px-5 py-4">
          <p className="font-technical text-[11px] text-(--color-on-surface-variant) tracking-wide">
            Checking out as guest
          </p>
          <Link
            href="/auth/login?redirect=/checkout"
            className="font-label text-[10px] tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5 hover:opacity-60 transition-opacity shrink-0"
          >
            Sign in instead
          </Link>
        </div>
      )}

      {/* Contact — guests only */}
      {!userId && (
        <div>
          <h2 className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-6">Contact</h2>
          <div className="flex flex-col gap-2">
            <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your@email.com"
              className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
            />
            <p className="font-technical text-[11px] text-(--color-on-surface-variant)/60">Order confirmation will be sent here.</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-6">Shipping Address</h2>
        <div className="grid grid-cols-1 gap-4">
          {([
            { field: "full_name", label: "Full Name", type: "text" },
            { field: "address_line1", label: "Address", type: "text" },
            { field: "address_line2", label: "Apt, Suite, etc. (optional)", type: "text" },
          ] as const).map(({ field, label, type }) => (
            <div key={field} className="flex flex-col gap-2">
              <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">{label}</label>
              <input
                type={type}
                value={address[field]}
                onChange={set(field)}
                required={field !== "address_line2"}
                className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
              />
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4">
            {([
              { field: "city", label: "City" },
              { field: "state", label: "State" },
              { field: "zip", label: "ZIP" },
            ] as const).map(({ field, label }) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">{label}</label>
                <input
                  type="text"
                  value={address[field]}
                  onChange={set(field)}
                  required
                  className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-6">Payment</h2>
        <div className="border border-(--color-outline-variant) bg-white px-4 py-4">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="font-technical text-[11px] text-(--color-on-surface-variant)/60 mt-2">
          Secured by Stripe. We never store your card details.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-(--color-primary) text-white py-5 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors disabled:opacity-60"
      >
        {loading ? "Processing…" : `Pay ₦${subtotal.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem("cart");
        if (!stored) { setLoadingCart(false); return; }
        const cart: Record<string, number> = JSON.parse(stored);
        const ids = Object.keys(cart);
        if (!ids.length) { setLoadingCart(false); return; }

        const supabase = createClient();
        const { data: products } = await supabase.from("products").select("*").in("id", ids);
        if (products) setEntries(products.map((p) => ({ product: p, quantity: cart[p.id] ?? 1 })));
      } catch {}
      setLoadingCart(false);
    };
    init();
  }, []);

  const subtotal = entries.reduce((s, { product, quantity }) => s + product.price * quantity, 0);

  if (loadingCart) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl text-(--color-outline) animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <Elements stripe={stripePromise}>
          <CheckoutForm entries={entries} subtotal={subtotal} />
        </Elements>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-(--color-surface-container-low) border border-(--color-outline-variant)/30 p-8 sticky top-24">
            <h2 className="font-headline text-xl font-medium mb-6">Order Summary</h2>
            <div className="flex flex-col gap-4 divide-y divide-(--color-outline-variant)/30">
              {entries.map(({ product, quantity }) => (
                <div key={product.id} className="pt-4 first:pt-0 flex justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-body text-sm text-(--color-on-surface) leading-snug">{product.name}</p>
                    <p className="font-technical text-[11px] text-(--color-on-surface-variant)">Qty {quantity}</p>
                  </div>
                  <span className="font-technical text-[12px] text-(--color-primary) shrink-0">
                    ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-(--color-outline-variant)/30 mt-6 pt-6 flex justify-between font-headline text-xl font-medium">
              <span>Total</span>
              <span className="text-(--color-primary)">₦{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
