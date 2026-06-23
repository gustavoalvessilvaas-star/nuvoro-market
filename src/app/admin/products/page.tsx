import { PlusCircle, Save } from "lucide-react";
import { AdminPanel, EmptyState, MarginBadge, StatusBadge, WarningList } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { calculateMargin, getAdminDashboard, getProductWarnings, type AdminProduct } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin Products" };
export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const categories = ["Home & Organization", "Pet Care", "Car Essentials", "Travel & Outdoor", "Tech Accessories"];
const productStatuses = ["draft", "active", "inactive"];
const mediaStatuses = ["placeholder", "supplier-approved", "original-content"];

function param(searchParams: ProductsPageProps["searchParams"], key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function filterProducts(products: AdminProduct[], searchParams: ProductsPageProps["searchParams"]) {
  const q = param(searchParams, "q").toLowerCase();
  const status = param(searchParams, "status");
  const category = param(searchParams, "category");
  const supplier = param(searchParams, "supplier");
  const media = param(searchParams, "media");
  const margin = param(searchParams, "margin");
  const cost = param(searchParams, "cost");

  return products.filter((product) => {
    const productMargin = calculateMargin(product).estimatedMarginPercent;
    if (q && !`${product.name} ${product.slug} ${product.category} ${product.supplier_name || ""}`.toLowerCase().includes(q)) return false;
    if (status && product.status !== status) return false;
    if (category && product.category !== category) return false;
    if (supplier === "missing" && product.supplier_url) return false;
    if (media === "placeholder" && product.media_status !== "placeholder") return false;
    if (margin === "low" && !(productMargin != null && productMargin < 55)) return false;
    if (cost === "missing" && product.cost_price) return false;
    return true;
  });
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  await requireAdmin();
  const { products } = await getAdminDashboard();
  const filteredProducts = filterProducts(products, searchParams);

  return (
    <AdminShell
      title="Products"
      description="Create, edit, deactivate and validate the economics for every storefront product before sending traffic."
    >
      <AdminPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Product controls</p>
            <h2 className="mt-2 text-2xl font-black">Search and filters</h2>
          </div>
          <p className="text-sm font-bold text-white/55">{filteredProducts.length} of {products.length} products shown</p>
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-bold text-white/55">Search</span>
            <input className="field" name="q" placeholder="Name, slug, supplier..." defaultValue={param(searchParams, "q")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Category</span>
            <select className="field" name="category" defaultValue={param(searchParams, "category")}>
              <option value="">All</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Status</span>
            <select className="field" name="status" defaultValue={param(searchParams, "status")}>
              <option value="">All</option>
              {productStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Supplier</span>
            <select className="field" name="supplier" defaultValue={param(searchParams, "supplier")}>
              <option value="">All</option>
              <option value="missing">Missing supplier</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Risk</span>
            <select className="field" name="margin" defaultValue={param(searchParams, "margin")}>
              <option value="">All</option>
              <option value="low">Low margin</option>
            </select>
          </label>
          <button className="btn-primary md:col-span-3 xl:col-span-6">Apply filters</button>
        </form>
      </AdminPanel>

      <AdminPanel className="mt-6">
        <div className="flex items-center gap-3">
          <PlusCircle className="h-5 w-5 text-aqua" />
          <h2 className="text-2xl font-black">Create product</h2>
        </div>
        <form action="/api/admin/products" method="post" encType="multipart/form-data" className="mt-5 grid gap-4 md:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          {[
            ["name", "Name", "Pet LED Grooming Kit"],
            ["slug", "Slug", "pet-led-grooming-kit"],
            ["category", "Category", ""],
            ["price", "Price", "29.99"],
            ["compare_at_price", "Compare-at price", "39.99"],
            ["cost_price", "Product cost", "7.50"],
            ["shipping_cost", "Shipping cost", "3.25"],
            ["supplier_name", "Supplier name", "Supplier Co"],
            ["supplier_platform", "Supplier platform", "AliExpress"],
            ["supplier_url", "Supplier URL", "https://"],
            ["backup_supplier_url", "Backup supplier URL", "https://"],
            ["shipping_estimate", "Shipping estimate", "Estimated 7-14 business days"],
            ["main_image_url", "Main image URL", "https://"],
            ["lifestyle_image_url", "Lifestyle image URL", "https://"],
            ["demo_video_url", "Demo video URL", "https://"],
            ["gif_url", "GIF URL", "https://"],
            ["alt_text", "Alt text", "Product in use"],
            ["seo_title", "SEO title", "Nuvoro Market product"],
            ["seo_description", "SEO description", "Smart everyday essential for useful routines."]
          ].map(([name, label, placeholder]) => (
            <label key={name} className="grid gap-2">
              <span className="text-xs font-bold text-white/55">{label}</span>
              <input className="field" name={name} placeholder={placeholder} required={["name", "category", "price"].includes(name)} />
            </label>
          ))}
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Status</span>
            <select className="field" name="status" defaultValue="draft">
              {productStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Media status</span>
            <select className="field" name="media_status" defaultValue="placeholder">
              {mediaStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Upload image</span>
            <input className="field" type="file" name="image" accept="image/*" />
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Description</span>
            <textarea className="field min-h-28" name="description" />
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Benefits, one per line</span>
            <textarea className="field min-h-28" name="benefits" />
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">FAQ, one per line as Question | Answer</span>
            <textarea className="field min-h-28" name="faqs" />
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm font-bold text-gold md:col-span-3">
            <input type="checkbox" name="publish_warning_ack" className="mt-1" />
            I understand active products should have price, image/media, supplier URL and margin reviewed.
          </label>
          <button className="btn-primary gap-2 md:col-span-3"><PlusCircle className="h-4 w-4" /> Create product</button>
        </form>
      </AdminPanel>

      <div className="mt-6 grid gap-5">
        {filteredProducts.length ? filteredProducts.map((product) => {
          const margin = calculateMargin(product);
          const warnings = getProductWarnings(product);

          return (
            <AdminPanel key={product.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black">{product.name}</h2>
                    <StatusBadge value={product.status} />
                    <MarginBadge percent={margin.estimatedMarginPercent} />
                  </div>
                  <p className="mt-2 text-sm text-white/50">{product.slug} - {product.category}</p>
                  <p className="mt-3 text-sm text-white/65">Price {formatCurrency(Number(product.price || 0))} / cost {formatCurrency(margin.estimatedTotalCost)} / estimated profit {formatCurrency(margin.estimatedMarginAmount)}</p>
                </div>
                <WarningList warnings={warnings} />
              </div>

              <form action="/api/admin/products" method="post" encType="multipart/form-data" className="mt-5 grid gap-4 md:grid-cols-3">
                <input type="hidden" name="action" value="update" />
                <input type="hidden" name="product_id" value={product.id} />
                {[
                  ["name", "Name", product.name],
                  ["slug", "Slug", product.slug],
                  ["category", "Category", product.category],
                  ["price", "Price", String(product.price || "")],
                  ["compare_at_price", "Compare-at price", String(product.compare_at_price || "")],
                  ["cost_price", "Product cost", String(product.cost_price || "")],
                  ["shipping_cost", "Shipping cost", String(product.shipping_cost || "")],
                  ["supplier_name", "Supplier name", String(product.supplier_name || "")],
                  ["supplier_platform", "Supplier platform", String(product.supplier_platform || "")],
                  ["supplier_url", "Supplier URL", String(product.supplier_url || "")],
                  ["backup_supplier_url", "Backup supplier URL", String(product.backup_supplier_url || "")],
                  ["shipping_estimate", "Shipping estimate", String(product.shipping_estimate || "")],
                  ["main_image_url", "Main image URL", String(product.main_image_url || product.images?.[0] || "")],
                  ["lifestyle_image_url", "Lifestyle image URL", String(product.lifestyle_image_url || "")],
                  ["demo_video_url", "Demo video URL", String(product.demo_video_url || "")],
                  ["gif_url", "GIF URL", String(product.gif_url || "")],
                  ["alt_text", "Alt text", String(product.alt_text || "")],
                  ["seo_title", "SEO title", String(product.seo_title || "")],
                  ["seo_description", "SEO description", String(product.seo_description || "")]
                ].map(([name, label, value]) => (
                  <label key={name} className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">{label}</span>
                    <input className="field" name={name} defaultValue={value} required={["name", "category", "price"].includes(name)} />
                  </label>
                ))}
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Status</span>
                  <select className="field" name="status" defaultValue={product.status}>
                    {productStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Media status</span>
                  <select className="field" name="media_status" defaultValue={product.media_status || "placeholder"}>
                    {mediaStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Replacement image</span>
                  <input className="field" type="file" name="image" accept="image/*" />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Description</span>
                  <textarea className="field min-h-28" name="description" defaultValue={product.description || ""} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Gallery image URLs, one per line</span>
                  <textarea className="field min-h-24" name="gallery_image_urls" defaultValue={arrayValue(product.gallery_image_urls?.length ? product.gallery_image_urls : product.images?.slice(1))} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Benefits, one per line</span>
                  <textarea className="field min-h-24" name="benefits" defaultValue={arrayValue(product.benefits)} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">How it works, one per line</span>
                  <textarea className="field min-h-24" name="how_it_works" defaultValue={arrayValue(product.how_it_works)} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">FAQ, one per line as Question | Answer</span>
                  <textarea className="field min-h-24" name="faqs" defaultValue={Array.isArray(product.faqs) ? product.faqs.map((faq) => `${faq.question} | ${faq.answer}`).join("\n") : ""} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Risk notes</span>
                  <textarea className="field min-h-24" name="risk_notes" defaultValue={String(product.risk_notes || "")} />
                </label>
                <div className="flex flex-wrap gap-3 md:col-span-3">
                  <button className="btn-primary gap-2"><Save className="h-4 w-4" /> Save updates</button>
                  <button className="btn-secondary" name="action" value={product.status === "active" ? "deactivate" : "activate"}>
                    {product.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </form>
            </AdminPanel>
          );
        }) : (
          <EmptyState title="No products match these filters">Clear filters or create a draft product to start preparing the catalog.</EmptyState>
        )}
      </div>
    </AdminShell>
  );
}
