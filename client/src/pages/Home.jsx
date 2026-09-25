import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CloudRain, Wallet, ArrowRight, MapPin, Shield, CheckCircle, Flame } from 'lucide-react';
import { VIBE_DEFINITIONS, VibeSelector } from '../components/VibeSelector.jsx';
import { DestinationCard } from '../components/DestinationCard.jsx';
import { api } from '../services/api.js';

export const Home = ({ setTab, setSelectedDestinationForPlanner }) => {
  const [selectedVibes, setSelectedVibes] = useState(['Nature & Peace', 'Culture & History']);
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const dests = await api.getDestinations({ trending: 'true' });
        setTrendingDestinations(dests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleStartPlanning = (destination = null) => {
    if (destination) {
      setSelectedDestinationForPlanner(destination);
    }
    setTab('planner');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 max-w-7xl mx-auto text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[300px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs font-semibold text-slate-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Random Forest Machine Learning Engine Inside</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-['Outfit'] tracking-tight text-white leading-tight">
            Stop Planning Generic Trips. <br />
            Travel by <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Your Vibe</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Voyanta pairs machine learning recommendations with real-time weather adaptation and micro-budget pacing to design intelligent, personalized travel itineraries.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleStartPlanning()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-glow-primary transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTab('explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-surface-card hover:bg-slate-800 border border-surface-border hover:border-slate-600 text-slate-200 transition-colors"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>

        {/* Interactive Vibe Quick-Filter */}
        <div className="mt-14 max-w-4xl mx-auto glass-panel p-5 rounded-2xl border border-surface-border text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
              Pick Your Travel Mood
            </span>
            <span className="text-xs text-slate-400">
              {selectedVibes.length} vibes active
            </span>
          </div>
          <VibeSelector
            selectedVibes={selectedVibes}
            onChange={setSelectedVibes}
            isCompact={true}
          />
        </div>
      </section>

      {/* Unique Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white">
            Why Voyanta is Built Different
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered specifically to solve the static, rigid pitfalls of traditional travel portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Random Forest ML Recommendations</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensemble decision trees evaluate budget, seasonality, party size, and 7 multidimensional vibe vectors to suggest perfect destination matches with transparent explainability.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Weather-Adaptive Itineraries</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When rain or extreme weather is forecast, Voyanta detects vulnerable outdoor stops and provides 1-click automated swaps to verified local museums and indoor workshops.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4-Pillar Micro-Budget Pacing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dynamic cost calculation across Flights, Stays, Dining, and Activities. Live indicators alert you before your schedule exceeds your planned budget limit.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold font-['Outfit'] text-white">
                Trending Destinations
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top curated spots matching popular travel vibes
            </p>
          </div>

          <button
            onClick={() => setTab('explore')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-surface-card animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onPlanTrip={(d) => handleStartPlanning(d)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
