import { getAdminDashboard } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const { products } = await getAdminDashboard();
  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Product Management</h1>
      <form action="/api/admin/products" method="post" encType="multipart/form-data" className="mt-6 grid gap-4 rounded-lg border border-line bg-white p-5 md:grid-cols-3">
        {["name", "slug", "category", "price", "compare_at_price", "cost_price", "supplier_name", "supplier_url", "shipping_estimate"].map((field) => (
          <label key={field} className="grid gap-1"><span className="label capitalize">{field.replaceAll("_", " ")}</span><input className="field" name={field} required={["name", "slug", "category", "price"].includes(field)} /></label>
        ))}
        <label className="grid gap-1 md:col-span-3"><span className="label">Product image</span><input className="field" type="file" name="image" accept="image/*" /></label>
        <label className="grid gap-1 md:col-span-3"><span className="label">Description</span><textarea className="field" name="description" /></label>
        <button className="btn-primary md:col-span-3">Create Product</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cloud"><tr>{["Name", "Category", "Price", "Compare", "Supplier", "Status"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{products.map((p) => <tr key={p.id} className="border-t border-line"><td className="p-3 font-bold">{p.name}</td><td className="p-3">{p.category}</td><td className="p-3">{formatCurrency(Number(p.price))}</td><td className="p-3">{p.compare_at_price ? formatCurrency(Number(p.compare_at_price)) : "-"}</td><td className="p-3">{p.supplier_name || "-"}</td><td className="p-3">{p.status}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
