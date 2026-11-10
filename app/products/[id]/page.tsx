import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsView } from "@/components/ProductDetailsView";
import { publicEnv } from "@/lib/env";
import { allProducts, getProductById } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return createPageMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found at Mitul's Market.",
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: product.name,
    description: `${product.description} Rated ${product.rating.toFixed(1)}/5 across ${product.reviewsCount} reviews — ₹${product.price}.`,
    path: `/products/${product.id}`,
    keywords: [product.name, product.category, "buy online", "Mitul's Market"],
    image: {
      url: product.image,
      alt: product.name,
    },
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.category === product.category
    )
    .slice(0, 4);

  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  const productUrl = `${baseUrl}/products/${product.id}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shop",
            item: `${baseUrl}/shop`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.category,
            item: `${baseUrl}/shop?category=${encodeURIComponent(product.category)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: productUrl,
          },
        ],
      },
      {
        "@type": "Product",
        name: product.name,
        image: `${baseUrl}${product.image}`,
        description: product.description,
        category: product.category,
        brand: {
          "@type": "Brand",
          name: "Mitul's Market",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: productUrl,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewsCount,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailsView product={product} relatedProducts={relatedProducts} />
    </>
  );
}

