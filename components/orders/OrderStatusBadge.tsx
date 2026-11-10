import { CheckCircle2, Clock, Truck, XCircle, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/types";
import { cn } from "@/utils/cn";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    icon: LucideIcon;
    classes: string;
  }
> = {
  Processing: {
    icon: Clock,
    classes: "border-orange-200 bg-orange-50 text-orange-700",
  },
  Shipped: {
    icon: Truck,
    classes: "border-blue-200 bg-blue-50 text-blue-700",
  },
  Delivered: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Cancelled: {
    icon: XCircle,
    classes: "border-red-200 bg-red-50 text-red-700",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { icon: Icon, classes } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        classes,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

export default OrderStatusBadge;

