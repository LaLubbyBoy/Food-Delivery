import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { Package, Clock, MapPin, Star, CheckCircle, Truck, Phone, Navigation } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { orders, currentUser, addReview, updateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const customerOrders = orders.filter(o => o.customerId === (currentUser?.id || 'cust-1'));
  const activeOrders = customerOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = customerOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;
    addReview(reviewOrder.restaurantId, rating, comment);
    setReviewOrder(null);
    alert('Thank you for your review!');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Order Placed</span>;
      case 'payment_confirmed': return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Payment Confirmed</span>;
      case 'restaurant_accepted': return <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">Restaurant Accepted</span>;
      case 'preparing': return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Preparing Meal</span>;
      case 'ready_for_pickup': return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Ready for Pickup</span>;
      case 'rider_assigned': return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Rider Assigned</span>;
      case 'out_for_delivery': return <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">Out for Delivery</span>;
      case 'delivered': return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Delivered</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Customer Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-1">Track your active orders, inspect history, and rate meals</p>
        </div>
        <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'active' ? 'bg-white dark:bg-zinc-900 text-orange-600 shadow' : 'text-zinc-600 dark:text-zinc-400'}`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'history' ? 'bg-white dark:bg-zinc-900 text-orange-600 shadow' : 'text-zinc-600 dark:text-zinc-400'}`}
          >
            Order History ({pastOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {(activeTab === 'active' ? activeOrders : pastOrders).length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Package className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="font-bold text-base text-zinc-800 dark:text-white">No {activeTab} orders found</h3>
            <p className="text-xs text-zinc-500">When you place orders, they will appear here for live tracking and history.</p>
          </div>
        ) : (
          (activeTab === 'active' ? activeOrders : pastOrders).map(ord => (
            <div key={ord.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-sm text-zinc-900 dark:text-white">{ord.orderNumber}</span>
                    {getStatusBadge(ord.status)}
                  </div>
                  <div className="text-xs text-zinc-500">{ord.restaurantName} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-black text-sm text-zinc-900 dark:text-white">₦{ord.total.toLocaleString()}</span>
                  {activeTab === 'active' && (
                    <button
                      onClick={() => setTrackingOrder(ord)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live Track</span>
                    </button>
                  )}
                  {activeTab === 'history' && ord.status === 'delivered' && (
                    <button
                      onClick={() => setReviewOrder(ord)}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition"
                    >
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>Rate Order</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="text-xs">
                      <div className="font-bold text-zinc-900 dark:text-white">{item.quantity}x {item.name}</div>
                      {item.specialInstructions && <div className="text-[10px] text-zinc-400 italic">Note: {item.specialInstructions}</div>}
                    </div>
                    <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Delivery PIN & Rider Info */}
              {ord.riderName && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50 text-xs gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-orange-500 text-white font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-white">Assigned Rider: {ord.riderName}</div>
                      <div className="text-zinc-500 flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{ord.riderPhone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-800 text-center shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-orange-600 block">Delivery PIN</span>
                    <span className="text-base font-black tracking-widest text-zinc-900 dark:text-white">{ord.deliveryPin}</span>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Live Delivery Tracking</h3>
                <p className="text-xs text-zinc-500">Order #{trackingOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Map Simulation Box */}
            <div className="relative h-64 bg-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800 shadow-inner">
              <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <div className="relative z-10 text-center space-y-2 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                <Truck className="w-10 h-10 text-orange-500 mx-auto animate-pulse" />
                <div className="text-sm font-bold text-white">Rider is en route to your address</div>
                <div className="text-xs text-orange-400 font-bold">Estimated Arrival: 12 mins</div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Order Progress Timeline</h4>
              <div className="space-y-2">
                {trackingOrder.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center space-x-3 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-zinc-800 dark:text-white capitalize">{h.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-zinc-400">({new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete simulation button for testing */}
            {currentUser?.role === 'customer' && trackingOrder.status !== 'delivered' && (
              <button
                onClick={() => {
                  updateOrderStatus(trackingOrder.id, 'delivered', 'Customer Confirmed');
                  setTrackingOrder(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                Simulate Delivery Received (Confirm PIN)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Rate & Review Restaurant</h3>
            <p className="text-xs text-zinc-500">How was your meal from {reviewOrder.restaurantName}?</p>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 transition ${rating >= star ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-700'}`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Feedback</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Delicious meal and super fast delivery!"
                rows={3}
                required
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl p-3 text-xs text-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setReviewOrder(null)}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
