import { InnerProduct } from '@/interfaces/cart';  

export interface CartItem {
  _id?: string;
  product?: InnerProduct;
  price?: number;
  count?: number;
}

export interface ShippingAddress {
  details?: string;
  phone?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  cartItems?: CartItem[];
  shippingAddress?: ShippingAddress;
  paymentMethodType?: string;
  paidAt?: string;
  totalOrderPrice?: number;
}
