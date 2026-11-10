export type ProductCategory = "Electronics" | "Fashion";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  rating: number;
  reviewsCount: number;
  price: number;
  stock: number;
  image: string;
  href?: string;
}

export type ProductActionIntent = "add" | "wishlist";

