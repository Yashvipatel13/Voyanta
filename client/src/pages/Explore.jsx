import React, { useState, useEffect } from 'react';
import { Search, Compass, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard.jsx';
import { VIBE_DEFINITIONS } from '../components/VibeSelector.jsx';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { api } from '../services/api.js';

export const Explore = ({ setTab, setSelectedDestinationForPlanner, initialSearch = '' }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [activeVibe, setActiveVibe] = useState('All');
  const [activeBudget, setActiveBudget] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
      setCurrentPage(1);
    }
  }, [initialSearch]);

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

  // Client-side search and sort
  const filteredDestinations = destinations
    .filter(d => {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.state && d.state.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'cost-low') return (a.avgCostPerDay || 0) - (b.avgCostPerDay || 0);
      if (sortBy === 'cost-high') return (b.avgCostPerDay || 0) - (a.avgCostPerDay || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage) || 1;
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePlanTrip = (destination) => {
    setSelectedDestinationForPlanner(destination);
    setTab('planner');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      {/* 1. Header Banner matching Screen 3 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card overflow-hidden">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <span className="text-blue-600">✦</span>
            <span>EXPLORE DESTINATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore by Travel Vibes
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Curated destinations categorized by mood, aesthetics, and authentic cultural flavors.
          </p>
        </div>

        {/* Coastal town photo thumbnail */}
        <div className="hidden md:block w-36 h-36 rounded-2xl overflow-hidden shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80"
            alt="Scenic seaside destination"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search destinations, cities, or keywords..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          {/* Budget Dropdown */}
          <div className="sm:w-48">
            <CustomSelect
              value={activeBudget}
              onChange={(val) => { setActiveBudget(val); setCurrentPage(1); }}
              options={[
                { value: 'All', label: 'All Budgets' },
                { value: 'Economy', label: 'Economy' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Luxury', label: 'Luxury' }
              ]}
            />
          </div>
        </div>

        {/* Vibe Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => { setActiveVibe('All'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeVibe === 'All'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Vibes
          </button>
          {VIBE_DEFINITIONS.map(v => (
            <button
              key={v.name}
              onClick={() => { setActiveVibe(v.name); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeVibe === v.name
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Results Header & Sorting */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-semibold text-slate-700">
          {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
        </span>

        {/* Sort Dropdown */}
        <div className="w-44">
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={[
              { value: 'popular', label: 'Popular First' },
              { value: 'cost-low', label: 'Budget: Low to High' },
              { value: 'cost-high', label: 'Budget: High to Low' },
              { value: 'rating', label: 'Top Rated' }
            ]}
          />
        </div>
      </div>

      {/* 4. Destination Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search or vibe filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDestinations.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPlanTrip={handlePlanTrip}
            />
          ))}
        </div>
      )}

      {/* 5. Clean Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
