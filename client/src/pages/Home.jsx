import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CloudSun, Wallet, ArrowRight, Flame, Shield, Check } from 'lucide-react';
import { VibeSelector } from '../components/VibeSelector.jsx';
import { DestinationCard } from '../components/DestinationCard.jsx';
import { api } from '../services/api.js';

export const Home = ({ setTab, setSelectedDestinationForPlanner }) => {
  const [selectedVibes, setSelectedVibes] = useState(['Nature & Peace']);
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Section (Editorial Travel Style) */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <span className="text-blue-600">✦</span>
              <span>AI-POWERED TRAVEL PLANNING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Travel that fits <br />
              <span className="text-blue-600">your vibe.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Voyanta combines AI recommendations, real-time weather adaptation and budget planning to create personalized itineraries for your perfect trip.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => handleStartPlanning()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-150"
              >
                <span>Plan my trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setTab('explore')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 transition-colors shadow-xs"
              >
                <span>Explore destinations</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[16/11] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
                alt="Scenic coastal destination"
                className="w-full h-full object-cover"
              />

              {/* Top Handwritten Styled Tag */}
              <div className="absolute top-5 right-5 rotate-2 select-none pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white/60">
                  <span className="font-handwriting text-slate-800 text-lg font-bold leading-tight block">
                    Good Trips Brighter You ✨
                  </span>
                </div>
              </div>

              {/* Floating Plan Smarter Card on Bottom Left */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/80 space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">Plan Smarter</h4>
                  <p className="text-xs text-slate-500">Travel Better • Live the Experience</p>
                </div>
                {/* 3 Traveler Avatars */}
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Traveler" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Traveler" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Traveler" />
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 pl-1">2,400+ itineraries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pick Your Travel Vibe Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pick Your Travel Vibe
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tell us what kind of traveler you are. We'll find the perfect destinations.
          </p>
        </div>

        <VibeSelector
          selectedVibes={selectedVibes}
          onChange={setSelectedVibes}
          variant="cards"
        />
      </section>

      {/* 3. Why Voyanta (3 Clean Architecture Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Random Forest */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Random Forest ML Recommendations
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Recommends destinations based on your vibe, budget, season and travel patterns using ML.
              </p>
            </div>
            <button 
              onClick={() => handleStartPlanning()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Smart Weather */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Smart Weather-Adaptive Itineraries
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Plans routes considering real-time weather, climate and seasonal conditions.
              </p>
            </div>
            <button 
              onClick={() => handleStartPlanning()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: 4-Pillar Budget */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                4-Pillar Micro-Budget Pacing
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optimizes costs for stay, food, activities and transit for a balanced, realistic itinerary.
              </p>
            </div>
            <button 
              onClick={() => handleStartPlanning()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Trending Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Trending Destinations
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Popular places that match your travel style.
            </p>
          </div>

          <button
            onClick={() => setTab('explore')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200/70 animate-pulse" />
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

      {/* 5. Bottom Call-to-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          {/* Background image tint */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
              alt="Roadtrip"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Not sure where to go?
            </h3>
            <p className="text-sm text-slate-300 max-w-md">
              Let Voyanta AI find the perfect destination tailored to your mood, budget, and season.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => handleStartPlanning()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all whitespace-nowrap"
            >
              <span>Try AI Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
