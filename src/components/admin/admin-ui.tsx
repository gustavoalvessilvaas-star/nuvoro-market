import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { marginLabel } from "@/lib/admin-data";

export function AdminPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-soft backdrop-blur", className)}>
      {children}
    </section>
  );
}

export function StatCard({ label, value, detail, Icon }: { label: string; value: string; detail?: string; Icon: LucideIcon }) {
  return (
    <AdminPanel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white/55">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-aqua/15 text-aqua">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {detail ? <p className="mt-3 text-xs font-bold text-white/45">{detail}</p> : null}
    </AdminPanel>
  );
}

export function StatusBadge({ value }: { value?: string | null }) {
  const status = value || "unknown";
  const color =
    status.includes("paid") || status.includes("active") || status.includes("delivered") || status.includes("winner") || status.includes("approved")
      ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
      : status.includes("failed") || status.includes("refunded") || status.includes("cancelled") || status.includes("rejected") || status.includes("inactive")
        ? "border-red-300/30 bg-red-400/15 text-red-100"
        : status.includes("draft") || status.includes("pending") || status.includes("processing") || status.includes("researching")
          ? "border-gold/40 bg-gold/15 text-gold"
          : "border-white/15 bg-white/10 text-white/75";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-black capitalize", color)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function MarginBadge({ percent }: { percent: number | null }) {
  const label = marginLabel(percent);
  const color =
    percent == null
      ? "border-white/15 bg-white/10 text-white/60"
      : percent < 40
        ? "border-red-300/30 bg-red-400/15 text-red-100"
        : percent < 55
          ? "border-gold/40 bg-gold/15 text-gold"
          : percent < 70
            ? "border-blue/40 bg-blue/15 text-blue-100"
            : "border-emerald-300/30 bg-emerald-400/15 text-emerald-100";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-black", color)}>
      {label}{percent == null ? "" : ` (${percent.toFixed(1)}%)`}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
      <Inbox className="h-9 w-9 text-white/35" />
      <p className="mt-4 text-lg font-black text-white">{title}</p>
      <div className="mt-2 max-w-xl text-sm leading-6 text-white/55">{children}</div>
    </div>
  );
}

export function WarningList({ warnings }: { warnings: string[] }) {
  if (!warnings.length) return <span className="text-sm font-bold text-emerald-200">Ready</span>;
  return (
    <div className="grid gap-1">
      {warnings.map((warning) => (
        <span key={warning} className="inline-flex items-center gap-1 text-xs font-bold text-gold">
          <AlertTriangle className="h-3.5 w-3.5" />
          {warning}
        </span>
      ))}
    </div>
  );
}

export function MoneyCell({ value }: { value: number }) {
  return <span className="font-black text-white">{formatCurrency(value)}</span>;
}

export function PercentCell({ value }: { value: number }) {
  return <span className="font-black text-white">{value.toFixed(1)}%</span>;
}
