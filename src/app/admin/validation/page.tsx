import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Product Validation Board" };
export const dynamic = "force-dynamic";

type ValidationCandidate = {
  id: string;
  product_idea: string;
  category?: string | null;
  demand_score?: number | null;
  wow_factor_score?: number | null;
  margin_score?: number | null;
  logistics_risk?: number | null;
  compliance_risk?: number | null;
  supplier_confidence?: number | null;
  creative_potential?: number | null;
  status?: string | null;
  notes?: string | null;
};

export default async function ProductValidationPage() {
  await requireAdmin();
  const { validationCandidates } = await getAdminDashboard() as { validationCandidates: ValidationCandidate[] };

  return (
    <section className="container-page py-10">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-4xl font-black">Product Validation Board</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Use this board to score product ideas before turning them into live products. Keep risky claims, weak suppliers and poor margin items out of the store.</p>
      <div className="mt-6 grid gap-4">
        {validationCandidates.length ? validationCandidates.map((candidate) => (
          <article key={candidate.id} className="card-surface p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-black">{candidate.product_idea}</h2>
                <p className="mt-1 text-sm text-ink/60">{candidate.category || "Uncategorized"}</p>
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-moss">{candidate.status || "idea"}</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Demand", candidate.demand_score],
                ["Wow factor", candidate.wow_factor_score],
                ["Margin", candidate.margin_score],
                ["Logistics risk", candidate.logistics_risk],
                ["Compliance risk", candidate.compliance_risk],
                ["Supplier confidence", candidate.supplier_confidence],
                ["Creative potential", candidate.creative_potential]
              ].map(([label, value]) => <p key={String(label)} className="rounded-2xl bg-cloud p-3 text-sm"><span className="font-bold">{label}:</span> {value ?? "-"}</p>)}
            </div>
            {candidate.notes ? <p className="mt-4 text-sm leading-6 text-ink/70">{candidate.notes}</p> : null}
          </article>
        )) : (
          <div className="card-surface p-8 text-center">
            <p className="font-black">No validation candidates yet.</p>
            <p className="mt-2 text-sm text-ink/60">Add product ideas to `product_validation_candidates` in Supabase to score and approve future winners.</p>
          </div>
        )}
      </div>
    </section>
  );
}
