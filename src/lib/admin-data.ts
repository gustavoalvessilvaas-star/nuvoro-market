import { seedProducts } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Order, Product } from "@/lib/types";

export type AdminProduct = Product & Record<string, unknown>;
export type AdminOrderItem = {
  id?: string;
  product_id?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  product_snapshot?: Record<string, unknown> | null;
};
export type AdminOrder = Order & {
  order_items?: AdminOrderItem[];
} & Record<string, unknown>;
export type AdminEvent = {
  id: string;
  event_name: string;
  product_id?: string | null;
  order_id?: string | null;
  customer_email?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
} & Record<string, unknown>;
export type AdminSupplier = {
  id: string;
  name: string;
  platform?: string | null;
  supplier_url?: string | null;
  backup_supplier_url?: string | null;
  product_cost?: number | null;
  shipping_cost?: number | null;
  total_estimated_cost?: number | null;
  estimated_delivery_days_min?: number | null;
  estimated_delivery_days_max?: number | null;
  warehouse_location?: string | null;
  tracking_available?: boolean | null;
  tracking_quality?: string | null;
  return_policy_notes?: string | null;
  product_quality_score?: number | null;
  sample_ordered?: boolean | null;
  sample_received?: boolean | null;
  sample_approved?: boolean | null;
  observations?: string | null;
  compliance_notes?: string | null;
  active?: boolean | null;
  product_id?: string | null;
} & Record<string, unknown>;
export type AdminValidationCandidate = {
  id: string;
  product_name?: string | null;
  product_idea?: string | null;
  category?: string | null;
  product_url?: string | null;
  supplier_url?: string | null;
  backup_supplier_url?: string | null;
  estimated_product_cost?: number | null;
  estimated_shipping_cost?: number | null;
  estimated_selling_price?: number | null;
  demand_score?: number | null;
  wow_factor_score?: number | null;
  margin_score?: number | null;
  logistics_risk_score?: number | null;
  logistics_risk?: number | null;
  compliance_risk_score?: number | null;
  compliance_risk?: number | null;
  supplier_confidence_score?: number | null;
  supplier_confidence?: number | null;
  creative_potential_score?: number | null;
  creative_potential?: number | null;
  total_score?: number | null;
  status?: string | null;
  notes?: string | null;
} & Record<string, unknown>;

export type ProductMetric = {
  product: AdminProduct;
  product_views: number;
  add_to_cart_count: number;
  checkout_count: number;
  purchase_count: number;
  view_to_cart_rate: number;
  cart_to_checkout_rate: number;
  checkout_to_purchase_rate: number;
  estimated_revenue: number;
  estimated_cost: number;
  estimated_profit: number;
  estimated_margin_percent: number | null;
  decision: string;
};

type DashboardMetricSummary = {
  revenue: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  refundedOrders: number;
  eventCount: number;
  topViewedProducts: AdminEvent[];
  topAddedProducts: AdminEvent[];
  productMetrics: ProductMetric[];
  mostViewedProduct: ProductMetric | null;
  mostAddedProduct: ProductMetric | null;
  mostCheckoutProduct: ProductMetric | null;
  mostPurchasedProduct: ProductMetric | null;
  worstMarginProduct: ProductMetric | null;
  paidTestProduct: ProductMetric | null;
  conversionFunnel: {
    productViews: number;
    addToCart: number;
    checkoutStarted: number;
    purchases: number;
    viewToCartRate: number;
    cartToCheckoutRate: number;
    checkoutToPurchaseRate: number;
  };
  operationalAlerts: Array<{ label: string; count: number; href: string; tone: "danger" | "warning" | "info" }>;
};

function toNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function isAfter(value: unknown, date: Date) {
  if (!value) return false;
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) && parsed >= date;
}

