export type ProductStatus = "active" | "inactive";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "order_received" | "processing" | "shipped" | "in_transit" | "delivered";
export type EventName =
  | "PageView"
  | "ViewContent"
  | "ViewItemList"
  | "AddToCart"
  | "ViewCart"
  | "InitiateCheckout"
  | "AddShippingInfo"
  | "AddPaymentInfo"
  | "Purchase"
  | "Refund"
  | "Lead"
  | "Search"
  | "ContactSubmit";

export type BundleOption = {
  id: string;
  label: string;
  quantity: number;
  totalPrice: number;
  badge?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  headline: string;
  subheadline: string;
  price: number;
  compare_at_price: number | null;
  cost_price?: number | null;
  category: string;
  images: string[];
  main_image_url?: string | null;
  gallery_image_urls?: string[] | null;
  lifestyle_image_url?: string | null;
  demo_video_url?: string | null;
  gif_url?: string | null;
  alt_text?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  bundle_options?: BundleOption[] | null;
  related_product_ids?: string[] | null;
  how_it_works?: string[] | null;
  risk_notes?: string | null;
  media_status?: "placeholder" | "supplier-approved" | "original-content";
  benefits: string[];
  details: Record<string, string>;
  faqs: Array<{ question: string; answer: string }>;
  status: ProductStatus;
  supplier_name?: string | null;
  supplier_url?: string | null;
  shipping_estimate: string;
  created_at?: string;
  updated_at?: string;
};

export type CartItem = {
  cart_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  bundle_id?: string;
  bundle_label?: string;
};

export type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type Order = {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  shipping_address: ShippingAddress;
  total_amount: number;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  tracking_code?: string | null;
  supplier_order_id?: string | null;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  created_at?: string;
  updated_at?: string;
};
