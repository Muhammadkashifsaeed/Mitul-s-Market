"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/utils/cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Orders", href: "/orders" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { authenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const cartBadgeText = totalItems > 99 ? "99+" : String(totalItems);
  const cartAriaLabel =
    totalItems > 0
      ? `Shopping Cart (${totalItems} ${totalItems === 1 ? "item" : "items"})`
      : "Shopping Cart";

  const loginHref =
    pathname === "/checkout" ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/")
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : "/login";

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    const targetUrl = trimmed
      ? `/shop?q=${encodeURIComponent(trimmed)}`
      : "/shop";
    setIsMobileMenuOpen(false);
    router.push(targetUrl);
  }

  async function handleLogout() {
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    router.refresh();
  }

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "M";
  const userShortName = user?.name?.trim().split(/\s+/)[0] || "Account";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop & Tablet single-row bar / Mobile top row */}
        <div className="flex h-16 items-center justify-between gap-3 md:h-[82px] lg:gap-6 xl:grid xl:grid-cols-[1fr_400px_1fr]">
          {/* Brand Name */}
          <Link
            href="/"
            aria-label="Mitul's Market Home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="shrink-0 justify-self-start whitespace-nowrap text-[24px] font-bold tracking-tight transition-opacity duration-200 hover:opacity-90 md:text-[22px] lg:text-[28px] xl:text-[30px]"
          >
            <span className="text-[#111827]">Mitul&apos;s</span>{" "}
            <span className="text-[#4F46E5]">Market</span>
          </Link>

          {/* Center Search Bar (Desktop & Tablet) */}
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 justify-center md:flex xl:w-[400px] xl:flex-none"
          >
            <div className="relative w-full max-w-[400px]">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 lg:left-4 lg:h-5 lg:w-5"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-12 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 lg:pl-11"
              />
            </div>
          </form>

          {/* Right Side Navigation (Desktop & Tablet) */}
          <nav
            aria-label="Primary navigation"
            className="hidden shrink-0 items-center justify-self-end gap-3.5 md:flex lg:gap-6 xl:gap-7"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap text-[14px] font-medium transition-colors duration-200 lg:text-[15px]",
                    isActive
                      ? "text-[#4F46E5]"
                      : "text-gray-700 hover:text-[#4F46E5]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/cart"
              aria-label={cartAriaLabel}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-indigo-50",
                pathname === "/cart"
                  ? "text-[#4F46E5]"
                  : "text-gray-700 hover:text-[#4F46E5]"
              )}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  data-testid="header-cart-badge"
                  className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#4F46E5] px-1 text-[10px] font-bold leading-none text-white shadow-xs"
                >
                  {cartBadgeText}
                </span>
              )}
            </Link>

            {authenticated && user ? (
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-indigo-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                    {userInitial}
                  </span>
                  <span className="max-w-[96px] truncate">{userShortName}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#4F46E5] transition-transform",
                      isAccountMenuOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isAccountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-[#1E293B]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#64748B]">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#1E293B] transition-colors hover:bg-indigo-50 hover:text-[#4F46E5]"
                    >
                      <Package className="h-4 w-4" aria-hidden="true" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/cart"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#1E293B] transition-colors hover:bg-indigo-50 hover:text-[#4F46E5]"
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      <span>Shopping Cart</span>
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={loginHref}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 lg:px-5",
                  pathname === "/login" ||
                    pathname === "/signup" ||
                    pathname === "/forgot-password"
                    ? "bg-[#312E81] text-white"
                    : "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                )}
              >
                <User className="h-4 w-4 text-white" aria-hidden="true" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/cart"
              aria-label={cartAriaLabel}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-gray-100",
                pathname === "/cart"
                  ? "text-[#4F46E5]"
                  : "text-gray-700 hover:text-[#4F46E5]"
              )}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  data-testid="mobile-header-cart-badge"
                  className="absolute -right-0.5 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#4F46E5] px-1 text-[10px] font-bold leading-none text-white shadow-xs"
                >
                  {cartBadgeText}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form role="search" onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-gray-100 bg-white px-4 pb-5 pt-3 shadow-md md:hidden"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors duration-200",
                    isActive
                      ? "bg-indigo-50 text-[#4F46E5]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3">
              {authenticated && user ? (
                <div className="space-y-2 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                      {userInitial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#1E293B]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#64748B]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href={loginHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#4338CA]"
                >
                  <User className="h-4 w-4 text-white" aria-hidden="true" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
