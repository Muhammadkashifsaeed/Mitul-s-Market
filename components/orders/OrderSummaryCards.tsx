import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";
import type { OrderSummaryCounts } from "@/lib/orders";
import { cn } from "@/utils/cn";

interface OrderSummaryCardsProps {
  counts: OrderSummaryCounts;
}

export function OrderSummaryCards({ counts }: OrderSummaryCardsProps) {
  const cards = [
    {
      label: "Total Orders",
      value: counts.total,
      icon: Package,
      iconBg: "bg-indigo-50 text-[#4F46E5]",
      accentBorder: "hover:border-indigo-200",
      subtitle: "All recorded purchases",
    },
    {
      label: "Pending Orders",
      value: counts.pending,
      icon: Clock,
      iconBg: "bg-orange-50 text-orange-600",
      accentBorder: "hover:border-orange-200",
      subtitle: "Processing or in transit",
    },
    {
      label: "Delivered Orders",
      value: counts.delivered,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
      accentBorder: "hover:border-emerald-200",
      subtitle: "Completed deliveries",
    },
    {
      label: "Cancelled Orders",
      value: counts.cancelled,
      icon: XCircle,
      iconBg: "bg-red-50 text-red-600",
      accentBorder: "hover:border-red-200",
      subtitle: "Voided or stopped",
    },
  ] as const;

  return (
    <div
      aria-label="Order summary"
      className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6"
    >
      {cards.map(({ label, value, icon: Icon, iconBg, accentBorder, subtitle }) => (
        <div
          key={label}
          className={cn(
            "flex items-start justify-between gap-4 rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
            accentBorder
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#64748B]">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>
          </div>
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              iconBg
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
      ))}
    </div>
  );
}

export default OrderSummaryCards;

