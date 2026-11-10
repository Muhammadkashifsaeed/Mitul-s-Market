import type { Product } from "@/types";

export const SHOP_CATEGORIES = ["All", "Electronics", "Fashion"] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
] as const;

export type ShopSortOption = (typeof SHOP_SORT_OPTIONS)[number]["value"];

export interface ShopCollection {
  key: "audio" | "computers" | "accessories";
  label: string;
  productIds: readonly string[];
}

export const SHOP_COLLECTIONS: Record<ShopCollection["key"], ShopCollection> = {
  audio: {
    key: "audio",
    label: "Audio",
    productIds: [
      "premium-wireless-headphones",
      "portable-bluetooth-speaker",
      "true-wireless-earbuds-pro",
    ],
  },
  computers: {
    key: "computers",
    label: "Computers",
    productIds: ["mechanical-gaming-keyboard", "wireless-ergonomic-mouse"],
  },
  accessories: {
    key: "accessories",
    label: "Accessories",
    productIds: [
      "smart-fitness-watch",
      "minimalist-backpack",
      "polarized-aviator-sunglasses",
      "classic-leather-wallet",
    ],
  },
};

export type ShopCollectionKey = ShopCollection["key"];

export function findShopCollection(raw?: string | null): ShopCollection | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "audio" ||
    normalized === "computers" ||
    normalized === "accessories"
  ) {
    return SHOP_COLLECTIONS[normalized];
  }
  return null;
}

export const allProducts: readonly Product[] = [
  {
    id: "premium-wireless-headphones",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    description:
      "Over-ear active noise-canceling headphones with studio-tuned drivers, memory-foam ear cushions, and 40-hour wireless playback.",
    rating: 4.8,
    reviewsCount: 120,
    price: 2999,
    stock: 12,
    image: "/images/photo-1505740420928-5e560c06d30e.jpg",
  },
  {
    id: "smart-fitness-watch",
    name: "Smart Fitness Watch",
    category: "Electronics",
    description:
      "Lightweight AMOLED smartwatch with continuous heart-rate monitoring, GPS workout tracking, and 10-day battery endurance.",
    rating: 4.8,
    reviewsCount: 120,
    price: 1599,
    stock: 9,
    image: "/images/photo-1523275335684-37898b6baf30.jpg",
  },
  {
    id: "minimalist-backpack",
    name: "Minimalist Backpack",
    category: "Fashion",
    description:
      "Structured everyday commuter backpack with a padded 16-inch laptop sleeve, water-resistant weave, and clean hidden pockets.",
    rating: 4.8,
    reviewsCount: 120,
    price: 1200,
    stock: 15,
    image: "/images/photo-1553062407-98eeb64c6a62.jpg",
  },
  {
    id: "running-shoes",
    name: "Running Shoes",
    category: "Fashion",
    description:
      "Breathable engineered-knit road running sneakers built with responsive foam cushioning and high-traction rubber outsoles.",
    rating: 4.8,
    reviewsCount: 120,
    price: 2499,
    stock: 7,
    image: "/images/photo-1542291026-7eec264c27ff.jpg",
  },
  {
    id: "mechanical-gaming-keyboard",
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    description:
      "Compact 75% wireless mechanical keyboard with hot-swappable tactile switches, aluminum frame, and dual-mode connectivity.",
    rating: 4.9,
    reviewsCount: 86,
    price: 3499,
    stock: 6,
    image: "/images/mechanical-keyboard.jpg",
  },
  {
    id: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    description:
      "360-degree acoustic wireless speaker wrapped in splash-resistant woven fabric with dual bass radiators and 18-hour battery life.",
    rating: 4.7,
    reviewsCount: 94,
    price: 2199,
    stock: 11,
    image: "/images/bluetooth-speaker.jpg",
  },
  {
    id: "wireless-ergonomic-mouse",
    name: "Wireless Ergonomic Mouse",
    category: "Electronics",
    description:
      "Sculpted matte wireless productivity mouse featuring a precision machined scroll wheel, quiet clicks, and USB-C fast charging.",
    rating: 4.6,
    reviewsCount: 73,
    price: 1499,
    stock: 14,
    image: "/images/wireless-mouse.jpg",
  },
  {
    id: "true-wireless-earbuds-pro",
    name: "True Wireless Earbuds Pro",
    category: "Electronics",
    description:
      "Noise-isolating true wireless earbuds with adaptive transparency mode, crisp voice microphones, and a pocket charging case.",
    rating: 4.8,
    reviewsCount: 142,
    price: 2499,
    stock: 10,
    image: "/images/wireless-earbuds.jpg",
  },
  {
    id: "polarized-aviator-sunglasses",
    name: "Polarized Aviator Sunglasses",
    category: "Fashion",
    description:
      "Featherweight matte-steel aviator frames fitted with anti-glare UV400 polarized smoke lenses for bright outdoor clarity.",
    rating: 4.7,
    reviewsCount: 68,
    price: 1399,
    stock: 8,
    image: "/images/polarized-sunglasses.jpg",
  },
  {
    id: "classic-leather-wallet",
    name: "Classic Genuine Leather Wallet",
    category: "Fashion",
    description:
      "Slim full-grain cognac leather bifold wallet finished with durable perimeter stitching, six card slots, and RFID shielding.",
    rating: 4.8,
    reviewsCount: 112,
    price: 999,
    stock: 18,
    image: "/images/leather-wallet.jpg",
  },
  {
    id: "urban-cotton-bomber-jacket",
    name: "Urban Cotton Bomber Jacket",
    category: "Fashion",
    description:
      "Tailored matte-navy brushed-cotton bomber jacket featuring ribbed collar and cuffs, welt pockets, and heavy-duty metal zip.",
    rating: 4.7,
    reviewsCount: 64,
    price: 2899,
    stock: 4,
    image: "/images/bomber-jacket.jpg",
  },
  {
    id: "canvas-weekender-duffel-bag",
    name: "Canvas Weekender Duffel Bag",
    category: "Fashion",
    description:
      "Cabin-sized washed charcoal canvas weekender bag detailed with full-grain leather straps, brass hardware, and shoe compartment.",
    rating: 4.9,
    reviewsCount: 91,
    price: 1899,
    stock: 5,
    image: "/images/weekender-duffel.jpg",
  },
];

export const featuredProducts = allProducts.slice(0, 4);

export function getProductById(productId: string): Product | undefined {
  return allProducts.find((product) => product.id === productId);
}
