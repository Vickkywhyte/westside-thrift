import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Account | Westside" };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-(--color-secondary-container) text-(--color-on-secondary-container)",
  confirmed: "bg-(--color-tertiary-fixed) text-(--color-on-tertiary-fixed-variant)",
  shipped: "bg-(--color-primary-fixed) text-(--color-on-primary-fixed-variant)",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-(--color-error-container) text-(--color-on-error-container)",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/account");

  const [profileResult, ordersResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("orders").select("*, order_items(*, product:products(name, images, slug))").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
  ]);
  const profile = profileResult.data as { id: string; full_name: string | null; email: string | null } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders = ordersResult.data as any[] | null;

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-4 md:px-(--spacing-margin-desktop) py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="font-headline text-4xl font-medium text-(--color-on-surface)">
            {profile?.full_name ? `Hey, ${profile.full_name.split(" ")[0]}.` : "My Account"}
          </h1>
          <p className="font-technical text-[12px] text-(--color-on-surface-variant) mt-1">{user.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant) hover:text-(--color-error) transition-colors border border-(--color-outline-variant)/50 px-5 py-3">
            Sign Out
          </button>
        </form>
      </div>

      {/* Orders */}
      <section>
        <h2 className="font-label text-xs tracking-widest uppercase text-(--color-primary) mb-6">Order History</h2>

        {orders && orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-(--color-outline-variant)/30 bg-(--color-surface-container-low) p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <p className="font-technical text-[12px] text-(--color-on-surface-variant)">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-technical text-[12px] text-(--color-on-surface-variant) mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-technical text-[11px] px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                    <span className="font-label text-xs tracking-widest text-(--color-primary)">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <div className="flex gap-3 flex-wrap">
                  {(order.order_items as any[])?.slice(0, 4).map((item: any) => (
                    <Link key={item.id} href={`/shop/${item.product?.slug ?? ""}`} className="w-14 h-14 bg-(--color-surface-container) border border-(--color-outline-variant)/30 overflow-hidden shrink-0">
                      {item.product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-(--color-outline)">hanger</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-(--color-outline-variant)/30">
            <span className="material-symbols-outlined text-4xl text-(--color-outline) block mb-3">receipt_long</span>
            <p className="font-headline text-lg text-(--color-on-surface-variant) mb-2">No orders yet.</p>
            <Link href="/shop" className="font-label text-xs tracking-widest uppercase text-(--color-primary) border-b border-(--color-primary) pb-0.5">
              Start shopping
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
