import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface NotifyOrderPayload {
  orderId: string;
  items: OrderItem[];
  total: number;
  address: ShippingAddress;
  customerEmail?: string;
}

function buildEmailHtml(payload: NotifyOrderPayload): string {
  const { orderId, items, total, address, customerEmail } = payload;
  const shortId = orderId.slice(0, 8).toUpperCase();
  const formattedTotal = `₦${Number(total).toLocaleString()}`;
  const now = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "full",
    timeStyle: "short",
  });

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;font-family:'Georgia',serif;font-size:14px;color:#3a2a1a;">
          ${item.name}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;text-align:center;font-family:monospace;font-size:13px;color:#7c5800;">
          ×${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;text-align:right;font-family:monospace;font-size:13px;color:#9c3c24;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const addressLines = [
    address.full_name,
    address.address_line1,
    address.address_line2,
    `${address.city}, ${address.state} ${address.zip}`,
    address.country,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#fef9f1;font-family:'Georgia',serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e8ddd4;">

    <!-- Header -->
    <div style="background:#9c3c24;padding:28px 32px;">
      <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.6);">
        New Order · Westside
      </p>
      <h1 style="margin:6px 0 0;font-family:'Georgia',serif;font-size:26px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">
        Order #${shortId}
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 24px;font-family:monospace;font-size:11px;color:#9c3c24;letter-spacing:0.2em;text-transform:uppercase;">
        ${now}
      </p>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7c5800;padding-bottom:8px;border-bottom:2px solid #9c3c24;">Item</th>
            <th style="text-align:center;font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7c5800;padding-bottom:8px;border-bottom:2px solid #9c3c24;">Qty</th>
            <th style="text-align:right;font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7c5800;padding-bottom:8px;border-bottom:2px solid #9c3c24;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Total -->
      <div style="background:#fef9f1;border-left:3px solid #9c3c24;padding:14px 18px;margin-bottom:28px;display:flex;justify-content:space-between;">
        <span style="font-family:monospace;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#7c5800;">Order Total</span>
        <span style="font-family:monospace;font-size:18px;font-weight:700;color:#9c3c24;">${formattedTotal}</span>
      </div>

      <!-- Ship to -->
      <div style="margin-bottom:28px;">
        <p style="margin:0 0 8px;font-family:monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#7c5800;">Ship To</p>
        <p style="margin:0;font-size:14px;color:#3a2a1a;line-height:1.7;">${addressLines}</p>
      </div>

      ${customerEmail ? `
      <!-- Customer email -->
      <div style="margin-bottom:28px;">
        <p style="margin:0 0 8px;font-family:monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#7c5800;">Customer Email</p>
        <p style="margin:0;font-size:14px;color:#3a2a1a;">${customerEmail}</p>
      </div>` : ""}

      <!-- CTA -->
      <a href="https://supabase.com/dashboard/project/wluauqcvwpkuxqtpuxib/editor"
         style="display:block;text-align:center;background:#9c3c24;color:#ffffff;padding:14px;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;margin-bottom:8px;">
        View in Supabase →
      </a>
      <p style="margin:8px 0 0;text-align:center;font-family:monospace;font-size:10px;color:#9c8070;">
        Full Order ID: ${orderId}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#fef9f1;border-top:1px solid #e8ddd4;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b0a090;">
        Westside · Jericho, Ibadan · hello@westside.com
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  let payload: NotifyOrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.orderId || !payload.items || !payload.total || !payload.address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Westside Orders <onboarding@resend.dev>",
      to: "victorthesis80@gmail.com",
      subject: `New Order #${payload.orderId.slice(0, 8).toUpperCase()} — ₦${Number(payload.total).toLocaleString()}`,
      html: buildEmailHtml(payload),
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Order notification email failed:", err);
    // Don't fail the checkout — log and move on
    return NextResponse.json({ sent: false, error: "Email delivery failed" }, { status: 500 });
  }
}
