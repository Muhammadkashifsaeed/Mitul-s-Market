import type { ProductCategory } from "./product";

export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderFilterStatus = "All Orders" | OrderStatus;

export type OrderSortOrder = "newest" | "oldest";

export type OrderDateRange =
  | "all"
  | "last7days"
  | "last30days"
  | "last90days";

export type PaymentMethod =
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Cash on Delivery";

export type PaymentStatus =
  | "Paid"
  | "Pending on Delivery"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  category: ProductCategory;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderStatusHistory {
  placedAt: string;
  confirmedAt?: string;
  processingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderTimelineStep {
  stepNumber: 1 | 2 | 3 | 4 | 5;
  label:
    | "Order Placed"
    | "Order Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered";
  description: string;
  completed: boolean;
  isCurrent: boolean;
  timestamp?: string;
}

export interface Order {
  id: string;
  customerId: string;
  isDemo: boolean;
  orderDate: string;
  status: OrderStatus;
  customer: OrderCustomer;
  shippingAddress: DeliveryAddress;
  deliveryNotes?: string;
  items: readonly OrderItem[];
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  carrierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory: OrderStatusHistory;
}

export interface OrdersApiPayload {
  backendConfigured: boolean;
  authenticated: boolean;
  customerId: string | null;
  orders: Order[];
}

