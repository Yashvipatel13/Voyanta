import React, { useState } from 'react';
import { Heart, Sparkles, MapPin, Calendar, DollarSign, ArrowRight, Check } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const DestinationCard = ({ destination, onPlanTrip, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isWishlisted);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* ML Confidence Score or Trending */}
          {destination.matchConfidence ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 backdrop-blur-md border border-indigo-400/40 text-indigo-200 text-xs font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{destination.matchConfidence}% ML Match</span>
            </div>
          ) : destination.isTrending ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trending Vibe</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-medium">
              {destination.budgetTier}
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleHeartClick}
            disabled={saving}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              saved
                ? 'bg-rose-500 text-white shadow-glow-coral scale-110'
                : 'bg-slate-900/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Location Title Over Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* ML Match Explanation (if available) */}
        {destination.matchExplanation && (
          <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-200/90 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-sky-300">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Why Voyanta Matched This:</span>
            </div>
            <p className="text-slate-300">{destination.matchExplanation.vibeAlignment}</p>
          </div>
        )}

        {/* Vibe Pills */}
        <div className="flex flex-wrap gap-1.5">
          {vibes.slice(0, 3).map((vibe) => (
            <span
              key={vibe}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-surface-border text-slate-300"
            >
              {vibe}
            </span>
          ))}
          {vibes.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
              +{vibes.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Metrics & CTA */}
        <div className="pt-3 border-t border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Avg / Day</span>
            <span className="text-sm font-bold text-white">${destination.avgCostPerDay}</span>
          </div>

          <button
            onClick={() => onPlanTrip(destination)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary/15 hover:bg-primary text-primary hover:text-black transition-all duration-200"
          >
            <span>Plan Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
