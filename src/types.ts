export type UserRole = 'customer' | 'restaurant_owner' | 'rider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  token?: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g. "20-30 min"
  deliveryFee: number;
  minOrder: number;
  address: string;
  city: string;
  state: string;
  categories: string[];
  openingHours: string;
  isOpen: boolean;
  verified: boolean;
  commissionRate: number; // percentage e.g. 15
}

export interface FoodOptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface FoodOptionGroup {
  id: string;
  title: string; // e.g. "Choose Protein" or "Drink Size"
  required: boolean;
  maxSelect: number;
  choices: FoodOptionChoice[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  options?: FoodOptionGroup[];
}

export type OrderStatus =
  | 'placed'
  | 'payment_confirmed'
  | 'restaurant_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'rider_arrived'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';

export type PaymentMethod = 'paystack' | 'flutterwave' | 'card' | 'transfer';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: { groupTitle: string; choiceName: string; price: number }[];
  specialInstructions?: string;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    landmark?: string;
    gpsNotes?: string;
  };
  deliveryPin: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  rating?: number;
  review?: string;
}

export interface Rider {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'car';
  licenseNumber: string;
  status: 'offline' | 'online' | 'busy';
  currentLat: number;
  currentLng: number;
  rating: number;
  totalDeliveries: number;
  earningsBalance: number;
  verified: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  active: boolean;
  usageCount: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  replies: { senderName: string; message: string; timestamp: string }[];
}

export interface Review {
  id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  baseFee: number;
  estimatedMinutes: number;
}
