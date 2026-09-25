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
      <div className="max-w-md mx-auto px-4 py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-card my-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Active Itinerary Loaded</h2>
        <p className="text-xs text-slate-500">Launch the trip planner to generate your custom travel timeline.</p>
        <button
          onClick={onBackToPlanner}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
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
        totalEstimatedCost: (prev.budgetBreakdown?.transport || 0) + (prev.budgetBreakdown?.stay || 0) + (prev.budgetBreakdown?.food || 0) + newActivityTotal
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
      await api.saveTrip(currentItinerary);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToPlanner}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex items-center gap-2">
          {saveSuccess ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to My Trips!</span>
            </div>
          ) : (
            <button
              onClick={handleSaveTrip}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>{saving ? 'Saving...' : 'Save Itinerary'}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Voyanta Trip to ${currentItinerary.destinationName}`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Trip link copied to clipboard!');
              }
            }}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Itinerary Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentItinerary.destinationCountry || 'India'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {currentItinerary.destinationName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentItinerary.durationDays} Days Itinerary</span>
            </span>
            <span>•</span>
            <span>{currentItinerary.travelers} {currentItinerary.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            <span>•</span>
            <span className="font-medium text-slate-700">{currentItinerary.travelStyle || 'Relaxed'}</span>
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1.5 max-w-sm">
          {currentItinerary.vibes?.map((vibe) => (
            <span
              key={vibe}
              className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
            >
              {vibe}
            </span>
          ))}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {currentItinerary.itineraryDays?.map((day) => {
          const isActive = day.dayNumber === activeDayNumber;
          return (
            <button
              key={day.id || day.dayNumber}
              onClick={() => setActiveDayNumber(day.dayNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Day {day.dayNumber}
            </button>
          );
        })}
      </div>

      {/* Weather Alert Banner */}
      <WeatherAlertBanner
        weatherData={weatherData}
        onAdaptActivities={handleAdaptActivitiesForWeather}
        activeDayNumber={activeDayNumber}
      />

      {/* Main Content: 2-Column Split (Timeline & Map/Budget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timeline of Day's Activities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-lg font-bold text-slate-900">
              {activeDay?.title || `Day ${activeDayNumber} Schedule`}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {activeDay?.activities?.length || 0} stops planned
            </span>
          </div>

          <div className="space-y-4">
            {activeDay?.activities?.map((act, index) => (
              <div
                key={act.id || index}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all space-y-3 relative group"
              >
                {/* Time & Indoor/Outdoor Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{act.timeSlot}</span>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    act.isOutdoor
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {act.isOutdoor ? 'Outdoor Stop' : 'Indoor Stop'}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Replaced Indicator if Weather Adapted */}
                {act.replacedWith && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Smart Adapted: Swapped outdoor stop due to precipitation forecast.</span>
                  </div>
                )}

                {/* Location & Cost Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1 max-w-[70%] truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{act.location}</span>
                  </div>

                  <span className="font-semibold text-slate-900">
                    Est: ₹{act.estimatedCost || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Map & Budget Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <InteractiveMap
            activities={activeDay?.activities || []}
            center={currentItinerary.coordinates || [28.6139, 77.2090]}
            destinationName={currentItinerary.destinationName}
          />

          <BudgetBreakdownCard
            budgetBreakdown={currentItinerary.budgetBreakdown}
          />
        </div>

      </div>

    </div>
  );
};
