import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function text(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function numberOrNull(form: FormData, key: string) {
  const value = Number(form.get(key));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function checked(form: FormData, key: string) {
  return form.get(key) === "on";
}

function supplierPayload(form: FormData) {
  const productCost = numberOrNull(form, "product_cost");
  const shippingCost = numberOrNull(form, "shipping_cost");

  return {
    name: text(form, "name"),
    platform: text(form, "platform") || "Other",
    product_id: text(form, "product_id") || null,
    supplier_url: text(form, "supplier_url") || null,
    backup_supplier_url: text(form, "backup_supplier_url") || null,
    product_cost: productCost,
    shipping_cost: shippingCost,
    total_estimated_cost: Number(productCost || 0) + Number(shippingCost || 0),
    estimated_delivery_days_min: numberOrNull(form, "estimated_delivery_days_min"),
    estimated_delivery_days_max: numberOrNull(form, "estimated_delivery_days_max"),
    warehouse_location: text(form, "warehouse_location") || null,
    tracking_available: checked(form, "tracking_available"),
    tracking_quality: text(form, "tracking_quality") || "unknown",
    product_quality_score: numberOrNull(form, "product_quality_score"),
    sample_ordered: checked(form, "sample_ordered"),
    sample_received: checked(form, "sample_received"),
    sample_approved: checked(form, "sample_approved"),
    observations: text(form, "observations") || null,
    compliance_notes: text(form, "compliance_notes") || null,
    return_policy_notes: text(form, "compliance_notes") || null,
    active: checked(form, "active"),
    updated_at: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/suppliers", request.url));

  const action = text(form, "action");
  const supplierId = text(form, "supplier_id");
  const payload = supplierPayload(form);

  if (action === "update" && supplierId) {
    await supabase.from("suppliers").update(payload).eq("id", supplierId);
  } else {
    const { data } = await supabase.from("suppliers").insert({ ...payload, created_at: new Date().toISOString() }).select("id, product_id").single();
    if (data?.id && data.product_id) {
      await supabase.from("product_suppliers").insert({ product_id: data.product_id, supplier_id: data.id }).select("id").maybeSingle();
    }
  }

  return NextResponse.redirect(new URL("/admin/suppliers", request.url));
}