function normalizeEventName(eventName: string) {
  const map: Record<string, string> = {
    PageView: "page_view",
    ViewContent: "view_item",
    ViewItemList: "view_item_list",
    AddToCart: "add_to_cart",
    ViewCart: "view_cart",
    InitiateCheckout: "begin_checkout",
    AddShippingInfo: "add_shipping_info",
    AddPaymentInfo: "add_payment_info",
    Purchase: "purchase",
    Refund: "refund",
    Lead: "generate_lead",
    Search: "search",
    ContactSubmit: "contact_submit"
  };
  return map[eventName] || eventName;
}

function eventProductId(event: AdminEvent) {
  return String(event.product_id || event.metadata?.product_id || "");
}

export function calculateMargin(product: Pick<AdminProduct, "price" | "cost_price" | "shipping_cost" | "estimated_margin_percent">) {
  const price = toNumber(product.price);
  const cost = toNumber(product.cost_price);
  const shipping = toNumber(product.shipping_cost);
  const estimatedTotalCost = cost + shipping;
  const estimatedMarginAmount = price - estimatedTotalCost;
  const estimatedMarginPercent = price > 0 ? (estimatedMarginAmount / price) * 100 : null;

  return {
    estimatedTotalCost,
    estimatedMarginAmount,
    estimatedMarginPercent: product.estimated_margin_percent != null ? toNumber(product.estimated_margin_percent) : estimatedMarginPercent
  };
}

export function marginLabel(percent: number | null) {
  if (percent == null) return "Missing cost";
  if (percent < 40) return "Bad margin";
  if (percent < 55) return "Risky";
  if (percent < 70) return "Acceptable";
  return "Strong";
}

