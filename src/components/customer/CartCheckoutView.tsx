import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Trash2, ArrowLeft, Tag, ShieldCheck, CreditCard, Truck } from 'lucide-react';

export const CartCheckoutView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, restaurants, createOrder, setActiveView } = useApp();

  const restaurant = restaurants.find(r => r.id === cart[0]?.food.restaurantId) || restaurants[0];

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [fullName, setFullName] = useState('Amina Yusuf');
  const [phone, setPhone] = useState('+234 810 555 1234');
  const [street, setStreet] = useState('14 Sanusi Fafunwa Street');
  const [city, setCity] = useState('Victoria Island');
  const [state, setState] = useState('Lagos');
  const [landmark, setLandmark] = useState('Near Eko Hotel');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'card' | 'transfer'>('paystack');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const optsTotal = (item.selectedOptions || []).reduce((sum, o) => sum + o.price, 0);
    return acc + (item.food.price + optsTotal) * item.quantity;
  }, 0);

  const deliveryFee = restaurant ? restaurant.deliveryFee : 1200;
  const serviceFee = 500;
  const total = subtotal + deliveryFee + serviceFee - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME50') {
      setAppliedPromo('WELCOME50');
      setDiscountAmount(Math.round(subtotal * 0.5));
    } else if (promoCode.trim().toUpperCase() === 'FREEDEL') {
      setAppliedPromo('FREEDEL');
      setDiscountAmount(deliveryFee);
    } else {
      alert('Invalid or expired promotion code.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setPaymentModalOpen(true);
  };

  const confirmSecurePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: `REF-${Date.now()}`, provider: paymentMethod, amount: total }),
      });
      const data = await res.json();
      if (data.success) {
        createOrder(
          { street, city, state, landmark },
          paymentMethod,
          appliedPromo || undefined
        );
        setPaymentModalOpen(false);
      } else {
        alert('Payment verification failed. Please try again.');
      }
    } catch (err) {
      alert('Payment processing error.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center mx-auto text-orange-600">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Your cart is currently empty</h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">Explore our top restaurants and add delicious meals to your cart before checking out.</p>
        <button
          onClick={() => setActiveView('restaurants')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center space-x-3">
        <button
          onClick={() => setActiveView('restaurant_detail')}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Checkout & Secure Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            
            {/* Customer Details */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <span>1. Customer Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>2. Delivery Address</span>
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    required
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">City / Area</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      required
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Landmark / GPS Notes</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. Blue gate opposite mall"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span>3. Payment Gateway (Paystack / Flutterwave)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'paystack', name: 'Paystack', icon: '💳' },
                  { id: 'flutterwave', name: 'Flutterwave', icon: '🌍' },
                  { id: 'card', name: 'Debit Card', icon: '🏦' },
                  { id: 'transfer', name: 'Bank Transfer', icon: '⚡' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex flex-col items-center p-3 rounded-2xl border font-bold text-xs transition ${paymentMethod === m.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'}`}
                  >
                    <span className="text-2xl mb-1">{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-orange-600/30 transition"
            >
              Proceed to Pay ₦{total.toLocaleString()}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 sticky top-24">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Order Summary</h3>
              <span className="text-xs font-bold text-orange-600">{restaurant?.name}</span>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-zinc-900 dark:text-white">{item.food.name}</div>
                    <div className="text-[10px] text-zinc-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-xs text-zinc-900 dark:text-white">₦{(item.food.price * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Discount Promo Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="e.g. WELCOME50"
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2 text-xs uppercase text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-zinc-900 dark:bg-zinc-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Promo code {appliedPromo} applied successfully!</span>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Service Fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-zinc-900 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">Secure {paymentMethod.toUpperCase()} Payment</h3>
              <p className="text-xs text-zinc-500">Confirming payment of <span className="font-black text-zinc-900 dark:text-white">₦{total.toLocaleString()}</span> through secure backend verification.</p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={confirmSecurePayment}
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg disabled:opacity-50"
              >
                {isProcessingPayment ? 'Verifying...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
