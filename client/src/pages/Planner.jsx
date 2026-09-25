import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Users, DollarSign, Compass, ArrowRight, Check, AlertCircle, Plane, RefreshCw } from 'lucide-react';
import { VibeSelector } from '../components/VibeSelector.jsx';
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
    vibes: ['Nature & Peace', 'Culture & History', 'Café / Slow Travel'],
    accommodation: 'Boutique hotel',
    transport: 'Train'
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

  // If user selected a destination from Explore or Home
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
    if (!finalDestName) {
      setError('Please choose a destination or let the Random Forest model recommend one.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const itineraryData = await api.generateTrip({
        destinationName: finalDestName,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Decision-Tree Ensemble AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
          Design Your Dynamic Trip Plan
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Customize your budget, duration, party, and personal vibes. Voyanta will generate a responsive, day-by-day itinerary.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8">
        {/* Section 1: Destination Selection Mode */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider block">
            1. Destination Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, useMLPick: true })}
              className={`p-4 rounded-xl border text-left transition-all ${
                formData.useMLPick
                  ? 'bg-sky-500/15 border-sky-400 text-white ring-1 ring-sky-400'
                  : 'bg-surface-card border-surface-border text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-sky-300">
                <Sparkles className="w-4 h-4" />
                <span>Let Random Forest AI Pick</span>
              </div>
              <p className="text-xs text-slate-400">
                Recommends ideal global destinations scored across your vibes, budget, and season.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, useMLPick: false })}
              className={`p-4 rounded-xl border text-left transition-all ${
                !formData.useMLPick
                  ? 'bg-sky-500/15 border-sky-400 text-white ring-1 ring-sky-400'
                  : 'bg-surface-card border-surface-border text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-slate-200">
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Choose Specific Destination</span>
              </div>
              <p className="text-xs text-slate-400">
                Select from our curated database of world-class cultural & hidden travel gems.
              </p>
            </button>
          </div>

          {!formData.useMLPick && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Select Destination:
              </label>
              <select
                value={formData.destinationName}
                onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">-- Choose a Destination --</option>
                {destinationsList.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name}, {d.country} ({d.budgetTier} • {d.bestSeasons})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Section 2: Vibe Personalization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white uppercase tracking-wider">
              2. Your Travel Vibes & Moods
            </label>
            <span className="text-xs text-slate-400">{formData.vibes.length} selected</span>
          </div>
          <VibeSelector
            selectedVibes={formData.vibes}
            onChange={(vibes) => setFormData({ ...formData, vibes })}
          />
        </div>

        {/* Section 3: Trip Constraints (Budget, Duration, Travelers) */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider block">
            3. Budget & Parameters
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Budget Tier */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium">Budget Tier</span>
              <div className="grid grid-cols-3 gap-1 bg-surface p-1 rounded-xl border border-surface-border">
                {['Economy', 'Moderate', 'Luxury'].map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetTier: tier })}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      formData.budgetTier === tier
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium">
                Trip Duration: <strong className="text-white">{formData.durationDays} Days</strong>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-surface-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 Day</span>
                <span>5 Days</span>
                <span>10 Days</span>
              </div>
            </div>

            {/* Travelers */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium">
                Number of Travelers: <strong className="text-white">{formData.travelers} {formData.travelers === 1 ? 'Person' : 'People'}</strong>
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelers: count })}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      formData.travelers === count
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-surface-card border-surface-border text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {count === 1 ? 'Solo' : count === 2 ? 'Couple' : `${count}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Season, Travel Style, Accommodation & Transport */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider block">
            4. Style & Logistics
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Season */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Season</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-white"
              >
                {['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Travel Style */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Travel Style</label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-white"
              >
                {['Backpacker', 'Relaxed', 'Fast-paced', 'Cultural', 'Luxury'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Accommodation */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Stay Type</label>
              <select
                value={formData.accommodation}
                onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-white"
              >
                {['Hostel', 'Boutique hotel', '5-star Resort', 'Villa / Airbnb', 'Eco-Lodge'].map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

            {/* Transport */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Preferred Transit</label>
              <select
                value={formData.transport}
                onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-white"
              >
                {['Train / Rail', 'Flight', 'Rental Car', 'Public Metro / Bus'].map(tr => (
                  <option key={tr} value={tr}>{tr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Trigger ML Recommendations or Direct Generation */}
        <div className="pt-4 border-t border-surface-border space-y-6">
          {formData.useMLPick ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleRunRandomForest}
                disabled={loadingML}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500 hover:opacity-95 text-white shadow-glow-primary transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-sky-200" />
                <span>{loadingML ? 'Running Random Forest Tree Ensemble...' : 'Evaluate Destinations with Random Forest'}</span>
              </button>

              {/* Show ML Results */}
              {mlRecommendations && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">Top ML Destination Matches</h4>
                      <p className="text-xs text-slate-400">
                        {mlRecommendations.modelMetrics.nEstimators} decision trees evaluated on your feature vector.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mlRecommendations.topRecommendations.map((rec) => (
                      <div
                        key={rec.name}
                        onClick={() => handleGenerateItinerary(rec.name)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all ${
                          formData.destinationName === rec.name
                            ? 'bg-sky-500/15 border-sky-400'
                            : 'bg-surface-card/60 border-surface-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white">{rec.name}, {rec.country}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-sky-300 border border-indigo-400/30">
                            {rec.matchConfidence}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">{rec.matchExplanation.vibeAlignment}</p>
                        <button
                          type="button"
                          className="w-full py-2 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-black transition-colors"
                        >
                          Generate {formData.durationDays}-Day Itinerary for {rec.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleGenerateItinerary()}
              disabled={generating || !formData.destinationName}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-glow-primary transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Synthesizing Itinerary...' : `Generate Day-by-Day Plan for ${formData.destinationName || 'Destination'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
