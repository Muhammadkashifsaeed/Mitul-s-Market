import { Award, ShoppingBag, Truck, Zap, type LucideIcon } from "lucide-react";

interface BenefitItem {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

const benefits: readonly BenefitItem[] = [
  {
    title: "Free Delivery",
    subtitle: "Orders over ₹999",
    icon: Truck,
  },
  {
    title: "Fast Shipping",
    subtitle: "2-3 Day Delivery",
    icon: Zap,
  },
  {
    title: "Top Quality",
    subtitle: "100% Original",
    icon: Award,
  },
  {
    title: "Easy Returns",
    subtitle: "7-Day Policy",
    icon: ShoppingBag,
  },
];

export function BenefitsSection() {
  return (
    <section aria-label="Store benefits" className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          {benefits.map(({ title, subtitle, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold text-[#1F2937] sm:text-lg">
                {title}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;

