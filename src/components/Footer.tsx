import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lightning Fast Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1">Hot meals delivered straight to your doorstep in under 30 minutes.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Real-Time Tracking</h4>
              <p className="text-xs text-zinc-400 mt-1">Monitor your rider live on map from restaurant to doorstep.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Secure Payments</h4>
              <p className="text-xs text-zinc-400 mt-1">Verified transactions powered by Paystack and Flutterwave.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">AI Food Recommendations</h4>
              <p className="text-xs text-zinc-400 mt-1">Personalized dish suggestions powered by Google Gemini AI.</p>
            </div>
          </div>
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-zinc-800 text-sm">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-lg">
                C
              </div>
              <span className="text-lg font-black text-white">CraveSwift</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              The ultimate multi-vendor food delivery marketplace connecting hungry customers with top-tier restaurants and lightning-fast delivery riders.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Discover</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#restaurants" className="hover:text-white transition">Top Restaurants</a></li>
              <li><a href="#categories" className="hover:text-white transition">Food Categories</a></li>
              <li><a href="#offers" className="hover:text-white transition">Discount Promos</a></li>
              <li><a href="#trending" className="hover:text-white transition">Trending Meals</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Partners</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#partner" className="hover:text-white transition">Add Your Restaurant</a></li>
              <li><a href="#rider" className="hover:text-white transition">Become a Rider</a></li>
              <li><a href="#enterprise" className="hover:text-white transition">CraveSwift Business</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Support</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#safety" className="hover:text-white transition">Safety & Hygiene</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} CraveSwift Technologies Ltd. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="px-2.5 py-1 rounded bg-zinc-800 text-[10px] text-zinc-300 font-medium">Paystack Secured</span>
            <span className="px-2.5 py-1 rounded bg-zinc-800 text-[10px] text-zinc-300 font-medium">Flutterwave Verified</span>
            <span className="px-2.5 py-1 rounded bg-zinc-800 text-[10px] text-zinc-300 font-medium">Google Maps API</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
