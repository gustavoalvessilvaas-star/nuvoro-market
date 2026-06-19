import { getSupabaseAdmin } from "@/lib/supabase/server";
import { seedProducts } from "@/lib/products";

export async function getAdminDashboard() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      products: seedProducts,
      orders: [],
      customers: [],
      events: [],
      supportRequests: [],
      suppliers: [],
      validationCandidates: [],
      metrics: { revenue: 0, totalOrders: 0, pendingOrders: 0, shippedOrders: 0, deliveredOrders: 0, refundedOrders: 0, eventCount: 0, topViewedProducts: [], topAddedProducts: [] }
    };
  }
  const [{ data: products }, { data: orders }, { data: customers }, { data: events }, supportResult, suppliersResult, validationResult] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("suppliers").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("product_validation_candidates").select("*").order("created_at", { ascending: false }).limit(100)
  ]);
  const orderRows = orders || [];
  const eventRows = events || [];
  const topViewedProducts = eventRows.filter((event) => event.event_name === "ViewContent").slice(0, 5);
  const topAddedProducts = eventRows.filter((event) => event.event_name === "AddToCart").slice(0, 5);
  return {
    products: products || seedProducts,
    orders: orderRows,
    customers: customers || [],
    events: eventRows,
    supportRequests: supportResult.data || [],
    suppliers: suppliersResult.data || [],
    validationCandidates: validationResult.data || [],
    metrics: {
      revenue: orderRows.filter((order) => order.payment_status === "paid").reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
      totalOrders: orderRows.length,
      pendingOrders: orderRows.filter((order) => order.fulfillment_status === "processing" || order.payment_status === "pending").length,
      shippedOrders: orderRows.filter((order) => order.fulfillment_status === "shipped").length,
      deliveredOrders: orderRows.filter((order) => order.fulfillment_status === "delivered").length,
      refundedOrders: orderRows.filter((order) => order.payment_status === "refunded").length,
      eventCount: eventRows.length,
      topViewedProducts,
      topAddedProducts
    }
  };
}