function rate(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function pickHighest(metrics: ProductMetric[], key: keyof ProductMetric) {
  const rows = metrics.filter((metric) => toNumber(metric[key]) > 0);
  if (!rows.length) return null;
  return [...rows].sort((a, b) => toNumber(b[key]) - toNumber(a[key]))[0];
}

function productCost(product: AdminProduct) {
  const margin = calculateMargin(product);
  return margin.estimatedTotalCost;
}

function productWarnings(product: AdminProduct) {
  const margin = calculateMargin(product);
  const warnings = [];
  if (!product.cost_price) warnings.push("Missing cost price");
  if (!product.supplier_url) warnings.push("Missing supplier link");
  if (!product.backup_supplier_url) warnings.push("No backup supplier");
  if (product.media_status === "placeholder") warnings.push("Placeholder media");
  if (margin.estimatedMarginPercent != null && margin.estimatedMarginPercent < 55) warnings.push("Low margin");
  return warnings;
}

function buildProductMetrics(products: AdminProduct[], orders: AdminOrder[], events: AdminEvent[]) {
  const paidOrders = orders.filter((order) => order.payment_status === "paid");

  return products.map((product) => {
    const productEvents = events.filter((event) => eventProductId(event) === product.id);
    const countEvent = (name: string) => productEvents.filter((event) => normalizeEventName(event.event_name) === name).length;
    const product_views = countEvent("view_item");
    const add_to_cart_count = countEvent("add_to_cart");
    const checkout_count = countEvent("begin_checkout");
    let purchase_count = countEvent("purchase");
    let estimated_revenue = 0;
    let purchasedQuantity = 0;

    for (const order of paidOrders) {
      for (const item of order.order_items || []) {
        const snapshotId = item.product_snapshot?.id ? String(item.product_snapshot.id) : "";
        if (item.product_id === product.id || snapshotId === product.id) {
          const quantity = toNumber(item.quantity || 1);
          purchasedQuantity += quantity;
          estimated_revenue += quantity * toNumber(item.unit_price || product.price);
        }
      }
    }

    purchase_count = Math.max(purchase_count, purchasedQuantity);
    const estimated_cost = purchasedQuantity * productCost(product);
    const estimated_profit = estimated_revenue - estimated_cost;
    const margin = calculateMargin(product).estimatedMarginPercent;
    const view_to_cart_rate = rate(add_to_cart_count, product_views);
    const cart_to_checkout_rate = rate(checkout_count, add_to_cart_count);
    const checkout_to_purchase_rate = rate(purchase_count, checkout_count);
    let decision = "Pause for now";

    if (margin != null && margin < 55) decision = "Low margin";
    else if (product_views >= 20 && add_to_cart_count <= 1) decision = "Needs better product page";
    else if (add_to_cart_count >= 5 && checkout_count <= 1) decision = "Needs better creative";
    else if (checkout_count >= 3 && purchase_count === 0) decision = "High interest, low conversion";
    else if (product_views >= 10 && add_to_cart_count >= 3 && margin != null && margin >= 55) decision = "Ready for paid test";
    else if (purchase_count > 0 && margin != null && margin >= 55) decision = "Potential winner";

    return {
      product,
      product_views,
      add_to_cart_count,
      checkout_count,
      purchase_count,
      view_to_cart_rate,
      cart_to_checkout_rate,
      checkout_to_purchase_rate,
      estimated_revenue,
      estimated_cost,
      estimated_profit,
      estimated_margin_percent: margin,
      decision
    };
  });
}

function buildMetrics(products: AdminProduct[], orders: AdminOrder[], events: AdminEvent[], suppliers: AdminSupplier[]): DashboardMetricSummary {
  const paidOrders = orders.filter((order) => order.payment_status === "paid");
  const refundedOrders = orders.filter((order) => order.payment_status === "refunded" || order.payment_status === "partially_refunded");
  const revenueFor = (rows: AdminOrder[]) => rows.filter((order) => order.payment_status === "paid").reduce((sum, order) => sum + toNumber(order.total_amount), 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const productMetrics = buildProductMetrics(products, orders, events);
  const productViews = events.filter((event) => normalizeEventName(event.event_name) === "view_item").length;
  const addToCart = events.filter((event) => normalizeEventName(event.event_name) === "add_to_cart").length;
  const checkoutStarted = events.filter((event) => normalizeEventName(event.event_name) === "begin_checkout").length;
  const purchases = Math.max(events.filter((event) => normalizeEventName(event.event_name) === "purchase").length, paidOrders.length);

  const alerts = [
    {
      label: "Paid orders not fulfilled",
      count: paidOrders.filter((order) => !["shipped", "in_transit", "delivered"].includes(String(order.fulfillment_status))).length,
      href: "/admin/orders?payment_status=paid",
      tone: "danger" as const
    },
    {
      label: "Orders without tracking",
      count: paidOrders.filter((order) => !order.tracking_code).length,
      href: "/admin/orders?needs_tracking=1",
      tone: "warning" as const
    },
    {
      label: "Products without supplier link",
      count: products.filter((product) => !product.supplier_url).length,
      href: "/admin/products?supplier=missing",
      tone: "warning" as const
    },
    {
      label: "Products missing cost price",
      count: products.filter((product) => !product.cost_price).length,
      href: "/admin/products?cost=missing",
      tone: "warning" as const
    },
    {
      label: "Products with placeholder images",
      count: products.filter((product) => product.media_status === "placeholder").length,
      href: "/admin/products?media=placeholder",
      tone: "info" as const
    },
    {
      label: "Products below 55% margin",
      count: products.filter((product) => {
        const margin = calculateMargin(product).estimatedMarginPercent;
        return margin != null && margin < 55;
      }).length,
      href: "/admin/products?margin=low",
      tone: "danger" as const
    },
    {
      label: "Suppliers without backup",
      count: suppliers.filter((supplier) => !supplier.backup_supplier_url).length,
      href: "/admin/suppliers?backup=missing",
      tone: "warning" as const
    },
    {
      label: "Samples not purchased yet",
      count: suppliers.filter((supplier) => !supplier.sample_ordered).length,
      href: "/admin/suppliers?sample=missing",
      tone: "info" as const
    }
  ];

  return {
    revenue: revenueFor(orders),
    totalRevenue: revenueFor(orders),
    revenueToday: revenueFor(orders.filter((order) => isAfter(order.created_at, today))),
    revenueThisWeek: revenueFor(orders.filter((order) => isAfter(order.created_at, daysAgo(7)))),
    revenueThisMonth: revenueFor(orders.filter((order) => isAfter(order.created_at, daysAgo(30)))),
    totalOrders: orders.length,
    paidOrders: paidOrders.length,
    pendingOrders: orders.filter((order) => order.payment_status === "pending").length,
    shippedOrders: orders.filter((order) => order.fulfillment_status === "shipped" || order.fulfillment_status === "in_transit").length,
    deliveredOrders: orders.filter((order) => order.fulfillment_status === "delivered").length,
    refundedOrders: refundedOrders.length,
    eventCount: events.length,
    topViewedProducts: events.filter((event) => normalizeEventName(event.event_name) === "view_item").slice(0, 5),
    topAddedProducts: events.filter((event) => normalizeEventName(event.event_name) === "add_to_cart").slice(0, 5),
    productMetrics,
    mostViewedProduct: pickHighest(productMetrics, "product_views"),
    mostAddedProduct: pickHighest(productMetrics, "add_to_cart_count"),
    mostCheckoutProduct: pickHighest(productMetrics, "checkout_count"),
    mostPurchasedProduct: pickHighest(productMetrics, "purchase_count"),
    worstMarginProduct: [...productMetrics].filter((metric) => metric.estimated_margin_percent != null).sort((a, b) => toNumber(a.estimated_margin_percent) - toNumber(b.estimated_margin_percent))[0] || null,
    paidTestProduct: productMetrics.find((metric) => metric.decision === "Ready for paid test") || null,
    conversionFunnel: {
      productViews,
      addToCart,
      checkoutStarted,
      purchases,
      viewToCartRate: rate(addToCart, productViews),
      cartToCheckoutRate: rate(checkoutStarted, addToCart),
      checkoutToPurchaseRate: rate(purchases, checkoutStarted)
    },
    operationalAlerts: alerts
  };
}

async function readOrdersWithItems(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  const withItems = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (!withItems.error) return (withItems.data || []) as AdminOrder[];
  const plain = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  return (plain.data || []) as AdminOrder[];
}

export function getProductWarnings(product: AdminProduct) {
  return productWarnings(product);
}

export async function getAdminDashboard() {
  const supabase = getSupabaseAdmin();
  const fallbackProducts = seedProducts as AdminProduct[];

  if (!supabase) {
    return {
      products: fallbackProducts,
      orders: [] as AdminOrder[],
      customers: [],
      events: [] as AdminEvent[],
      supportRequests: [],
      suppliers: [] as AdminSupplier[],
      validationCandidates: [] as AdminValidationCandidate[],
      settings: [],
      metrics: buildMetrics(fallbackProducts, [], [], [])
    };
  }

  const [productsResult, orders, customersResult, eventsResult, supportResult, suppliersResult, validationResult, legacyValidationResult, settingsResult] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    readOrdersWithItems(supabase),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("suppliers").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("product_validation").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("product_validation_candidates").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("store_settings").select("*").order("key", { ascending: true })
  ]);

  const products = ((productsResult.data || fallbackProducts) as AdminProduct[]).map((product) => {
    const margin = calculateMargin(product);
    return {
      ...product,
      estimated_total_cost: product.estimated_total_cost ?? margin.estimatedTotalCost,
      estimated_margin_amount: product.estimated_margin_amount ?? margin.estimatedMarginAmount,
      estimated_margin_percent: product.estimated_margin_percent ?? margin.estimatedMarginPercent
    };
  });
  const orderRows = orders || [];
  const eventRows = (eventsResult.data || []) as AdminEvent[];
  const supplierRows = (suppliersResult.data || []) as AdminSupplier[];
  const validationRows = ((validationResult.data?.length ? validationResult.data : legacyValidationResult.data) || []) as AdminValidationCandidate[];

  return {
    products,
    orders: orderRows,
    customers: customersResult.data || [],
    events: eventRows,
    supportRequests: supportResult.data || [],
    suppliers: supplierRows,
    validationCandidates: validationRows,
    settings: settingsResult.data || [],
    metrics: buildMetrics(products, orderRows, eventRows, supplierRows)
  };
}
