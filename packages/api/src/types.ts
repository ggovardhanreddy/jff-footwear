export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  theme: "light" | "dark" | "system";
  language: string;
  delivery_location: string | null;
  delivery_pincode: string | null;
  role?: "customer" | "admin" | "wholesale";
  is_wholesale?: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  payment_method: string;
  payment_id: string | null;
  razorpay_order_id: string | null;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  platform_fee: number;
  coins_redeemed: number;
  coins_earned: number;
  grand_total: number;
  coupon_code: string | null;
  shipping_address: unknown;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CoinLedgerRow = {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  reason: string;
  order_id: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  category: "offers" | "orders" | "rewards" | "recommendations" | "restock";
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  created_at: string;
};

export type PlaceOrderPayload = {
  items: Array<{
    product_slug: string;
    product_name: string;
    size?: string;
    color?: string;
    quantity: number;
    unit_price: number;
    mrp: number;
  }>;
  payment_method: "razorpay" | "cod" | "whatsapp" | "coins";
  coins_redeemed?: number;
  shipping_address?: unknown;
  coupon_code?: string;
  notes?: string;
  payment_id?: string;
  razorpay_order_id?: string;
};
