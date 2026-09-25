import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Compass } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard.jsx';
import { VIBE_DEFINITIONS } from '../components/VibeSelector.jsx';
import { api } from '../services/api.js';

export const Explore = ({ setTab, setSelectedDestinationForPlanner }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVibe, setActiveVibe] = useState('All');
  const [activeBudget, setActiveBudget] = useState('All');

  useEffect(() => {
    const fetchDests = async () => {
      setLoading(true);
      try {
        const filter = {};
        if (activeVibe !== 'All') filter.vibe = activeVibe;
        if (activeBudget !== 'All') filter.budget = activeBudget;
        const data = await api.getDestinations(filter);
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDests();
  }, [activeVibe, activeBudget]);

  const filteredDestinations = destinations.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handlePlanTrip = (destination) => {
    setSelectedDestinationForPlanner(destination);
    setTab('planner');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
          Explore by Travel Vibes
        </h1>
        <p className="text-sm text-slate-400">
          Curated destinations categorized by mood, aesthetics, and authentic cultural flavors.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, country, or keyword (e.g. Kyoto, temples, waterfalls)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-surface-border rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
            />
          </div>

          {/* Budget Dropdown */}
          <div className="sm:w-48">
            <select
              value={activeBudget}
              onChange={(e) => setActiveBudget(e.target.value)}
              className="w-full py-2.5 px-3 bg-surface-card border border-surface-border rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Budgets</option>
              <option value="Economy">Economy</option>
              <option value="Moderate">Moderate</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>

        {/* Vibe Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveVibe('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeVibe === 'All'
                ? 'bg-sky-500 text-black border-sky-400 font-bold'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-white'
            }`}
          >
            All Vibes
          </button>
          {VIBE_DEFINITIONS.map(v => (
            <button
              key={v.name}
              onClick={() => setActiveVibe(v.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeVibe === v.name
                  ? v.activeBg + ' shadow-sm'
                  : 'bg-surface-card border-surface-border text-slate-400 hover:text-white'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-surface-card animate-pulse border border-surface-border" />
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl space-y-3">
          <Compass className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No destinations found</h3>
          <p className="text-xs text-slate-400">Try adjusting your vibe or budget filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPlanTrip={handlePlanTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
