import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Users, Utensils, Bike, ShoppingBag, DollarSign, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { restaurants, riders, orders, supportTickets, addPromotion, promotions } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'riders' | 'orders' | 'promos'>('overview');

  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // New promo code form state
  const [promoCode, setPromoCode] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('20');

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const platformCommission = Math.round(totalRevenue * 0.15);

  const handleFetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesData: { totalRevenue, totalOrders: orders.length, activeRestaurants: restaurants.length, activeRiders: riders.length } }),
      });
      const data = await res.json();
      setAiInsights(data.insights || 'Platform operating at optimal efficiency.');
    } catch (err) {
      setAiInsights('Failed to generate AI analytics.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoTitle) return;
    addPromotion({
      code: promoCode.toUpperCase(),
      title: promoTitle,
      discountType: 'percentage',
      discountValue: parseFloat(promoDiscount),
      minOrderAmount: 2000,
      expiryDate: '2026-12-31',
      active: true,
    });
    setPromoCode('');
    setPromoTitle('');
    alert('Promotion code created successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Platform Administrator</div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Admin Control Center</h1>
            <p className="text-xs text-zinc-500">Monitor platform activity, verify vendors, and inspect financials</p>
          </div>
        </div>

        <button
          onClick={handleFetchAiInsights}
          disabled={loadingAi}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{loadingAi ? 'Analyzing...' : 'AI Platform Analytics'}</span>
        </button>
      </div>

      {/* AI Insights Modal Box */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 rounded-3xl text-white shadow-xl relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Google Gemini AI Business Insights</span>
            </h3>
            <button onClick={() => setAiInsights(null)} className="text-xs text-zinc-300 hover:text-white">✕ Close</button>
          </div>
          <p className="text-xs text-zinc-200 whitespace-pre-line">{aiInsights}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross GMV Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">₦{totalRevenue.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-600 font-semibold">Commission (15%): ₦{platformCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{orders.length}</div>
          <p className="text-[10px] text-zinc-400">Platform-wide transactions</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Restaurants</span>
            <Utensils className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{restaurants.length}</div>
          <p className="text-[10px] text-amber-600 font-semibold">Verified Vendors</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Riders</span>
            <Bike className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{riders.length}</div>
          <p className="text-[10px] text-blue-600 font-semibold">Logistics Partners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', name: 'Overview' },
          { id: 'restaurants', name: `Restaurants (${restaurants.length})` },
          { id: 'riders', name: `Riders (${riders.length})` },
          { id: 'orders', name: `All Orders (${orders.length})` },
          { id: 'promos', name: `Promotions (${promotions.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-purple-600 text-white shadow' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(rest => (
            <div key={rest.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <img src={rest.logo} alt={rest.name} className="w-12 h-12 rounded-xl object-cover shadow" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{rest.name}</h3>
                  <p className="text-[11px] text-zinc-500">{rest.city}, {rest.state}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className={`px-2.5 py-1 rounded-full font-bold ${rest.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rest.verified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Commission: {rest.commissionRate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Riders Tab */}
      {activeTab === 'riders' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {riders.map(r => (
            <div key={r.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-xl object-cover shadow" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{r.name}</h3>
                  <p className="text-[11px] text-zinc-500">{r.phone}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Vehicle: {r.vehicleType}</span>
                <span className="font-bold text-emerald-600">Balance: ₦{r.earningsBalance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map(ord => (
            <div key={ord.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
              <div>
                <div className="font-black text-sm text-zinc-900 dark:text-white">{ord.orderNumber} • {ord.restaurantName}</div>
                <div className="text-xs text-zinc-500">Customer: {ord.customerName} • Rider: {ord.riderName || 'Unassigned'}</div>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-zinc-900 dark:text-white">₦{ord.total.toLocaleString()}</span>
                <div className="text-[10px] uppercase font-bold text-orange-600">{ord.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promos Tab */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Create New Promotion Code</h3>
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">Promo Code</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  required
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2 text-xs uppercase text-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">Promo Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Special 20% Off"
                  value={promoTitle}
                  onChange={e => setPromoTitle(e.target.value)}
                  required
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2 text-xs text-zinc-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Create Promo
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Active Promotional Campaigns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promotions.map(p => (
                <div key={p.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-purple-600">{p.code}</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                  </div>
                  <div className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{p.title}</div>
                  <div className="text-[11px] text-zinc-400">Usage count: {p.usageCount} orders</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
