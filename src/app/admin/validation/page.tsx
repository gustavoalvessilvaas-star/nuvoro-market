import { CheckCircle2, PlusCircle } from "lucide-react";
import { AdminPanel, EmptyState, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard, type AdminValidationCandidate } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Product Validation Board" };
export const dynamic = "force-dynamic";

const statuses = ["idea", "researching", "sample_ordered", "sample_received", "approved", "rejected", "testing", "winner", "paused"];

function score(candidate: AdminValidationCandidate) {
  const values = [
    candidate.demand_score,
    candidate.wow_factor_score,
    candidate.margin_score,
    candidate.logistics_risk_score ?? candidate.logistics_risk,
    candidate.compliance_risk_score ?? candidate.compliance_risk,
    candidate.supplier_confidence_score ?? candidate.supplier_confidence,
    candidate.creative_potential_score ?? candidate.creative_potential
  ].map((value) => Number(value || 0));
  return Number(candidate.total_score || values.reduce((sum, value) => sum + value, 0));
}

function recommendation(total: number) {
  if (total >= 80) return "strong candidate";
  if (total >= 60) return "test carefully";
  if (total >= 40) return "needs more research";
  return "reject";
}

function productName(candidate: AdminValidationCandidate) {
  return candidate.product_name || candidate.product_idea || "Untitled product idea";
}

export default async function ProductValidationPage() {
  await requireAdmin();
  const { validationCandidates } = await getAdminDashboard();

  return (
    <AdminShell
      title="Product Validation"
      description="Score new product ideas before creating public products or spending on samples and paid traffic."
    >
      <AdminPanel>
        <div className="flex items-center gap-3">
          <PlusCircle className="h-5 w-5 text-aqua" />
          <h2 className="text-2xl font-black">Add product idea</h2>
        </div>
        <form action="/api/admin/validation" method="post" className="mt-5 grid gap-4 md:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          {[
            ["product_name", "Product idea"],
            ["category", "Category"],
            ["product_url", "Product URL"],
            ["supplier_url", "Supplier URL"],
            ["backup_supplier_url", "Backup supplier URL"],
            ["estimated_product_cost", "Estimated product cost"],
            ["estimated_shipping_cost", "Estimated shipping cost"],
            ["estimated_selling_price", "Estimated selling price"]
          ].map(([name, label]) => (
            <label key={name} className="grid gap-2">
              <span className="text-xs font-bold text-white/55">{label}</span>
              <input className="field" name={name} required={name === "product_name"} />
            </label>
          ))}
          {[
            ["demand_score", "Demand score"],
            ["wow_factor_score", "Wow factor"],
            ["margin_score", "Margin score"],
            ["logistics_risk_score", "Logistics risk"],
            ["compliance_risk_score", "Compliance risk"],
            ["supplier_confidence_score", "Supplier confidence"],
            ["creative_potential_score", "Creative potential"]
          ].map(([name, label]) => (
            <label key={name} className="grid gap-2">
              <span className="text-xs font-bold text-white/55">{label} (1-10)</span>
              <input className="field" type="number" min="0" max="10" name={name} defaultValue="0" />
            </label>
          ))}
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Status</span>
            <select className="field" name="status" defaultValue="idea">
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Notes</span>
            <textarea className="field min-h-24" name="notes" />
          </label>
          <button className="btn-primary gap-2 md:col-span-3"><PlusCircle className="h-4 w-4" /> Save product idea</button>
        </form>
      </AdminPanel>

      <div className="mt-6 grid gap-5">
        {validationCandidates.length ? validationCandidates.map((candidate) => {
          const total = score(candidate);
          return (
            <AdminPanel key={candidate.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black">{productName(candidate)}</h2>
                    <StatusBadge value={candidate.status || "idea"} />
                    <StatusBadge value={recommendation(total)} />
                  </div>
                  <p className="mt-2 text-sm text-white/55">{candidate.category || "Uncategorized"}</p>
                  <p className="mt-2 text-sm text-white/65">
                    Cost {formatCurrency(Number(candidate.estimated_product_cost || 0) + Number(candidate.estimated_shipping_cost || 0))} / target price {formatCurrency(Number(candidate.estimated_selling_price || 0))}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center">
                  <p className="text-xs font-bold text-white/45">Total score</p>
                  <p className="mt-1 text-3xl font-black text-aqua">{total}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                {[
                  ["Demand", candidate.demand_score],
                  ["Wow", candidate.wow_factor_score],
                  ["Margin", candidate.margin_score],
                  ["Logistics", candidate.logistics_risk_score ?? candidate.logistics_risk],
                  ["Compliance", candidate.compliance_risk_score ?? candidate.compliance_risk],
                  ["Supplier", candidate.supplier_confidence_score ?? candidate.supplier_confidence],
                  ["Creative", candidate.creative_potential_score ?? candidate.creative_potential]
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-bold text-white/45">{label}</p>
                    <p className="mt-2 text-2xl font-black">{Number(value || 0)}</p>
                  </div>
                ))}
              </div>

              {candidate.notes ? <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/65">{candidate.notes}</p> : null}

              <form action="/api/admin/validation" method="post" className="mt-5 flex flex-wrap gap-3">
                <input type="hidden" name="action" value="convert" />
                <input type="hidden" name="candidate_id" value={candidate.id} />
                <button className="btn-primary gap-2"><CheckCircle2 className="h-4 w-4" /> Convert to Product Draft</button>
                {candidate.product_url ? <a className="btn-secondary" href={candidate.product_url} target="_blank" rel="noreferrer">Open product idea</a> : null}
                {candidate.supplier_url ? <a className="btn-secondary" href={candidate.supplier_url} target="_blank" rel="noreferrer">Open supplier</a> : null}
              </form>
            </AdminPanel>
          );
        }) : (
          <EmptyState title="No validation candidates yet">Add product ideas before ordering samples or turning them into storefront drafts.</EmptyState>
        )}
      </div>
    </AdminShell>
  );
}
