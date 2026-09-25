import React, { useState } from 'react';
import { Heart, Sparkles, MapPin, ArrowRight, Star } from 'lucide-react';
import { DestinationReviewsModal } from './DestinationReviewsModal.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const DestinationCard = ({ destination, onPlanTrip, isWishlisted = false, onWishlistToggle, openAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isWishlisted);
  const [saving, setSaving] = useState(false);
  const [showReviews, setShowReviews] = useState(false);


  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save destinations to your Wishlist.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.toggleWishlist(destination.id);
      setSaved(res.saved);
      if (onWishlistToggle) onWishlistToggle(destination.id, res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const vibes = Array.isArray(destination.vibes)
    ? destination.vibes
    : (typeof destination.vibes === 'string' ? JSON.parse(destination.vibes || '[]') : []);

  // Format currency display: if >= 1000 and country is India, format nicely with ₹ or $
  const formattedCost = destination.avgCostPerDay 
    ? (destination.country?.toLowerCase().includes('india') 
        ? `₹${Number(destination.avgCostPerDay).toLocaleString('en-IN')}` 
        : `$${Number(destination.avgCostPerDay).toLocaleString()}`)
    : '$120';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      {/* Top Image Section (~45-50% height) */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Match Score / Trending Tag */}
          <div>
            {destination.matchConfidence ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-blue-700 text-xs font-bold shadow-sm border border-blue-100">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>{destination.matchConfidence}% Match</span>
              </span>
            ) : destination.isTrending ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-amber-700 text-xs font-semibold shadow-sm border border-amber-100">
                <span>🔥 Trending</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-medium shadow-xs">
                {destination.budgetTier}
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            disabled={saving}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 shadow-sm ${
              saved
                ? 'bg-rose-500 text-white shadow-rose-200 scale-105'
                : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500 hover:scale-105'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Location Meta & Review Badge */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{destination.state ? `${destination.state}, ${destination.country}` : destination.country}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReviews(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/60 transition-colors"
              title="View & Submit Community Reviews"
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{destination.rating || 4.8}</span>
            </button>
          </div>


          {/* Destination Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
            {destination.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* ML Explainability Reason (if active) */}
        {destination.matchExplanation && (
          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-0.5">
            <span className="font-semibold text-blue-700 block">Why Voyanta Matched This:</span>
            <p className="text-slate-600">{destination.matchExplanation.vibeAlignment}</p>
          </div>
        )}

        {/* Small Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {vibes.slice(0, 3).map((vibe) => (
            <span
              key={vibe}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600"
            >
              {vibe}
            </span>
          ))}
          {vibes.length > 3 && (
            <span className="text-[11px] text-slate-400 px-1 py-0.5">
              +{vibes.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Price & Plan Itinerary CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900">{formattedCost}</span>
            <span className="text-[11px] text-slate-400 font-normal"> / day</span>
          </div>

          <button
            onClick={() => onPlanTrip(destination)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 group/btn transition-colors"
          >
            <span>Plan Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Community Reviews Modal */}
      {showReviews && (
        <DestinationReviewsModal
          isOpen={showReviews}
          onClose={() => setShowReviews(false)}
          destinationName={destination.name}
          openAuthModal={openAuthModal}
        />
      )}
    </div>
  );
};

