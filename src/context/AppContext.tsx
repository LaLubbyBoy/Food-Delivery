import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Restaurant, FoodItem, Order, Rider, Promotion, SupportTicket, Review, OrderStatus } from '../types';

interface CartItem {
  food: FoodItem;
  quantity: number;
  selectedOptions?: { groupTitle: string; choiceName: string; price: number }[];
  specialInstructions?: string;
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  orders: Order[];
  riders: Rider[];
  promotions: Promotion[];
  supportTickets: SupportTicket[];
  reviews: Review[];
  notifications: { id: string; title: string; message: string; timestamp: string; read: boolean }[];
  markNotificationRead: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  cartRestaurantId: string | null;
  addToCart: (food: FoodItem, quantity?: number, selectedOptions?: any[], specialInstructions?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  
  // Actions
  createOrder: (deliveryAddress: any, paymentMethod: any, promoCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, updatedBy?: string) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
  updateRiderLocation: (riderId: string, lat: number, lng: number) => void;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'rating' | 'reviewCount' | 'verified'>) => void;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (item: FoodItem) => void;
  addReview: (restaurantId: string, rating: number, comment: string, foodId?: string) => void;
  submitSupportTicket: (subject: string, message: string) => void;
  replySupportTicket: (ticketId: string, message: string) => void;
  addPromotion: (promo: Omit<Promotion, 'id' | 'usageCount'>) => void;
  
  // UI toggles
  activeView: string;
  setActiveView: (view: string) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Data
const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    ownerId: 'owner-1',
    name: 'KFC & Grill Masters',
    description: 'Crispy fried chicken, zesty wings, burgers, and loaded fries.',
    logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: '20-30 min',
    deliveryFee: 1200,
    minOrder: 2500,
    address: '42 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    categories: ['Fast Food', 'Chicken', 'Burgers'],
    openingHours: '8:00 AM - 11:00 PM',
    isOpen: true,
    verified: true,
    commissionRate: 15,
  },
  {
    id: 'rest-2',
    ownerId: 'owner-2',
    name: 'Mama Cass Traditional Kitchen',
    description: 'Authentic Nigerian Jollof, Ofada rice, pounded yam, and rich soups.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 512,
    deliveryTime: '25-40 min',
    deliveryFee: 1500,
    minOrder: 3000,
    address: '15 Awolowo Road, Ikoyi',
    city: 'Lagos',
    state: 'Lagos State',
    categories: ['Nigerian Food', 'African Cuisine', 'Rice and Pasta'],
    openingHours: '9:00 AM - 10:00 PM',
    isOpen: true,
    verified: true,
    commissionRate: 12,
  },
  {
    id: 'rest-3',
    ownerId: 'owner-3',
    name: 'Tokyo Sushi & Asian Bar',
    description: 'Fresh salmon sashimi, crunchy dragon rolls, ramen, and tempura.',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 188,
    deliveryTime: '30-45 min',
    deliveryFee: 2000,
    minOrder: 5000,
    address: '8 Victoria Island Boulevard',
    city: 'Lagos',
    state: 'Lagos State',
    categories: ['Chinese Food', 'Seafood', 'Healthy Food'],
    openingHours: '12:00 PM - 11:30 PM',
    isOpen: true,
    verified: true,
    commissionRate: 18,
  },
  {
    id: 'rest-4',
    ownerId: 'owner-4',
    name: 'The Crust & Cheese Pizza',
    description: 'Wood-fired artisanal pizzas with rich mozzarella and imported toppings.',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 275,
    deliveryTime: '25-35 min',
    deliveryFee: 1500,
    minOrder: 4000,
    address: '12 Adeola Odeku St, Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    categories: ['Pizza', 'Fast Food', 'Snacks'],
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true,
    verified: true,
    commissionRate: 15,
  },
];

