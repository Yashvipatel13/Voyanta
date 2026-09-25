import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, AlertCircle, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { VibeSelector } from '../components/VibeSelector.jsx';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { api } from '../services/api.js';

export const Planner = ({ selectedDestination, onItineraryGenerated, setTab }) => {
  const [formData, setFormData] = useState({
    destinationName: selectedDestination ? selectedDestination.name : '',
    useMLPick: !selectedDestination,
    budgetTier: 'Moderate',
    targetBudget: 1200,
    durationDays: 4,
    travelers: 2,
    season: 'Spring',
    travelStyle: 'Relaxed',
    vibes: ['Nature & Peace'],
    accommodation: 'Boutique hotel',
    transport: 'Train / Rail'
  });

  const [destinationsList, setDestinationsList] = useState([]);
  const [mlRecommendations, setMlRecommendations] = useState(null);
  const [loadingML, setLoadingML] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDests = async () => {
      try {
        const dests = await api.getDestinations();
        setDestinationsList(dests);
      } catch (err) {
        console.error(err);
      }
    };
    loadDests();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      setFormData(prev => ({
        ...prev,
        destinationName: selectedDestination.name,
        useMLPick: false,
        budgetTier: selectedDestination.budgetTier || prev.budgetTier,
        vibes: Array.isArray(selectedDestination.vibes) ? selectedDestination.vibes : prev.vibes
      }));
    }
  }, [selectedDestination]);

  const handleRunRandomForest = async () => {
    if (formData.vibes.length === 0) {
      setError('Please pick at least one vibe preference so the Random Forest model can score destinations.');
      return;
    }
    setError(null);
    setLoadingML(true);

    try {
      const mlResult = await api.getRecommendations({
        budget: formData.budgetTier,
        durationDays: formData.durationDays,
        travelers: formData.travelers,
        season: formData.season,
        travelStyle: formData.travelStyle,
        vibes: formData.vibes
      });

      setMlRecommendations(mlResult);
      if (mlResult.topRecommendations?.length > 0) {
        setFormData(prev => ({
          ...prev,
          destinationName: mlResult.topRecommendations[0].name
        }));
      }
    } catch (err) {
      setError(err.message || 'Error running ML recommendation');
    } finally {
      setLoadingML(false);
    }
  };

  const handleGenerateItinerary = async (targetDestName = null) => {
    const finalDestName = targetDestName || formData.destinationName;
    if (!finalDestName && !formData.useMLPick) {
      setError('Please choose a destination or let the Random Forest model recommend one.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // If user clicked generate while in ML mode and haven't evaluated yet, run ML pick first or pick top match
      let destToUse = finalDestName;
      if (!destToUse && formData.useMLPick) {
        const mlResult = await api.getRecommendations({
          budget: formData.budgetTier,
          durationDays: formData.durationDays,
          travelers: formData.travelers,
          season: formData.season,
          travelStyle: formData.travelStyle,
          vibes: formData.vibes
        });
        destToUse = mlResult.topRecommendations?.[0]?.name || 'Goa (North & South)';
      }

      const itineraryData = await api.generateTrip({
        destinationName: destToUse,
        durationDays: formData.durationDays,
        budgetTier: formData.budgetTier,
        travelers: formData.travelers,
        vibes: formData.vibes,
        travelStyle: formData.travelStyle,
        targetBudget: formData.targetBudget
      });

      onItineraryGenerated(itineraryData);
      setTab('itinerary');
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      
      {/* 1. Header Banner with Traveler Image */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card overflow-hidden relative">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI TRIP PLANNER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Design your perfect trip
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Tell Voyanta your preferences and we'll create a personalized itinerary just for you.
          </p>
        </div>

        {/* Traveler photo banner thumbnail */}
        <div className="hidden md:block w-36 h-36 rounded-2xl overflow-hidden shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
            alt="Traveler looking at mountain view"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Step Indicator Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto text-xs font-medium text-slate-500 gap-2">
          <div className="flex items-center gap-2 text-blue-600 font-semibold shrink-0">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
            <span>Destination</span>
          </div>
          <div className="h-px w-6 sm:w-12 bg-slate-200 shrink-0" />
          <div className="flex items-center gap-2 text-slate-700 shrink-0">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] flex items-center justify-center font-semibold">2</span>
            <span>Travel Vibe</span>
          </div>
          <div className="h-px w-6 sm:w-12 bg-slate-200 shrink-0" />
          <div className="flex items-center gap-2 text-slate-700 shrink-0">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] flex items-center justify-center font-semibold">3</span>
            <span>Budget & Duration</span>
          </div>
          <div className="h-px w-6 sm:w-12 bg-slate-200 shrink-0" />
          <div className="flex items-center gap-2 text-slate-700 shrink-0">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] flex items-center justify-center font-semibold">4</span>
            <span>Style & Logistics</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. The 4 Planning Sections */}
      <div className="space-y-8">
        
        {/* Step 1: Destination Selection Mode */}
        <section className="space-y-3.5">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            1. Choose Destination Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card A: Let Voyanta Choose */}
            <div
              onClick={() => setFormData({ ...formData, useMLPick: true })}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer select-none transition-all duration-150 relative ${
                formData.useMLPick
                  ? 'bg-blue-50/60 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                  formData.useMLPick ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {formData.useMLPick && '✓'}
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Let Voyanta choose
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get AI-recommended destinations based on your vibe, budget and season.
              </p>
            </div>

            {/* Card B: Choose Specific Destination */}
            <div
              onClick={() => setFormData({ ...formData, useMLPick: false })}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer select-none transition-all duration-150 relative ${
                !formData.useMLPick
                  ? 'bg-blue-50/60 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                  !formData.useMLPick ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {!formData.useMLPick && '✓'}
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Choose a specific destination
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select from our curated database of world-class destinations.
              </p>
            </div>
          </div>

          {/* Destination Dropdown when Manual is active */}
          {!formData.useMLPick && (
            <div className="pt-2 animate-in fade-in duration-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Select Destination
              </label>
              <CustomSelect
                value={formData.destinationName}
                onChange={(val) => setFormData({ ...formData, destinationName: val })}
                options={[
                  { value: '', label: '-- Choose from 24 Curated Destinations --' },
                  ...destinationsList.map(d => ({
                    value: d.name,
                    label: `${d.name}, ${d.country} (${d.budgetTier} • ${d.bestSeasons})`
                  }))
                ]}
                placeholder="-- Choose from 24 Curated Destinations --"
              />
            </div>
          )}
        </section>

        {/* Step 2: Travel Vibes & Moods (Visual Photo Cards) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              2. Your Travel Vibes & Moods
            </h3>
            <span className="text-xs text-slate-400 font-medium">Select up to 3 vibes</span>
          </div>

          <VibeSelector
            selectedVibes={formData.vibes}
            onChange={(vibes) => setFormData({ ...formData, vibes })}
            variant="photo-cards"
            maxSelect={3}
          />
        </section>

        {/* Step 3: Budget & Parameters */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            3. Budget & Parameters
          </h3>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Budget Tier Segmented Control */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Budget Tier</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                {['Economy', 'Moderate', 'Luxury'].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetTier: tier })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      formData.budgetTier === tier
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Trip Duration: <span className="text-blue-600 font-bold">{formData.durationDays} Days</span>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 Day</span>
                <span>5 Days</span>
                <span>10 Days</span>
              </div>
            </div>

            {/* Travelers Count Segmented Control */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Number of Travelers</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                {[
                  { count: 1, label: 'Solo' },
                  { count: 2, label: 'Couple' },
                  { count: 4, label: '4+' },
                  { count: 6, label: '6+' }
                ].map(({ count, label }) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelers: count })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      formData.travelers === count
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Step 4: Style & Logistics */}
        <section className="space-y-3.5">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            4. Style & Logistics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Season */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Season</label>
              <CustomSelect
                value={formData.season}
                onChange={(val) => setFormData({ ...formData, season: val })}
                options={['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon']}
              />
            </div>

            {/* Travel Style */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Travel Style</label>
              <CustomSelect
                value={formData.travelStyle}
                onChange={(val) => setFormData({ ...formData, travelStyle: val })}
                options={['Backpacker', 'Relaxed', 'Fast-paced', 'Cultural', 'Luxury']}
              />
            </div>

            {/* Stay Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Stay Type</label>
              <CustomSelect
                value={formData.accommodation}
                onChange={(val) => setFormData({ ...formData, accommodation: val })}
                options={['Boutique hotel', 'Hostel', '5-star Resort', 'Villa / Airbnb', 'Eco-Lodge']}
              />
            </div>

            {/* Preferred Transit */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Preferred Transit</label>
              <CustomSelect
                value={formData.transport}
                onChange={(val) => setFormData({ ...formData, transport: val })}
                options={['Train / Rail', 'Flight', 'Rental Car', 'Public Metro / Bus']}
              />
            </div>
          </div>
        </section>

        {/* Primary Action Button */}
        <div className="pt-2">
          {formData.useMLPick && !mlRecommendations ? (
            <button
              type="button"
              onClick={handleRunRandomForest}
              disabled={loadingML}
              className="w-full py-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingML ? 'Evaluating Destinations with Random Forest...' : 'Evaluate Destinations with Random Forest ML'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleGenerateItinerary()}
              disabled={generating}
              className="w-full py-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Synthesizing Itinerary...' : 'Generate My Itinerary'}</span>
            </button>
          )}

          {/* ML Recommendations Card (if evaluated) */}
          {mlRecommendations && (
            <div className="mt-4 p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">
                  Top Recommended by Random Forest
                </span>
                <span className="text-xs text-blue-600 font-semibold">
                  {mlRecommendations.topRecommendations?.[0]?.matchConfidence}% Confidence Match
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mlRecommendations.topRecommendations?.slice(0, 2).map((rec) => (
                  <div
                    key={rec.name}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, destinationName: rec.name }));
                      handleGenerateItinerary(rec.name);
                    }}
                    className="p-3.5 bg-white rounded-xl border border-blue-200 hover:border-blue-400 cursor-pointer shadow-xs transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{rec.name}</span>
                      <span className="text-xs font-semibold text-blue-600">{rec.matchConfidence}%</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{rec.matchExplanation?.vibeAlignment}</p>
                    <span className="text-xs font-semibold text-blue-600 block pt-1">Generate Itinerary →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Testimonial / Social Proof Card (Screen 2 bottom) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card flex flex-col sm:flex-row items-center gap-5">
          {/* Left Traveler Photo */}
          <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Himachal landscape"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Quote */}
          <div className="space-y-2 flex-1">
            <Quote className="w-5 h-5 text-blue-600 opacity-80" />
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "Voyanta planned our 6-day Himachal trip and it was absolutely perfect. The itinerary matched our vibe, budget and the weather updates were super helpful."
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Aarav Mehta"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Aarav Mehta</span>
                  <span className="text-[10px] text-slate-400">Traveled to Himachal</span>
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
