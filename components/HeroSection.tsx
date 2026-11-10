import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full overflow-x-clip bg-[#F3F4F6]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          {/* Left Column - Text & Actions */}
          <div className="flex flex-col items-start">
            {/* A. Collection Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 text-sm font-bold text-[#1F2937] shadow-sm">
              <Sparkles
                className="h-4 w-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              <span>New Collection 2026</span>
            </div>

            {/* B. Main Heading */}
            <h1
              id="hero-heading"
              className="text-[42px] font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-[68px] xl:text-[88px]"
            >
              <span className="block text-[#1F2937]">Discover the</span>
              <span className="block bg-gradient-to-r from-[#4F46E5] via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Future of Tech
              </span>
            </h1>

            {/* C. Description */}
            <p className="mt-6 max-w-[620px] text-base leading-relaxed text-[#64748B] sm:text-lg lg:text-xl xl:text-[24px] xl:leading-[1.5]">
              Experience innovation at your fingertips. Shop the latest gadgets
              and accessories with exclusive deals and lightning-fast delivery.
            </p>

            {/* D. CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#4F46E5] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#4F46E5]/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-xl hover:shadow-[#4F46E5]/40 active:translate-y-0"
              >
                <span>Start Shopping</span>
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="#categories"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-[#1F2937] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:translate-y-0"
              >
                Browse Categories
              </Link>
            </div>

            {/* E. Trust Features */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-[#64748B]">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column - Product Image + Floating Card */}
          <div className="relative pb-6 sm:pb-6">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/photo-1505740420928-5e560c06d30e.jpg"
                alt="Wireless over-ear headphones featured in Mitul's Market 2026 collection"
                width={800}
                height={533}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full object-cover"
              />
            </div>

            {/* G. Floating Best Seller Card */}
            <div className="relative z-10 ml-3 -mt-7 w-fit rounded-2xl border border-gray-100 bg-white px-5 py-3.5 shadow-xl sm:absolute sm:-bottom-0 sm:-left-6 sm:ml-0 sm:mt-0">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Best Seller</p>
                  <p className="text-xs text-[#64748B]">
                    Over 10k sold this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

