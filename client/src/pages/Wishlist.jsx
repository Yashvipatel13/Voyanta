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
      <div className="max-w-md mx-auto px-4 py-20 text-center glass-card rounded-2xl space-y-4">
        <Heart className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In to View Wishlist</h2>
        <p className="text-xs text-slate-400">
          Bookmark hidden gems and dream travel spots for future adventures.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <h1 className="text-3xl font-extrabold font-['Outfit'] text-white">
              My Travel Wishlist
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {wishlistItems.length} bookmarked {wishlistItems.length === 1 ? 'destination' : 'destinations'} ready for itinerary planning.
          </p>
        </div>

        <button
          onClick={() => setTab('explore')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-card border border-surface-border text-slate-200 hover:border-slate-500"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Explore More Spots</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-surface-card animate-pulse border border-surface-border" />
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl space-y-4 max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Browse our curated destinations and tap the heart icon to save spots here.
          </p>
          <button
            onClick={() => setTab('explore')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-black"
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
