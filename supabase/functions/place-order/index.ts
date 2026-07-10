// Edge Function: place-order
// Creates order, applies coin redeem/earn, writes ledger. Works without Razorpay.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type OrderItem = {
  product_slug: string;
  product_name: string;
  size?: string;
  color?: string;
  quantity: number;
  unit_price: number;
  mrp: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const items = (body.items || []) as OrderItem[];
    const paymentMethod = String(body.payment_method || "whatsapp");
    const coinsRedeemed = Math.max(0, Math.floor(Number(body.coins_redeemed || 0)));
    const shippingAddress = body.shipping_address ?? null;
    const couponCode = body.coupon_code ? String(body.coupon_code) : null;
    const notes = body.notes ? String(body.notes) : null;
    const paymentId = body.payment_id ? String(body.payment_id) : null;
    const razorpayOrderId = body.razorpay_order_id
      ? String(body.razorpay_order_id)
      : null;

    if (!items.length) {
      return new Response(JSON.stringify({ error: "Empty cart" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subtotal = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
    const selling = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const discount = Math.max(0, subtotal - selling);
    const platformFee = 5;
    const deliveryCharge = selling >= 499 ? 0 : 40;
    const coinInr = Math.floor(coinsRedeemed * 0.1 * 100) / 100;
    const grandBeforeCoins = Math.max(0, selling + platformFee + deliveryCharge);
    const grandTotal = Math.max(0, grandBeforeCoins - coinInr);
    const coinsEarned = Math.floor(grandTotal * 0.05);

    const { data: ledger } = await admin
      .from("jff_coins_ledger")
      .select("balance_after")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const balance = ledger?.balance_after ?? 0;
    if (coinsRedeemed > balance) {
      return new Response(JSON.stringify({ error: "Insufficient JFF Coins" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderNumber = `JFF-${Date.now().toString(36).toUpperCase()}`;
    const status =
      paymentMethod === "razorpay"
        ? "paid"
        : paymentMethod === "whatsapp"
          ? "whatsapp"
          : "pending";

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status,
        payment_method: paymentMethod,
        payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
        subtotal,
        discount,
        delivery_charge: deliveryCharge,
        platform_fee: platformFee,
        coins_redeemed: coinsRedeemed,
        coins_earned: coinsEarned,
        grand_total: grandTotal,
        coupon_code: couponCode,
        shipping_address: shippingAddress,
        notes,
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: orderError?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_slug: item.product_slug,
        product_name: item.product_name,
        size: item.size ?? null,
        color: item.color ?? null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        mrp: item.mrp,
      }))
    );

    let nextBalance = balance;
    if (coinsRedeemed > 0) {
      nextBalance -= coinsRedeemed;
      await admin.from("jff_coins_ledger").insert({
        user_id: user.id,
        delta: -coinsRedeemed,
        balance_after: nextBalance,
        reason: "order_redeem",
        order_id: order.id,
      });
    }

    if (coinsEarned > 0 && status !== "whatsapp") {
      nextBalance += coinsEarned;
      await admin.from("jff_coins_ledger").insert({
        user_id: user.id,
        delta: coinsEarned,
        balance_after: nextBalance,
        reason: "order_earn",
        order_id: order.id,
      });
    }

    await admin.from("notifications").insert({
      user_id: user.id,
      category: "orders",
      title: `Order ${orderNumber} placed`,
      body:
        paymentMethod === "whatsapp"
          ? "Confirm your order on WhatsApp to complete checkout."
          : `Thanks! You earned ${coinsEarned} JFF Coins.`,
      href: "/account/orders",
    });

    return new Response(
      JSON.stringify({ order, balance: nextBalance }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
