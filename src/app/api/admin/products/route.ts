import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function text(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function numberOrNull(form: FormData, key: string) {
  const value = Number(form.get(key));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function lines(form: FormData, key: string) {
  return text(form, key).split(/\r?\n|,/).map((line) => line.trim()).filter(Boolean);
}

function faqs(form: FormData) {
  return text(form, "faqs")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answer] = line.split("|").map((part) => part.trim());
      return { question, answer: answer.join(" | ") || "" };
    })
    .filter((faq) => faq.question && faq.answer);
}

function latestAction(form: FormData) {
  const actions = form.getAll("action").map((value) => String(value));
  return actions[actions.length - 1] || "create";
}

function margin(price: number | null, cost: number | null, shipping: number | null) {
  const salePrice = Number(price || 0);
  const estimatedTotalCost = Number(cost || 0) + Number(shipping || 0);
  const estimatedMarginAmount = salePrice - estimatedTotalCost;
  const estimatedMarginPercent = salePrice > 0 ? (estimatedMarginAmount / salePrice) * 100 : null;
  return { estimatedTotalCost, estimatedMarginAmount, estimatedMarginPercent };
}

async function uploadProductImage(form: FormData, slug: string) {
  const supabase = getSupabaseAdmin();
  const image = form.get("image");
  if (!supabase || !(image instanceof File) || image.size <= 0) return null;
  const ext = image.name.split(".").pop() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;
  const { data } = await supabase.storage.from("product-images").upload(path, image, { upsert: true });
  if (!data?.path) return null;
  const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(data.path);
  return publicUrl.publicUrl;
}

function productPayload(form: FormData, imageUrl: string | null, forceDraft: boolean) {
  const name = text(form, "name");
  const slug = text(form, "slug") || slugify(name);
  const price = numberOrNull(form, "price") || 0;
  const costPrice = numberOrNull(form, "cost_price");
  const shippingCost = numberOrNull(form, "shipping_cost");
  const mainImage = imageUrl || text(form, "main_image_url") || null;
  const gallery = lines(form, "gallery_image_urls");
  const economics = margin(price, costPrice, shippingCost);
  const status = forceDraft ? "draft" : text(form, "status") || "draft";

  return {
    name,
    slug,
    category: text(form, "category") || "Home & Organization",
    description: text(form, "description"),
    short_description: text(form, "description").slice(0, 160),
    headline: text(form, "headline") || name,
    subheadline: text(form, "subheadline"),
    price,
    compare_at_price: numberOrNull(form, "compare_at_price"),
    cost_price: costPrice,
    shipping_cost: shippingCost,
    estimated_total_cost: economics.estimatedTotalCost,
    estimated_margin_amount: economics.estimatedMarginAmount,
    estimated_margin_percent: economics.estimatedMarginPercent,
    supplier_name: text(form, "supplier_name") || null,
    supplier_platform: text(form, "supplier_platform") || null,
    supplier_url: text(form, "supplier_url") || null,
    backup_supplier_url: text(form, "backup_supplier_url") || null,
    shipping_estimate: text(form, "shipping_estimate") || "Estimated 7-14 business days",
    main_image_url: mainImage,
    gallery_image_urls: gallery,
    lifestyle_image_url: text(form, "lifestyle_image_url") || null,
    demo_video_url: text(form, "demo_video_url") || null,
    gif_url: text(form, "gif_url") || null,
    alt_text: text(form, "alt_text") || null,
    media_status: text(form, "media_status") || "placeholder",
    images: [mainImage, ...gallery].filter(Boolean),
    benefits: lines(form, "benefits"),
    how_it_works: lines(form, "how_it_works"),
    faqs: faqs(form),
    seo_title: text(form, "seo_title") || null,
    seo_description: text(form, "seo_description") || null,
    risk_notes: text(form, "risk_notes") || null,
    status,
    updated_at: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/products", request.url));

  const action = latestAction(form);
  const productId = text(form, "product_id");

  if (action === "deactivate" && productId) {
    await supabase.from("products").update({ status: "inactive", updated_at: new Date().toISOString() }).eq("id", productId);
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  if (action === "activate" && productId) {
    await supabase.from("products").update({ status: "active", updated_at: new Date().toISOString() }).eq("id", productId);
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  const name = text(form, "name");
  const slug = text(form, "slug") || slugify(name);
  const imageUrl = await uploadProductImage(form, slug);
  const activeWithoutConfirmation = action === "create"
    && text(form, "status") === "active"
    && form.get("publish_warning_ack") !== "on"
    && (!text(form, "supplier_url") || (!imageUrl && !text(form, "main_image_url")));
  const payload = productPayload(form, imageUrl, activeWithoutConfirmation);

  if (action === "update" && productId) {
    await supabase.from("products").update(payload).eq("id", productId);
  } else {
    await supabase.from("products").insert({ ...payload, created_at: new Date().toISOString() });
  }

  return NextResponse.redirect(new URL("/admin/products", request.url));
}
