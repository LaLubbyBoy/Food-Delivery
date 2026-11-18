import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Star, Clock, MapPin, Filter } from 'lucide-react';

export const RestaurantDiscoveryView: React.FC = () => {
  const { restaurants, setSelectedRestaurantId, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Nigerian Food', 'Fast Food', 'Pizza', 'Chinese Food', 'Chicken', 'Seafood', 'Burgers'];

  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCat === 'All' || r.categories.includes(selectedCat);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">All Restaurants</h1>
          <p className="text-xs text-zinc-500 mt-1">Discover top-tier local vendors delivering to your location</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or cuisine..."
            className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCat === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(rest => (
          <div
            key={rest.id}
            onClick={() => { setSelectedRestaurantId(rest.id); setActiveView('restaurant_detail'); }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative h-52 overflow-hidden">
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

              <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">{rest.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 font-medium">
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
  );
};
