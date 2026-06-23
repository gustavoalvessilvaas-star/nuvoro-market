import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function text(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function numberOrNull(form: FormData, key: string) {
  const value = Number(form.get(key));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function validationScore(form: FormData) {
  return [
    "demand_score",
    "wow_factor_score",
    "margin_score",
    "logistics_risk_score",
    "compliance_risk_score",
    "supplier_confidence_score",
    "creative_potential_score"
  ].reduce((sum, key) => sum + Number(numberOrNull(form, key) || 0), 0);
}

function validationPayload(form: FormData) {
  return {
    product_name: text(form, "product_name"),
    category: text(form, "category") || null,
    product_url: text(form, "product_url") || null,
    supplier_url: text(form, "supplier_url") || null,
    backup_supplier_url: text(form, "backup_supplier_url") || null,
    estimated_product_cost: numberOrNull(form, "estimated_product_cost"),
    estimated_shipping_cost: numberOrNull(form, "estimated_shipping_cost"),
    estimated_selling_price: numberOrNull(form, "estimated_selling_price"),
    demand_score: numberOrNull(form, "demand_score"),
    wow_factor_score: numberOrNull(form, "wow_factor_score"),
    margin_score: numberOrNull(form, "margin_score"),
    logistics_risk_score: numberOrNull(form, "logistics_risk_score"),
    compliance_risk_score: numberOrNull(form, "compliance_risk_score"),
    supplier_confidence_score: numberOrNull(form, "supplier_confidence_score"),
    creative_potential_score: numberOrNull(form, "creative_potential_score"),
    total_score: validationScore(form),
    status: text(form, "status") || "idea",
    notes: text(form, "notes") || null,
    updated_at: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/product-validation", request.url));

  const action = text(form, "action");
  if (action === "convert") {
    const candidateId = text(form, "candidate_id");
    const { data: candidate } = await supabase.from("product_validation").select("*").eq("id", candidateId).maybeSingle();
    const source = candidate || (await supabase.from("product_validation_candidates").select("*").eq("id", candidateId).maybeSingle()).data;
    if (source) {
      const name = String(source.product_name || source.product_idea || "Product draft");
      const price = Number(source.estimated_selling_price || 0);
      const cost = Number(source.estimated_product_cost || 0);
      const shipping = Number(source.estimated_shipping_cost || 0);
      const totalCost = cost + shipping;
      await supabase.from("products").insert({
        name,
        slug: `${slugify(name)}-${Date.now()}`,
        category: source.category || "Home & Organization",
        description: source.notes || "",
        short_description: String(source.notes || "").slice(0, 160),
        headline: name,
        subheadline: "",
        price,
        compare_at_price: null,
        cost_price: cost || null,
        shipping_cost: shipping || null,
        estimated_total_cost: totalCost,
        estimated_margin_amount: price - totalCost,
        estimated_margin_percent: price > 0 ? ((price - totalCost) / price) * 100 : null,
        supplier_url: source.supplier_url || null,
        backup_supplier_url: source.backup_supplier_url || null,
        shipping_estimate: "Estimated 7-14 business days",
        images: [],
        benefits: [],
        details: {},
        faqs: [],
        media_status: "placeholder",
        status: "draft",
        risk_notes: source.notes || null
      });
      await supabase.from("product_validation").update({ status: "approved", updated_at: new Date().toISOString() }).eq("id", candidateId);
    }
  } else {
    await supabase.from("product_validation").insert({ ...validationPayload(form), created_at: new Date().toISOString() });
  }

  return NextResponse.redirect(new URL("/admin/product-validation", request.url));
}
