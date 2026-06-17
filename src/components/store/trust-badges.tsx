import { BadgeCheck, Headphones, LockKeyhole, PackageCheck, Truck, type LucideIcon } from "lucide-react";

const badges = [
  { Icon: Truck, title: "Free Shipping", text: "Simple free shipping on every order." },
  { Icon: LockKeyhole, title: "Secure Checkout", text: "Stripe-powered encrypted payment flow." },
  { Icon: BadgeCheck, title: "30-Day Support", text: "A clear support window after delivery." },
  { Icon: PackageCheck, title: "Tracking Included", text: "Tracking is added once available." },
  { Icon: Headphones, title: "Helpful Support", text: "Friendly support for order questions." }
] satisfies Array<{ Icon: LucideIcon; title: string; text: string }>;

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5"}>
      {badges.map(({ Icon, title, text }) => (
        <div key={title} className="card-surface p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-moss">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/60">{text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
