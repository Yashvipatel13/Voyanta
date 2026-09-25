import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Bookmark, ArrowLeft, Check, AlertTriangle, ShieldCheck, Sparkles, Share2 } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap.jsx';
import { WeatherAlertBanner } from '../components/WeatherAlertBanner.jsx';
import { BudgetBreakdownCard } from '../components/BudgetBreakdownCard.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const ItineraryView = ({ itinerary, onBackToPlanner, openAuthModal, setTab }) => {
  const { isAuthenticated } = useAuth();
  const [currentItinerary, setCurrentItinerary] = useState(itinerary);
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [weatherData, setWeatherData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setCurrentItinerary(itinerary);
  }, [itinerary]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentItinerary?.destinationName) return;
      try {
        const data = await api.getWeather(currentItinerary.destinationName);
        setWeatherData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, [currentItinerary?.destinationName]);

  if (!currentItinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Active Itinerary Loaded</h2>
        <p className="text-sm text-slate-400">Launch the trip planner to generate your custom travel timeline.</p>
        <button
          onClick={onBackToPlanner}
          className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-sm"
        >
          Go to Trip Planner
        </button>
      </div>
    );
  }

  const activeDay = currentItinerary.itineraryDays?.find(d => d.dayNumber === activeDayNumber) || currentItinerary.itineraryDays?.[0];

  // Smart Weather-Adaptive Activity Swap
  const handleAdaptActivitiesForWeather = async () => {
    if (!activeDay) return;

    // Find any outdoor activities on active day
    const updatedDays = await Promise.all(
      currentItinerary.itineraryDays.map(async (day) => {
        if (day.dayNumber !== activeDayNumber) return day;

        const updatedActs = await Promise.all(
          day.activities.map(async (act) => {
            if (act.isOutdoor) {
              const adaptedRes = await api.adaptActivity({
                activityTitle: act.title,
                dayNumber: day.dayNumber,
                currentCost: act.estimatedCost
              });
              return {
                ...act,
                ...adaptedRes.adaptedActivity
              };
            }
            return act;
          })
        );

        return { ...day, activities: updatedActs };
      })
    );

    // Recalculate activities total cost
    let newActivityTotal = 0;
    updatedDays.forEach(d => {
      d.activities.forEach(a => {
        newActivityTotal += Number(a.estimatedCost) || 0;
      });
    });

    setCurrentItinerary(prev => ({
      ...prev,
      itineraryDays: updatedDays,
      budgetBreakdown: {
        ...prev.budgetBreakdown,
        activities: newActivityTotal,
        totalEstimatedCost: (prev.budgetBreakdown.transport || 0) + (prev.budgetBreakdown.stay || 0) + (prev.budgetBreakdown.food || 0) + newActivityTotal
      }
    }));
  };

  // Save Trip to User Profile
  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setSaving(true);
    try {
      await api.saveTrip({
        destinationName: currentItinerary.destinationName,
        destinationCountry: currentItinerary.destinationCountry,
        durationDays: currentItinerary.durationDays,
        travelers: currentItinerary.travelers,
        targetBudget: currentItinerary.budgetBreakdown?.targetBudget || 1000,
        totalEstimatedCost: currentItinerary.budgetBreakdown?.totalEstimatedCost || 900,
        budgetTransport: currentItinerary.budgetBreakdown?.transport || 0,
        budgetStay: currentItinerary.budgetBreakdown?.stay || 0,
        budgetFood: currentItinerary.budgetBreakdown?.food || 0,
        budgetActivities: currentItinerary.budgetBreakdown?.activities || 0,
        travelStyle: currentItinerary.travelStyle,
        vibes: currentItinerary.vibes,
        itineraryDays: currentItinerary.itineraryDays
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div className="space-y-1">
          <button
            onClick={onBackToPlanner}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Preferences</span>
          </button>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
              {currentItinerary.destinationName}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-card border border-surface-border text-slate-300">
              {currentItinerary.destinationCountry}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {currentItinerary.durationDays} Days • {currentItinerary.travelers} {currentItinerary.travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentItinerary.vibes?.map(vibe => (
              <span key={vibe} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {saveSuccess ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-glow-emerald">
              <Check className="w-4 h-4" />
              <span>Saved to My Trips!</span>
            </div>
          ) : (
            <button
              onClick={handleSaveTrip}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-glow-primary transition-all duration-200"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saving ? 'Saving Trip...' : 'Save Trip to Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Weather Adaptation Banner */}
      <WeatherAlertBanner
        weatherData={weatherData}
        activeDayNumber={activeDayNumber}
        onAdaptActivities={handleAdaptActivitiesForWeather}
      />

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-border">
        {currentItinerary.itineraryDays?.map(day => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDayNumber(day.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              activeDayNumber === day.dayNumber
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day {day.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Left Timeline Activities / Right Interactive Map & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Day Activities Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{activeDay?.title}</h3>
                <p className="text-xs text-slate-400">Chronological schedule aligned with optimal daylight and crowds</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                {activeDay?.activities?.length || 0} Stops
              </span>
            </div>

            {/* Time Slot Activity Cards */}
            <div className="space-y-4">
              {activeDay?.activities?.map((act, index) => (
                <div
                  key={act.id || index}
                  className={`p-4 rounded-xl border transition-all ${
                    act.weatherAlert
                      ? 'bg-amber-950/20 border-amber-500/30 ring-1 ring-amber-500/20'
                      : 'bg-surface/70 border-surface-border/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{act.timeSlot}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        act.isOutdoor
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {act.isOutdoor ? 'Outdoor' : 'Indoor / Protected'}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {act.estimatedCost > 0 ? `$${act.estimatedCost}` : 'Free'}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{act.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{act.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-surface-border/50">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                    {act.weatherAlert && (
                      <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Adapted for weather</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaflet Interactive Map & Budget Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Map */}
          <div className="glass-card p-4 rounded-2xl space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Interactive Route Map (Day {activeDayNumber})
            </h3>
            <div className="h-80 w-full rounded-xl overflow-hidden">
              <InteractiveMap
                activities={activeDay?.activities || []}
                center={currentItinerary.coordinates}
                destinationName={currentItinerary.destinationName}
              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <BudgetBreakdownCard budgetBreakdown={currentItinerary.budgetBreakdown} />
        </div>
      </div>
    </div>
  );
};