const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    restaurantId: 'rest-1',
    name: 'Mega Zinger Burger Combo',
    description: 'Double crunchy chicken breast, spicy mayo, crisp lettuce, cheese slice, and large fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    price: 6500,
    category: 'Burgers',
    isAvailable: true,
    prepTimeMinutes: 15,
    options: [
      {
        id: 'opt-1',
        title: 'Choose Drink',
        required: true,
        maxSelect: 1,
        choices: [
          { id: 'c-1', name: 'Coca Cola 50ccl', price: 500 },
          { id: 'c-2', name: 'Sprite 50ccl', price: 500 },
          { id: 'c-3', name: 'Maltina 50ccl', price: 600 },
        ],
      },
    ],
  },
  {
    id: 'food-2',
    restaurantId: 'rest-1',
    name: 'Spicy Hot Wings (10 pcs)',
    description: 'Juicy chicken wings glazed in fiery buffalo sauce with ranch dip.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    price: 5200,
    category: 'Chicken',
    isAvailable: true,
    prepTimeMinutes: 12,
  },
  {
    id: 'food-3',
    restaurantId: 'rest-2',
    name: 'Party Jollof Rice with Fried Turkey & Plantain',
    description: 'Smoky firewood party jollof served with succulent fried turkey and sweet dodo.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    price: 5800,
    category: 'Nigerian Food',
    isAvailable: true,
    prepTimeMinutes: 20,
    options: [
      {
        id: 'opt-2',
        title: 'Protein Choice',
        required: true,
        maxSelect: 1,
        choices: [
          { id: 'p-1', name: 'Fried Turkey', price: 0 },
          { id: 'p-2', name: 'Beef Suya Cut', price: 500 },
          { id: 'p-3', name: 'Grilled Tilapia Fish', price: 1500 },
        ],
      },
    ],
  },
  {
    id: 'food-4',
    restaurantId: 'rest-2',
    name: 'Pounded Yam & Egusi Soup with Goat Meat',
    description: 'Smooth pounded yam served with rich melon soup packed with stockfish and tender goat meat.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    price: 7500,
    category: 'African Cuisine',
    isAvailable: true,
    prepTimeMinutes: 25,
  },
  {
    id: 'food-5',
    restaurantId: 'rest-3',
    name: 'Salmon Supreme Sushi Platter (16 pcs)',
    description: 'Fresh salmon nigiri, California maki rolls, and spicy tuna rolls.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    price: 14500,
    category: 'Chinese Food',
    isAvailable: true,
    prepTimeMinutes: 30,
  },
  {
    id: 'food-6',
    restaurantId: 'rest-4',
    name: 'Pepperoni & Extra Cheese Pizza (Large)',
    description: 'Generous Italian pepperoni slices over double layer mozzarella cheese and tomato basil sauce.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    price: 9800,
    category: 'Pizza',
    isAvailable: true,
    prepTimeMinutes: 20,
  },
];

