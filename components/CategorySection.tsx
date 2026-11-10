import Link from "next/link";
import {
  Headphones,
  Monitor,
  Smartphone,
  Watch,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface CategoryItem {
  name: string;
  href: string;
  icon: LucideIcon;
  iconContainerClass: string;
}

const categories: readonly CategoryItem[] = [
  {
    name: "Electronics",
    href: "/shop?category=electronics",
    icon: Smartphone,
    iconContainerClass: "bg-blue-50 text-blue-600",
  },
  {
    name: "Accessories",
    href: "/shop?category=accessories",
    icon: Watch,
    iconContainerClass: "bg-purple-50 text-purple-600",
  },
  {
    name: "Audio",
    href: "/shop?category=audio",
    icon: Headphones,
    iconContainerClass: "bg-pink-50 text-pink-600",
  },
  {
    name: "Computers",
    href: "/shop?category=computers",
    icon: Monitor,
    iconContainerClass: "bg-orange-50 text-orange-600",
  },
];

export function CategorySection() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="w-full scroll-mt-20 bg-[#F3F4F6]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <h2
            id="categories-heading"
            className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl lg:text-[44px] lg:leading-tight"
          >
            Shop by Category
          </h2>
          <p className="mt-3 text-base text-[#64748B] sm:text-lg lg:text-[20px]">
            Explore our wide range of premium products
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {categories.map(({ name, href, icon: Icon, iconContainerClass }) => (
            <Link
              key={name}
              href={href}
              className="group flex h-full flex-col items-center justify-center rounded-[26px] bg-white px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div
                className={cn(
                  "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                  iconContainerClass
                )}
              >
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937]">{name}</h3>
              <span className="mt-2 text-sm font-medium text-[#64748B] transition-colors duration-200 group-hover:text-[#4F46E5]">
                View Collection
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;

