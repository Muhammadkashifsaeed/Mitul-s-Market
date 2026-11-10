import type { Metadata } from "next";
import { ShopCatalog } from "@/components/ShopCatalog";
import { publicEnv } from "@/lib/env";
import {
  SHOP_CATEGORIES,
  allProducts,
  findShopCollection,
  type ShopCategory,
  type ShopCollectionKey,
} from "@/lib/products";
import { SITE_NAME, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Shop All Products | Mitul's Market",
  description:
    "Browse our complete collection of wireless audio, smartwatches, mechanical keyboards, backpacks, footwear, and lifestyle essentials at Mitul's Market.",
  path: "/shop",
  keywords: [
    "shop electronics",
    "shop fashion",
    "all products",
    "audio gear",
    "computer accessories",
  ],
});

interface ShopPageProps {
  searchParams: Promise<{
    category?: string | string[];
    collection?: string | string[];
    q?: string | string[];
  }>;
}

function getSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCategory(value?: string | string[]): ShopCategory {
  const singleValue = getSingleParam(value);
  if (!singleValue) return "All";
  const matched = SHOP_CATEGORIES.find(
    (category) => category.toLowerCase() === singleValue.trim().toLowerCase()
  );
  return matched ?? "All";
}

function parseCollection(
  collectionValue?: string | string[],
  categoryValue?: string | string[]
): ShopCollectionKey | null {
  const direct = findShopCollection(getSingleParam(collectionValue));
  if (direct) return direct.key;

  const fromCategory = findShopCollection(getSingleParam(categoryValue));
  if (fromCategory) return fromCategory.key;

  return null;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const initialCategory = parseCategory(params.category);
  const initialCollection = parseCollection(params.collection, params.category);
  const initialSearchQuery = getSingleParam(params.q) ?? "";
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Shop All Products | ${SITE_NAME}`,
    url: `${baseUrl}/shop`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allProducts.length,
      itemListElement: allProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/products/${product.id}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shopJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ShopCatalog
        key={`${initialCategory}-${initialCollection ?? "none"}-${initialSearchQuery}`}
        initialCategory={initialCategory}
        initialCollection={initialCollection}
        initialSearchQuery={initialSearchQuery}
      />
    </>
  );
}