const INITIAL_RIDERS: Rider[] = [
  {
    id: 'rider-1',
    userId: 'r-user-1',
    name: 'Chinedu Okafor',
    phone: '+234 803 123 4567',
    email: 'chinedu@bitedash.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'motorcycle',
    licenseNumber: 'LAG-9821-MC',
    status: 'online',
    currentLat: 6.4474,
    currentLng: 3.4723,
    rating: 4.9,
    totalDeliveries: 1240,
    earningsBalance: 84500,
    verified: true,
  },
  {
    id: 'rider-2',
    userId: 'r-user-2',
    name: 'Ibrahim Sanni',
    phone: '+234 802 987 6543',
    email: 'ibrahim@bitedash.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'motorcycle',
    licenseNumber: 'LAG-4412-MC',
    status: 'online',
    currentLat: 6.4531,
    currentLng: 3.4612,
    rating: 4.8,
    totalDeliveries: 890,
    earningsBalance: 62000,
    verified: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'FD-2026-000101',
    customerId: 'cust-1',
    customerName: 'Amina Yusuf',
    customerPhone: '+234 810 555 1234',
    restaurantId: 'rest-1',
    restaurantName: 'KFC & Grill Masters',
    riderId: 'rider-1',
    riderName: 'Chinedu Okafor',
    riderPhone: '+234 803 123 4567',
    items: [
      {
        foodId: 'food-1',
        name: 'Mega Zinger Burger Combo',
        price: 6500,
        quantity: 2,
        selectedOptions: [{ groupTitle: 'Choose Drink', choiceName: 'Coca Cola 50ccl', price: 500 }],
        specialInstructions: 'Extra spicy mayo please!',
      },
    ],
    subtotal: 14000,
    deliveryFee: 1200,
    serviceFee: 500,
    discountAmount: 0,
    total: 15700,
    currency: 'NGN',
    status: 'out_for_delivery',
    paymentStatus: 'successful',
    paymentMethod: 'paystack',
    deliveryAddress: {
      street: '14 Sanusi Fafunwa Street',
      city: 'Victoria Island',
      state: 'Lagos',
      landmark: 'Near Eko Hotel',
    },
    deliveryPin: '4821',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    statusHistory: [
      { status: 'placed', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), updatedBy: 'Amina Yusuf' },
      { status: 'payment_confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(), updatedBy: 'Paystack Gateway' },
      { status: 'restaurant_accepted', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), updatedBy: 'KFC Manager' },
      { status: 'preparing', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), updatedBy: 'Kitchen Staff' },
      { status: 'ready_for_pickup', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), updatedBy: 'Kitchen Staff' },
      { status: 'rider_assigned', timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(), updatedBy: 'System Auto-Assign' },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), updatedBy: 'Chinedu Okafor' },
    ],
  },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    code: 'WELCOME50',
    title: '50% Off First Order',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 2000,
    expiryDate: '2026-12-31',
    active: true,
    usageCount: 142,
  },
  {
    id: 'promo-2',
    code: 'FREEDEL',
    title: 'Free Delivery Weekend',
    discountType: 'free_delivery',
    discountValue: 1500,
    minOrderAmount: 4000,
    expiryDate: '2026-12-31',
    active: true,
    usageCount: 89,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'cust-1',
    name: 'Amina Yusuf',
    email: 'amina@example.com',
    role: 'customer',
    phone: '+234 810 555 1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tick-1',
      userId: 'cust-1',
      userName: 'Amina Yusuf',
      userRole: 'customer',
      subject: 'Question about delivery time',
      message: 'Will my order arrive within 30 minutes?',
      status: 'resolved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      replies: [
        { senderName: 'Support Agent', message: 'Yes! Your rider is already en route.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() }
      ]
    }
  ]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Order Out for Delivery!', message: 'Your order FD-2026-000101 is on the way with Chinedu.', timestamp: '5 mins ago', read: false },
    { id: 'notif-2', title: 'Welcome to BiteDash!', message: 'Use code WELCOME50 for 50% off your first meal.', timestamp: '1 hour ago', read: true },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurantId, setCartRestaurantId] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<string>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Sync role switcher
  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'customer') {
      setCurrentUser({ id: 'cust-1', name: 'Amina Yusuf', email: 'amina@example.com', role: 'customer', phone: '+234 810 555 1234', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
    } else if (role === 'restaurant_owner') {
      setCurrentUser({ id: 'owner-1', name: 'Chef Tunde', email: 'tunde@kfcgrill.com', role: 'restaurant_owner', phone: '+234 802 333 4444', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&auto=format&fit=crop&q=80' });
    } else if (role === 'rider') {
      setCurrentUser({ id: 'rider-1', name: 'Chinedu Okafor', email: 'chinedu@bitedash.com', role: 'rider', phone: '+234 803 123 4567', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' });
    } else if (role === 'admin') {
      setCurrentUser({ id: 'admin-1', name: 'Super Administrator', email: 'admin@bitedash.com', role: 'admin', phone: '+234 800 000 0000', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' });
    }
  };

  const login = (email: string, role: UserRole, name = 'User') => {
    setCurrentUser({ id: `user-${Date.now()}`, name, email, role, phone: '+234 801 111 2222', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' });
    setCurrentRole(role);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addToCart = (food: FoodItem, quantity = 1, selectedOptions: any[] = [], specialInstructions = '') => {
    if (cartRestaurantId && cartRestaurantId !== food.restaurantId) {
      if (!window.confirm('Your cart contains items from another restaurant. Do you want to clear your cart and start a new order?')) {
        return;
      }
      setCart([]);
    }
    setCartRestaurantId(food.restaurantId);
    setCart(prev => [...prev, { food, quantity, selectedOptions, specialInstructions }]);
    setNotifications(prev => [{ id: `notif-${Date.now()}`, title: 'Added to Cart', message: `${food.name} added to your cart.`, timestamp: 'Just now', read: false }, ...prev]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setCartRestaurantId(null);
      return next;
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurantId(null);
  };

  const createOrder = (deliveryAddress: any, paymentMethod: any, promoCode?: string): Order => {
    const rest = restaurants.find(r => r.id === cartRestaurantId);
    const subtotal = cart.reduce((acc, item) => {
      const optsTotal = (item.selectedOptions || []).reduce((sum, o) => sum + o.price, 0);
      return acc + (item.food.price + optsTotal) * item.quantity;
    }, 0);
    const deliveryFee = rest ? rest.deliveryFee : 1200;
    const serviceFee = 500;
    let discountAmount = 0;
    if (promoCode === 'WELCOME50') {
      discountAmount = Math.round(subtotal * 0.5);
    } else if (promoCode === 'FREEDEL') {
      discountAmount = deliveryFee;
    }
    const total = subtotal + deliveryFee + serviceFee - discountAmount;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `FD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: currentUser?.id || 'cust-1',
      customerName: currentUser?.name || 'Customer',
      customerPhone: currentUser?.phone || '+234 800 000 0000',
      restaurantId: cartRestaurantId || 'rest-1',
      restaurantName: rest?.name || 'Restaurant',
      items: cart.map(i => ({
        foodId: i.food.id,
        name: i.food.name,
        price: i.food.price,
        quantity: i.quantity,
        selectedOptions: i.selectedOptions,
        specialInstructions: i.specialInstructions,
      })),
      subtotal,
      deliveryFee,
      serviceFee,
      discountAmount,
      total,
      currency: 'NGN',
      status: 'placed',
      paymentStatus: 'successful',
      paymentMethod,
      deliveryAddress,
      deliveryPin: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        { status: 'placed', timestamp: new Date().toISOString(), updatedBy: currentUser?.name || 'Customer' },
        { status: 'payment_confirmed', timestamp: new Date().toISOString(), updatedBy: 'Payment Gateway' }
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveView('customer_orders');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, updatedBy = 'Staff') => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
          statusHistory: [...ord.statusHistory, { status, timestamp: new Date().toISOString(), updatedBy }]
        };
      }
      return ord;
    }));
  };

  const assignRiderToOrder = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          riderId,
          riderName: rider?.name || 'Rider',
          riderPhone: rider?.phone || '+234 800 000',
          status: 'rider_assigned',
          updatedAt: new Date().toISOString(),
          statusHistory: [...ord.statusHistory, { status: 'rider_assigned', timestamp: new Date().toISOString(), updatedBy: 'Dispatcher' }]
        };
      }
      return ord;
    }));
  };

  const updateRiderLocation = (riderId: string, lat: number, lng: number) => {
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, currentLat: lat, currentLng: lng } : r));
  };

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'rating' | 'reviewCount' | 'verified'>) => {
    const newRest: Restaurant = {
      ...restaurantData,
      id: `rest-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      verified: false,
    };
    setRestaurants(prev => [newRest, ...prev]);
  };

  const addFoodItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: `food-${Date.now()}`,
    };
    setFoodItems(prev => [...prev, newItem]);
  };

  const updateFoodItem = (updatedItem: FoodItem) => {
    setFoodItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const addReview = (restaurantId: string, rating: number, comment: string, foodId?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      restaurantId,
      customerId: currentUser?.id || 'cust-1',
      customerName: currentUser?.name || 'Customer',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const submitSupportTicket = (subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      userId: currentUser?.id || 'cust-1',
      userName: currentUser?.name || 'User',
      userRole: currentRole,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          replies: [...t.replies, { senderName: currentUser?.name || 'Support', message, timestamp: new Date().toISOString() }]
        };
      }
      return t;
    }));
  };

  const addPromotion = (promo: Omit<Promotion, 'id' | 'usageCount'>) => {
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      usageCount: 0,
    };
    setPromotions(prev => [newPromo, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        login,
        logout,
        restaurants,
        foodItems,
        orders,
        riders,
        promotions,
        supportTickets,
        reviews,
        notifications,
        markNotificationRead,
        cart,
        cartRestaurantId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus,
        assignRiderToOrder,
        updateRiderLocation,
        addRestaurant,
        addFoodItem,
        updateFoodItem,
        addReview,
        submitSupportTicket,
        replySupportTicket,
        addPromotion,
        activeView,
        setActiveView,
        selectedRestaurantId,
        setSelectedRestaurantId,
        selectedOrderId,
        setSelectedOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
