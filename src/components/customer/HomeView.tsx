import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Star, Clock, MapPin, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { restaurants, foodItems, setActiveView, setSelectedRestaurantId, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Nigerian Food', icon: '🍲', desc: 'Jollof, Egusi, Pounded Yam' },
    { name: 'Fast Food', icon: '🍔', desc: 'Burgers, Fries, Wings' },
    { name: 'Pizza', icon: '🍕', desc: 'Wood-fired & Cheese' },
    { name: 'Chinese Food', icon: '🍜', desc: 'Sushi, Noodles, Fried Rice' },
    { name: 'Chicken', icon: '🍗', desc: 'Crispy & Grilled' },
    { name: 'Seafood', icon: '🦐', desc: 'Prawns, Fish, Calamari' },
    { name: 'Pastries & Cakes', icon: '🎂', desc: 'Sweet treats & Bakes' },
    { name: 'Healthy Food', icon: '🥗', desc: 'Salads & Smoothies' },
  ];

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory ? r.categories.includes(selectedCategory) : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-14 text-white">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>AI-Powered Food Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            WHAT WOULD YOU LIKE TO EAT TODAY?
          </h1>
          <p className="text-sm sm:text-base text-orange-100 font-medium">
            Discover top-rated restaurants, browse gourmet menus, and get food delivered blazing fast with live tracking and secure payments.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-2xl space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-3 px-4 py-2 flex-1 w-full">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
              <input
                type="text"
                placeholder="Enter delivery address (e.g. Victoria Island, Lagos)"
                defaultValue="42 Admiralty Way, Lekki Phase 1"
                className="w-full text-xs sm:text-sm text-zinc-800 dark:text-white bg-transparent focus:outline-none"
              />
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>
            <div className="flex items-center space-x-3 px-4 py-2 flex-1 w-full">
              <Search className="w-5 h-5 text-orange-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisine, or dishes..."
                className="w-full text-xs sm:text-sm text-zinc-800 dark:text-white bg-transparent focus:outline-none"
              />
            </div>
            <button
              onClick={() => setActiveView('restaurants')}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg shadow-orange-600/30 shrink-0"
            >
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Explore Categories</h2>
          <button 
            onClick={() => setActiveView('restaurants')} 
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedCategory(cat.name); setActiveView('restaurants'); }}
              className={`flex flex-col items-center p-4 rounded-2xl transition transform hover:-translate-y-1 border text-center ${selectedCategory === cat.name ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-orange-500/50'}`}
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="font-bold text-xs">{cat.name}</span>
              <span className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-3 max-w-xl z-10 mb-6 md:mb-0">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-yellow-300 text-xs font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>Use Code: WELCOME50</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">Get 50% Off Your First Meal</h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Enjoy your favorite dishes from top restaurants with half price discount on orders above ₦2,000.
            </p>
          </div>
          <button
            onClick={() => setActiveView('restaurants')}
            className="z-16 bg-white text-zinc-900 hover:bg-zinc-100 font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg"
          >
            Order with Discount
          </button>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Featured Restaurants Near You</h2>
            <p className="text-xs text-zinc-500">Verified vendors offering express delivery</p>
          </div>
          <button 
            onClick={() => setActiveView('restaurants')} 
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>See All ({restaurants.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map(rest => (
            <div
              key={rest.id}
              onClick={() => { setSelectedRestaurantId(rest.id); setActiveView('restaurant_detail'); }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={rest.coverImage}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 text-xs font-bold text-zinc-800 dark:text-white shadow-md">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span>{rest.rating}</span>
                  <span className="text-[10px] text-zinc-400">({rest.reviewCount})</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-orange-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                  ₦{rest.deliveryFee.toLocaleString()} Delivery
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={rest.logo} alt={rest.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shadow" />
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-orange-600 transition">{rest.name}</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{rest.categories.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 font-medium">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>{rest.deliveryTime}</span>
                  </div>
                  <div>Min. ₦{rest.minOrder.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Meals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Trending Dishes</h2>
            <p className="text-xs text-zinc-500">Most ordered meals this week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.slice(0, 6).map(food => {
            const rest = restaurants.find(r => r.id === food.restaurantId);
            return (
              <div key={food.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm flex space-x-4 items-center">
                <img src={food.image} alt={food.name} className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow" />
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">{rest?.name}</span>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{food.name}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">{food.description}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-black text-sm text-zinc-900 dark:text-white">₦{food.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(food)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
