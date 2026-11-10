import { Check, Circle, XCircle } from "lucide-react";
import { buildOrderTimeline } from "@/lib/orders";
import type { Order } from "@/types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format";

interface OrderTrackingTimelineProps {
  order: Order;
  isHighlighted?: boolean;
}

export function OrderTrackingTimeline({
  order,
  isHighlighted = false,
}: OrderTrackingTimelineProps) {
  const steps = buildOrderTimeline(order);
  const isCancelled = order.status === "Cancelled";

  return (
    <section
      id="order-tracking-timeline"
      aria-labelledby="tracking-timeline-heading"
      className={cn(
        "rounded-[24px] border bg-white p-5 shadow-xs transition-all duration-300 sm:p-7",
        isHighlighted
          ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/20"
          : "border-gray-200/80"
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="tracking-timeline-heading"
            className="text-lg font-bold text-[#1E293B] sm:text-xl"
          >
            Order Tracking Timeline
          </h2>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Current status:{" "}
            <span className="font-semibold text-[#1E293B]">{order.status}</span>
            {order.trackingNumber && (
              <>
                {" "}
                &bull; Tracking ID:{" "}
                <span className="font-mono font-medium text-[#4F46E5]">
                  {order.trackingNumber}
                </span>
              </>
            )}
          </p>
        </div>

        {order.estimatedDelivery && !isCancelled && (
          <div className="w-fit shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5]">
            {order.status === "Delivered"
              ? `Delivered on ${order.estimatedDelivery}`
              : `Est. Delivery: ${order.estimatedDelivery}`}
          </div>
        )}
      </div>

      {isCancelled && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <XCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">This order has been cancelled.</p>
            {order.statusHistory.cancelledAt && (
              <p className="mt-0.5 text-xs text-red-700">
                Cancelled on {formatDate(order.statusHistory.cancelledAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Timeline Grid: Vertical on small screens, Horizontal 5-step stepper on desktop */}
      <ol className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.stepNumber} className="relative flex gap-3.5 md:block">
              {/* Mobile Vertical Connector */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute left-4 top-9 bottom-[-20px] w-0.5 md:hidden",
                    step.completed && steps[index + 1]?.completed
                      ? "bg-[#4F46E5]"
                      : "bg-gray-200"
                  )}
                />
              )}

              {/* Desktop Horizontal Connector */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "hidden md:block absolute left-9 right-0 top-4 h-0.5",
                    step.completed && steps[index + 1]?.completed
                      ? "bg-[#4F46E5]"
                      : "bg-gray-200"
                  )}
                />
              )}

              {/* Step Node */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                {step.completed ? (
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs",
                      step.isCurrent
                        ? "bg-[#4F46E5] ring-4 ring-indigo-100"
                        : "bg-emerald-500"
                    )}
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-300">
                    <Circle className="h-3 w-3 fill-current" aria-hidden="true" />
                  </span>
                )}
              </div>

              {/* Step Copy */}
              <div className="md:mt-3 md:pr-2">
                <p
                  className={cn(
                    "text-sm font-bold",
                    step.completed ? "text-[#1E293B]" : "text-gray-400"
                  )}
                >
                  {step.stepNumber}. {step.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs leading-relaxed",
                    step.completed ? "text-[#64748B]" : "text-gray-400"
                  )}
                >
                  {step.description}
                </p>
                {step.timestamp && (
                  <p className="mt-1 text-[11px] font-medium text-[#4F46E5]">
                    {formatDate(step.timestamp)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default OrderTrackingTimeline;
