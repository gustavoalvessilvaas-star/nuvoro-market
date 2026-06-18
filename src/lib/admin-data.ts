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
      metrics: { revenue: 0, totalOrders: 0, pendingOrders: 0, shippedOrders: 0, eventCount: 0 }
    };
  }
  const [{ data: products }, { data: orders }, { data: customers }, { data: events }, supportResult] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(100)
  ]);
  const orderRows = orders || [];
  return {
    products: products || seedProducts,
    orders: orderRows,
    customers: customers || [],
    events: events || [],
    supportRequests: supportResult.data || [],
    metrics: {
      revenue: orderRows.filter((order) => order.payment_status === "paid").reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
      totalOrders: orderRows.length,
      pendingOrders: orderRows.filter((order) => order.fulfillment_status === "processing" || order.payment_status === "pending").length,
      shippedOrders: orderRows.filter((order) => order.fulfillment_status === "shipped").length,
      eventCount: events?.length || 0
    }
  };
}
