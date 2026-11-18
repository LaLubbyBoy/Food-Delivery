import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils, DollarSign, ShoppingBag, Plus, Sparkles, CheckCircle, XCircle, Clock } from 'lucide-react';

export const RestaurantDashboard: React.FC = () => {
  const { restaurants, foodItems, orders, updateOrderStatus, addFoodItem, updateFoodItem } = useApp();

  const restaurant = restaurants[0]; // Active restaurant for demo
  const restOrders = orders.filter(o => o.restaurantId === restaurant.id);
  const restMenu = foodItems.filter(f => f.restaurantId === restaurant.id);

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const [newFoodModal, setNewFoodModal] = useState(false);

  // New food form state
  const [foodName, setFoodName] = useState('');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodCategory, setFoodCategory] = useState('Burgers');
  const [foodImage, setFoodImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80');
  const [aiGenerating, setAiGenerating] = useState(false);

  const totalRevenue = restOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

  const handleGenerateAiDescription = async () => {
    if (!foodName) {
      alert('Please enter dish name first');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/menu-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName: foodName, ingredients: foodDesc || 'Fresh quality ingredients' }),
      });
      const data = await res.json();
      if (data.description) {
        setFoodDesc(data.description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAddFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodPrice) return;
    addFoodItem({
      restaurantId: restaurant.id,
      name: foodName,
      description: foodDesc || 'Delicious freshly prepared meal.',
      image: foodImage,
      price: parseFloat(foodPrice),
      category: foodCategory,
      isAvailable: true,
      prepTimeMinutes: 15,
    });
    setNewFoodModal(false);
    setFoodName('');
    setFoodDesc('');
    setFoodPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Overview Cards */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-2xl object-cover shadow" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Restaurant Dashboard</div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{restaurant.name}</h1>
            <p className="text-xs text-zinc-500">{restaurant.address} • {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed'}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setNewFoodModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">₦{totalRevenue.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% from last week</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{restOrders.length}</div>
          <p className="text-[10px] text-zinc-400">All time orders received</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Menu Items</span>
            <Utensils className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{restMenu.length}</div>
          <p className="text-[10px] text-blue-600 font-semibold">Active & Available</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
            <span className="text-yellow-500 font-bold">★</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{restaurant.rating}</div>
          <p className="text-[10px] text-zinc-400">Based on {restaurant.reviewCount} reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'}`}
        >
          Live Orders ({restOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'menu' ? 'bg-orange-600 text-white shadow' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'}`}
        >
          Menu Management ({restMenu.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {restOrders.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 p-12 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500">
              No orders received yet.
            </div>
          ) : (
            restOrders.map(ord => (
              <div key={ord.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-black text-sm text-zinc-900 dark:text-white">{ord.orderNumber} • {ord.customerName}</div>
                    <div className="text-xs text-zinc-500">{new Date(ord.createdAt).toLocaleTimeString()} • Phone: {ord.customerPhone}</div>
                  </div>
                  <span className="font-black text-sm text-orange-600">₦{ord.total.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ord.items.map((item, i) => (
                    <div key={i} className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl text-xs">
                      <span className="font-bold text-zinc-900 dark:text-white">{item.quantity}x {item.name}</span>
                      {item.specialInstructions && <div className="text-[10px] text-zinc-400 italic">Note: {item.specialInstructions}</div>}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold uppercase text-zinc-500">Status: <span className="text-orange-600">{ord.status}</span></span>
                  <div className="flex space-x-2">
                    {ord.status === 'payment_confirmed' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'restaurant_accepted', 'Kitchen Manager')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'cancelled', 'Kitchen Manager')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {ord.status === 'restaurant_accepted' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing', 'Kitchen Staff')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Start Preparing
                      </button>
                    )}
                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup', 'Kitchen Staff')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restMenu.map(food => (
            <div key={food.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{food.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{food.description}</p>
                  <div className="font-black text-sm text-zinc-900 dark:text-white pt-1">₦{food.price.toLocaleString()}</div>
                </div>
                <img src={food.image} alt={food.name} className="w-20 h-20 rounded-2xl object-cover shadow shrink-0" />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${food.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {food.isAvailable ? 'Available' : 'Sold Out'}
                </span>
                <button
                  onClick={() => updateFoodItem({ ...food, isAvailable: !food.isAvailable })}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Toggle Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Food Modal */}
      {newFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddFoodSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">Add New Menu Dish</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Dish Name</label>
                <input
                  type="text"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  placeholder="e.g. Suya Cheese Burger"
                  required
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={aiGenerating}
                    className="text-[11px] text-orange-600 font-bold flex items-center space-x-1 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiGenerating ? 'Generating AI...' : 'AI Generate Description'}</span>
                  </button>
                </div>
                <textarea
                  value={foodDesc}
                  onChange={e => setFoodDesc(e.target.value)}
                  placeholder="Appetizing description..."
                  rows={3}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl p-3 text-xs text-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Price (NGN)</label>
                  <input
                    type="number"
                    value={foodPrice}
                    onChange={e => setFoodPrice(e.target.value)}
                    placeholder="4500"
                    required
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                  <select
                    value={foodCategory}
                    onChange={e => setFoodCategory(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white"
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Nigerian Food">Nigerian Food</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chinese Food">Chinese Food</option>
                    <option value="Chicken">Chicken</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setNewFoodModal(false)}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
