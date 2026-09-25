import React, { useState, useEffect } from 'react';
import { Heart, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const Wishlist = ({ setTab, setSelectedDestinationForPlanner }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchWishlist = async () => {
      try {
        const data = await api.getWishlist();
        setWishlistItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const handlePlanTrip = (destination) => {
    setSelectedDestinationForPlanner(destination);
    setTab('planner');
  };

  const handleWishlistToggle = (destinationId, isSaved) => {
    if (!isSaved) {
      setWishlistItems(prev => prev.filter(item => item.destinationId !== destinationId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-card my-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to View Wishlist</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Bookmark hidden gems and dream travel spots for future adventures.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Travel Wishlist
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {wishlistItems.length} bookmarked {wishlistItems.length === 1 ? 'destination' : 'destinations'} ready for itinerary planning.
          </p>
        </div>

        <button
          onClick={() => setTab('explore')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Explore More Spots</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Browse our curated destinations and tap the heart icon to save spots here.
          </p>
          <button
            onClick={() => setTab('explore')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            Discover Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <DestinationCard
              key={item.id}
              destination={item.destination}
              isWishlisted={true}
              onWishlistToggle={handleWishlistToggle}
              onPlanTrip={handlePlanTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
