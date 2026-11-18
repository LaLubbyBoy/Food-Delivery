import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { Star, Clock, MapPin, ArrowLeft, Plus, X, ShoppingBag } from 'lucide-react';

export const RestaurantDetailView: React.FC = () => {
  const { restaurants, foodItems, selectedRestaurantId, setActiveView, addToCart } = useApp();

  const restaurant = restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];
  const menu = foodItems.filter(f => f.restaurantId === restaurant.id);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<{ [groupTitle: string]: { name: string; price: number } }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];

  const filteredMenu = menu.filter(m => selectedCategory === 'All' || m.category === selectedCategory);

  const handleOpenCustomize = (item: FoodItem) => {
    if (item.options && item.options.length > 0) {
      setCustomizingItem(item);
      setQuantity(1);
      setSelectedChoices({});
      setSpecialInstructions('');
    } else {
      addToCart(item, 1, [], '');
    }
  };

  const handleAddCustomizedToCart = () => {
    if (!customizingItem) return;
    const formattedOptions = Object.entries(selectedChoices).map(([groupTitle, choice]) => ({
      groupTitle,
      choiceName: choice.name,
      price: choice.price,
    }));
    addToCart(customizingItem, quantity, formattedOptions, specialInstructions);
    setCustomizingItem(null);
  };

  return (
    <div className="pb-24">
      
      {/* Cover Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setActiveView('restaurants')}
            className="flex items-center space-x-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-white shadow-lg transition hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-md" />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{restaurant.name}</h1>
              <p className="text-xs text-zinc-500">{restaurant.categories.join(' • ')}</p>
              <div className="flex items-center space-x-3 text-xs text-zinc-600 dark:text-zinc-300 pt-1">
                <span className="flex items-center space-x-1 font-bold text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span>{restaurant.rating}</span>
                  <span className="text-zinc-400 font-normal">({restaurant.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{restaurant.deliveryTime}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-orange-50 dark:bg-orange-950/30 px-5 py-3 rounded-2xl border border-orange-200/50 dark:border-orange-900/50">
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">Delivery Fee</div>
              <div className="font-black text-sm text-zinc-900 dark:text-white">₦{restaurant.deliveryFee.toLocaleString()}</div>
            </div>
            <div className="w-px h-8 bg-orange-200 dark:bg-orange-900"></div>
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">Min. Order</div>
              <div className="font-black text-sm text-zinc-900 dark:text-white">₦{restaurant.minOrder.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none border-b border-zinc-200 dark:border-zinc-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6">Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(food => (
            <div key={food.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-lg transition">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{food.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{food.description}</p>
                  <div className="font-black text-sm text-zinc-900 dark:text-white pt-1">₦{food.price.toLocaleString()}</div>
                </div>
                <img src={food.image} alt={food.name} className="w-24 h-24 rounded-2xl object-cover shadow shrink-0" />
              </div>

              <button
                onClick={() => handleOpenCustomize(food)}
                className="w-full bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
            <div className="relative h-48 bg-zinc-900">
              <img src={customizingItem.image} alt={customizingItem.name} className="w-full h-full object-cover opacity-85" />
              <button
                onClick={() => setCustomizingItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-black text-lg">{customizingItem.name}</h3>
                <p className="text-sm font-bold text-orange-400">₦{customizingItem.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <p className="text-xs text-zinc-500">{customizingItem.description}</p>

              {/* Options & Choices */}
              {customizingItem.options?.map(group => (
                <div key={group.id} className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{group.title}</h4>
                    {group.required && <span className="text-[10px] text-orange-600 font-semibold">Required</span>}
                  </div>
                  <div className="space-y-2">
                    {group.choices.map(choice => {
                      const isSelected = selectedChoices[group.title]?.name === choice.name;
                      return (
                        <button
                          key={choice.id}
                          onClick={() => setSelectedChoices(prev => ({ ...prev, [group.title]: choice }))}
                          className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs font-semibold transition ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'}`}
                        >
                          <span>{choice.name}</span>
                          <span>{choice.price > 0 ? `+₦${choice.price.toLocaleString()}` : 'Free'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <label className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Special Instructions</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra spicy, no onions please..."
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Quantity</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-sm flex items-center justify-center text-zinc-800 dark:text-white"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-sm flex items-center justify-center text-zinc-800 dark:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end space-x-3">
              <button
                onClick={() => setCustomizingItem(null)}
                className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomizedToCart}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-lg transition"
              >
                Add to Cart • ₦{((customizingItem.price + Object.values(selectedChoices).reduce((s, c) => s + c.price, 0)) * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
