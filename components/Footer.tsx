import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterCustomerCareLinks } from "@/components/FooterCustomerCareLinks";

const quickAccessLinks = [
  { label: "Home", href: "/" },
  { label: "Shop Now", href: "/shop" },
  { label: "My Cart", href: "/cart" },
  { label: "Order History", href: "/orders" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-[#1F2937] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pb-10 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.95fr_1.1fr] lg:gap-10">
          {/* Column 1 - Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Mitul's Market Home"
              className="inline-block whitespace-nowrap text-[30px] font-bold leading-none tracking-tight sm:text-[32px] lg:text-[36px]"
            >
              <span className="text-[#4F46E5]">Mitul&apos;s</span>{" "}
              <span className="text-white">Market</span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Your premium destination for quality tech and lifestyle
              products. We believe in quality, style, and exceptional service.
            </p>
          </div>

          {/* Column 2 - Quick Access */}
          <div>
            <h2 className="mb-4 text-base font-semibold tracking-wide text-white">
              Quick Access
            </h2>
            <ul className="space-y-3">
              {quickAccessLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Customer Care */}
          <div>
            <h2 className="mb-4 text-base font-semibold tracking-wide text-white">
              Customer Care
            </h2>
            <FooterCustomerCareLinks />
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h2 className="mb-4 text-base font-semibold tracking-wide text-white">
              Contact Us
            </h2>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#6366F1]"
                  aria-hidden="true"
                />
                <span>Morbi, Gujarat</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="h-5 w-5 shrink-0 text-[#6366F1]"
                  aria-hidden="true"
                />
                <a
                  href="tel:+918866877692"
                  className="transition-colors duration-200 hover:text-white"
                >
                  +91 88668 77692
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="h-5 w-5 shrink-0 text-[#6366F1]"
                  aria-hidden="true"
                />
                <a
                  href="mailto:support@mitulsmarket.com"
                  className="break-all transition-colors duration-200 hover:text-white sm:break-normal"
                >
                  support@mitulsmarket.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-700/70 pt-8 text-center text-sm text-gray-400 sm:flex-row sm:text-left">
          <p>&copy; 2026 Mitul&apos;s Market. All rights reserved.</p>
          <p>Designed with ❤️ by Mitul&apos;s Market</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
