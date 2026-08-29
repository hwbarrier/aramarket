export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'bank_transfer'
  | 'cash_on_delivery'
  | 'crypto';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
  vendorId?: string;
  vendorName?: string;
}

export interface VendorOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryStatus: OrderStatus;
  subtotal: number;
  commissionRate?: number;
  commissionAmount?: number;
  vendorPayout?: number;
  userId?: string;
  carrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDeliveryDate?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface ShippingInfo {
  method: string;
  cost: number;
  estimatedDays: number;
  trackingNumber?: string;
  carrier?: string;
  address: ShippingAddress;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingInfo: ShippingInfo;
  orderDate: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  trackingHistory?: TrackingEvent[];
  returnInfo?: ReturnInfo;
  customer?: OrderCustomer;
  vendors?: VendorOrder[];
  createdAt?: string;
  transactionId?: string;
  paymentProvider?: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: Date;
}

export interface ReturnInfo {
  requestDate: Date;
  reason: string;
  status: 'requested' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  isActive: boolean;
  isFirstTimeUser?: boolean;
}