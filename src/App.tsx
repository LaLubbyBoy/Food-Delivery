/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiCraveBot } from './components/AiCraveBot';

import { HomeView } from './components/customer/HomeView';
import { RestaurantDiscoveryView } from './components/customer/RestaurantDiscoveryView';
import { RestaurantDetailView } from './components/customer/RestaurantDetailView';
import { CartCheckoutView } from './components/customer/CartCheckoutView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { SupportView } from './components/customer/SupportView';

import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentRole, activeView } = useApp();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {currentRole === 'restaurant_owner' ? (
        <RestaurantDashboard />
      ) : currentRole === 'rider' ? (
        <RiderDashboard />
      ) : currentRole === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          {activeView === 'home' && <HomeView />}
          {activeView === 'restaurants' && <RestaurantDiscoveryView />}
          {activeView === 'restaurant_detail' && <RestaurantDetailView />}
          {activeView === 'cart' && <CartCheckoutView />}
          {activeView === 'customer_orders' && <CustomerDashboard />}
          {activeView === 'support' && <SupportView />}
        </>
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
        <AiCraveBot />
      </div>
    </AppProvider>
  );
}
