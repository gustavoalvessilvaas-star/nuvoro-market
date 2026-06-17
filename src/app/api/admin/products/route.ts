import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/products", request.url));
  const name = String(form.get("name") || "");
  const slug = String(form.get("slug") || slugify(name));
  const image = form.get("image");
  let images = ["/placeholders/pawtrim-led-grinder.svg"];
  if (image instanceof File && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { data } = await supabase.storage.from("product-images").upload(path, image, { upsert: true });
    if (data?.path) {
      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(data.path);
      images = [publicUrl.publicUrl];
    }
  }
  await supabase.from("products").insert({
    name,
    slug,
    category: String(form.get("category") || "Home & Organization"),
    description: String(form.get("description") || ""),
    short_description: String(form.get("description") || "").slice(0, 140),
    headline: name,
    subheadline: "",
    price: Number(form.get("price") || 0),
    compare_at_price: Number(form.get("compare_at_price") || 0) || null,
    cost_price: Number(form.get("cost_price") || 0) || null,
    supplier_name: String(form.get("supplier_name") || ""),
    supplier_url: String(form.get("supplier_url") || ""),
    shipping_estimate: String(form.get("shipping_estimate") || "Estimated 7-14 business days"),
    images,
    benefits: [],
    details: {},
    faqs: [],
    status: "active"
  });
  return NextResponse.redirect(new URL("/admin/products", request.url));
}
