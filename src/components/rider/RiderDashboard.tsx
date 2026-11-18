import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bike, DollarSign, Package, CheckCircle, Navigation, Phone, MapPin } from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const { riders, orders, assignRiderToOrder, updateOrderStatus } = useApp();
  const rider = riders[0]; // Active rider for demo

  const [isOnline, setIsOnline] = useState(true);
  const assignedOrders = orders.filter(o => o.riderId === rider.id && o.status !== 'delivered');
  const availableOrders = orders.filter(o => o.status === 'ready_for_pickup' && !o.riderId);
  const completedDeliveries = orders.filter(o => o.riderId === rider.id && o.status === 'delivered');

  const [deliveryPinInput, setDeliveryPinInput] = useState('');
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<any | null>(null);

  const handleAcceptOrder = (orderId: string) => {
    assignRiderToOrder(orderId, rider.id);
  };

  const handleVerifyPinAndDeliver = (orderId: string, correctPin: string) => {
    if (deliveryPinInput.trim() !== correctPin) {
      alert('Incorrect Delivery PIN. Please ask the customer for the correct 4-digit PIN.');
      return;
    }
    updateOrderStatus(orderId, 'delivered', rider.name);
    setDeliveryPinInput('');
    setSelectedActiveOrder(null);
    alert('Delivery completed successfully! Earnings credited.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Status Toggle */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <img src={rider.avatar} alt={rider.name} className="w-16 h-16 rounded-2xl object-cover shadow" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Delivery Rider Dashboard</div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{rider.name}</h1>
            <p className="text-xs text-zinc-500">{rider.vehicleType.toUpperCase()} • License: {rider.licenseNumber}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Status</div>
            <div className={`text-xs font-bold ${isOnline ? 'text-emerald-600' : 'text-red-500'}`}>
              {isOnline ? '🟢 Online & Ready' : '🔴 Offline'}
            </div>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition ${isOnline ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Earnings Balance</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">₦{rider.earningsBalance.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-600 font-semibold">Available for instant payout</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Deliveries</span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{rider.totalDeliveries + completedDeliveries.length}</div>
          <p className="text-[10px] text-zinc-400">Lifetime successful drops</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rider Rating</span>
            <span className="text-yellow-500 font-bold">★</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{rider.rating}</div>
          <p className="text-[10px] text-zinc-400">Top rated logistics partner</p>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Active Assigned Deliveries</h2>
        {assignedOrders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
            No active deliveries assigned right now. Check available requests below.
          </div>
        ) : (
          assignedOrders.map(ord => (
            <div key={ord.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-black text-sm text-zinc-900 dark:text-white">{ord.orderNumber} • {ord.restaurantName}</div>
                  <div className="text-xs text-zinc-500">Customer: {ord.customerName} ({ord.customerPhone})</div>
                </div>
                <button
                  onClick={() => updateOrderStatus(ord.id, 'out_for_delivery', rider.name)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
                >
                  Start Navigation
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs space-y-1">
                <div className="font-bold text-zinc-800 dark:text-zinc-200">Delivery Address:</div>
                <div className="text-zinc-600 dark:text-zinc-300">{ord.deliveryAddress.street}, {ord.deliveryAddress.city}</div>
                {ord.deliveryAddress.landmark && <div className="text-zinc-400">Landmark: {ord.deliveryAddress.landmark}</div>}
              </div>

              {/* PIN Confirmation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter 4-digit PIN"
                    value={deliveryPinInput}
                    onChange={e => setDeliveryPinInput(e.target.value)}
                    maxLength={4}
                    className="bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2 text-xs w-36 text-zinc-800 dark:text-white font-mono tracking-widest"
                  />
                  <button
                    onClick={() => handleVerifyPinAndDeliver(ord.id, ord.deliveryPin)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition"
                  >
                    Confirm Delivery
                  </button>
                </div>
                <span className="text-[11px] text-zinc-400">Ask customer for verification PIN</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Available Delivery Requests */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Available Delivery Requests</h2>
        {availableOrders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
            No pending delivery requests available in your zone.
          </div>
        ) : (
          availableOrders.map(ord => (
            <div key={ord.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-black text-sm text-zinc-900 dark:text-white">{ord.orderNumber} • {ord.restaurantName}</div>
                <div className="text-xs text-zinc-500">Delivery to: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}</div>
                <div className="text-xs font-bold text-orange-600">Estimated Payout: ₦1,500</div>
              </div>
              <button
                onClick={() => handleAcceptOrder(ord.id)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg transition"
              >
                Accept Delivery
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
