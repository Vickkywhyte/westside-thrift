import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  let body: {
    userId?: string | null;
    items: { productId: string; quantity: number; price: number }[];
    total: number;
    shippingAddress: Record<string, string>;
    stripePaymentIntentId: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userId, items, total, shippingAddress, stripePaymentIntentId } = body;

  if (!items?.length || !total || !shippingAddress || !stripePaymentIntentId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = adminClient();

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: userId ?? null,
      total,
      shipping_address: shippingAddress,
      status: "pending",
      stripe_payment_intent_id: stripePaymentIntentId,
    })
    .select()
    .single();

  if (orderErr || !order) {
    console.error("Order insert failed:", orderErr);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
  if (itemsErr) {
    console.error("Order items insert failed:", itemsErr);
  }

  return NextResponse.json({ orderId: order.id });
}
