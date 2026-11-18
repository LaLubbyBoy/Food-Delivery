import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Search, Bell, User as UserIcon, Shield, Utensils, 
  Bike, Home, Menu, X, ChevronDown, Sparkles 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, currentRole, setCurrentRole, cart, notifications, 
    markNotificationRead, activeView, setActiveView, logout 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveView('home')} 
              className="flex items-center space-x-2 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-black text-xl">
                C
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  CraveSwift
                </span>
                <span className="hidden sm:block text-[10px] text-zinc-500 dark:text-zinc-400 font-medium -mt-1">
                  Food Delivery Marketplace
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links for Customer */}
          {currentRole === 'customer' && (
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <button 
                onClick={() => setActiveView('home')} 
                className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${activeView === 'home' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}`}
              >
                Explore
              </button>
              <button 
                onClick={() => setActiveView('restaurants')} 
                className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${activeView === 'restaurants' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}`}
              >
                Restaurants
              </button>
              <button 
                onClick={() => setActiveView('customer_orders')} 
                className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${activeView === 'customer_orders' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}`}
              >
                My Orders
              </button>
              <button 
                onClick={() => setActiveView('support')} 
                className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${activeView === 'support' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}`}
              >
                Support
              </button>
            </div>
          )}

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                {currentRole === 'customer' && <span className="flex items-center"><UserIcon className="w-3.5 h-3.5 mr-1 text-orange-500" /> Customer</span>}
                {currentRole === 'restaurant_owner' && <span className="flex items-center"><Utensils className="w-3.5 h-3.5 mr-1 text-amber-500" /> Restaurant</span>}
                {currentRole === 'rider' && <span className="flex items-center"><Bike className="w-3.5 h-3.5 mr-1 text-blue-500" /> Rider</span>}
                {currentRole === 'admin' && <span className="flex items-center"><Shield className="w-3.5 h-3.5 mr-1 text-purple-500" /> Admin</span>}
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Switch Role Demo
                  </div>
                  <button
                    onClick={() => { setCurrentRole('customer'); setRoleMenuOpen(false); setActiveView('home'); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${currentRole === 'customer' ? 'text-orange-600 font-bold bg-orange-50 dark:bg-orange-950/30' : 'text-zinc-700 dark:text-zinc-200'}`}
                  >
                    <UserIcon className="w-4 h-4 text-orange-500" />
                    <span>Customer View</span>
                  </button>
                  <button
                    onClick={() => { setCurrentRole('restaurant_owner'); setRoleMenuOpen(false); setActiveView('restaurant_dashboard'); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${currentRole === 'restaurant_owner' ? 'text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/30' : 'text-zinc-700 dark:text-zinc-200'}`}
                  >
                    <Utensils className="w-4 h-4 text-amber-500" />
                    <span>Restaurant Owner</span>
                  </button>
                  <button
                    onClick={() => { setCurrentRole('rider'); setRoleMenuOpen(false); setActiveView('rider_dashboard'); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${currentRole === 'rider' ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/30' : 'text-zinc-700 dark:text-zinc-200'}`}
                  >
                    <Bike className="w-4 h-4 text-blue-500" />
                    <span>Delivery Rider</span>
                  </button>
                  <button
                    onClick={() => { setCurrentRole('admin'); setRoleMenuOpen(false); setActiveView('admin_dashboard'); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${currentRole === 'admin' ? 'text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/30' : 'text-zinc-700 dark:text-zinc-200'}`}
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Administrator</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase">Notifications</span>
                    <span className="text-[10px] text-orange-600 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-700">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer transition ${!n.read ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}
                        >
                          <div className="text-xs font-bold text-zinc-900 dark:text-white">{n.title}</div>
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">{n.message}</div>
                          <div className="text-[9px] text-zinc-400 mt-1">{n.timestamp}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button (Customer Only) */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setActiveView('cart')}
                className="relative flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-xs font-black flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-2">
          {currentRole === 'customer' && (
            <>
              <button 
                onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Explore Home
              </button>
              <button 
                onClick={() => { setActiveView('restaurants'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Browse Restaurants
              </button>
              <button 
                onClick={() => { setActiveView('customer_orders'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                My Orders
              </button>
              <button 
                onClick={() => { setActiveView('support'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Customer Support
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
