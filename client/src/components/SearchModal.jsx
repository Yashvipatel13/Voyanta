import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, MapPin, Compass, Sparkles, Star, ArrowRight, 
  Car, Bike, Flame, Calendar, Tag, ChevronRight 
} from 'lucide-react';
import { api } from '../services/api.js';

const POPULAR_DESTINATIONS = [
  'Leh-Ladakh', 'Goa', 'Manali', 'Udaipur', 'Coorg (Kodagu)', 'Munnar', 'Varanasi', 'Rishikesh'
];

const POPULAR_VIBES = [
  { label: 'Mountains', emoji: '🏔️' },
  { label: 'Beaches', emoji: '🏖️' },
  { label: 'Food & Culinary', emoji: '🍛' },
  { label: 'Nature & Wildlife', emoji: '🌿' },
  { label: 'Adventure', emoji: '🧗' },
  { label: 'Culture & Heritage', emoji: '🏛️' }
];

export const SearchModal = ({ isOpen, onClose, onSearch, setTab, setSelectedDestinationForPlanner }) => {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Load data once when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);

      const loadSearchData = async () => {
        if (destinations.length > 0) return;
        setLoading(true);
        try {
          const [dests, vehi] = await Promise.all([
            api.getDestinations().catch(() => []),
            api.getVehicles().catch(() => [])
          ]);
          setDestinations(dests);
          setVehicles(vehi);
        } catch (err) {
          console.error('Error loading search data:', err);
        } finally {
          setLoading(false);
        }
      };
      loadSearchData();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  // Filter destinations
  const matchingDestinations = destinations.filter(d => {
    if (!trimmedQuery) return false;
    return (
      d.name.toLowerCase().includes(trimmedQuery) ||
      (d.state && d.state.toLowerCase().includes(trimmedQuery)) ||
      (d.description && d.description.toLowerCase().includes(trimmedQuery)) ||
      (d.highlights && d.highlights.toLowerCase().includes(trimmedQuery)) ||
      (d.vibes && d.vibes.toLowerCase().includes(trimmedQuery))
    );
  }).slice(0, 5);

  // Filter vibes
  const matchingVibes = POPULAR_VIBES.filter(v => {
    if (!trimmedQuery) return false;
    return v.label.toLowerCase().includes(trimmedQuery);
  });

  // Filter vehicles
  const matchingVehicles = vehicles.filter(v => {
    if (!trimmedQuery) return false;
    return (
      v.name.toLowerCase().includes(trimmedQuery) ||
      v.city.toLowerCase().includes(trimmedQuery) ||
      v.type.toLowerCase().includes(trimmedQuery)
    );
  }).slice(0, 3);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch(query.trim());
    onClose();
  };

  const handleSelectDestination = (dest) => {
    onSearch(dest.name);
    onClose();
  };

  const handlePlanDestination = (dest, e) => {
    e.stopPropagation();
    if (setSelectedDestinationForPlanner) {
      setSelectedDestinationForPlanner(dest);
    }
    setTab('planner');
    onClose();
  };

  const handleSelectVibe = (vibeLabel) => {
    onSearch(vibeLabel);
    onClose();
  };

  const handleSelectVehicle = (v) => {
    setTab('vehicles');
    onClose();
  };

  const hasResults = matchingDestinations.length > 0 || matchingVibes.length > 0 || matchingVehicles.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center p-4 sm:p-5 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Indian destinations, vibes, states, rides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-3.5 pr-20 py-2 text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />

          <div className="absolute right-4 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results & Suggestions Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {trimmedQuery ? (
            /* Results when query is typed */
            hasResults ? (
              <div className="space-y-5">
                {/* 1. Destination Matches */}
                {matchingDestinations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Destinations ({matchingDestinations.length})
                    </span>
                    <div className="space-y-1.5">
                      {matchingDestinations.map((dest) => (
                        <div
                          key={dest.id || dest.name}
                          onClick={() => handleSelectDestination(dest)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={dest.imageUrl}
                              alt={dest.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                  {dest.name}
                                </h4>
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-amber-500" />
                                  {dest.rating || 4.8}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{dest.state || 'India'}</span>
                                {dest.budgetTier && (
                                  <>
                                    <span>•</span>
                                    <span>{dest.budgetTier}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handlePlanDestination(dest, e)}
                              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Plan Trip</span>
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Vibe Matches */}
                {matchingVibes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Matching Vibes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {matchingVibes.map((v) => (
                        <button
                          key={v.label}
                          type="button"
                          onClick={() => handleSelectVibe(v.label)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all"
                        >
                          <span>{v.emoji}</span>
                          <span>{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Vehicle Rental Matches */}
                {matchingVehicles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Vehicle & Bike Rentals
                    </span>
                    <div className="space-y-1.5">
                      {matchingVehicles.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => handleSelectVehicle(v)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              {v.type.toLowerCase().includes('bike') ? (
                                <Bike className="w-4 h-4" />
                              ) : (
                                <Car className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {v.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                📍 {v.city} • ₹{v.pricePerDay.toLocaleString('en-IN')}/day
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                            View Rides →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No matching items */
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No destinations match "{query}"
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hit <span className="font-semibold text-slate-700">Enter</span> to search across all guides and stops, or try one of the popular travel spots below.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Search in Explore
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Default screen when query is empty */
            <div className="space-y-6">
              {/* Popular Indian Destinations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Popular Destinations
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_DESTINATIONS.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onSearch(name)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/90 text-xs font-medium text-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Vibe */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Browse by Travel Vibe
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_VIBES.map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => handleSelectVibe(v.label)}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 border border-slate-200/80 text-left transition-all group"
                    >
                      <span className="text-lg block mb-1">{v.emoji}</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {v.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Shortcuts */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Press <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-700 border border-slate-200">ESC</kbd> to exit</span>
                <button
                  type="button"
                  onClick={() => { setTab('vehicles'); onClose(); }}
                  className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>View Vehicle Rentals →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
