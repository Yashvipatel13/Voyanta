import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, Users, Trash2, ArrowRight, Compass, Sparkles, Receipt } from 'lucide-react';
import { TripToolsModal } from '../components/TripToolsModal.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const SavedTrips = ({ onOpenSavedTrip, setTab }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedTripForTools, setSelectedTripForTools] = useState(null);


  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchTrips = async () => {
      try {
        const data = await api.getUserTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [isAuthenticated]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this saved trip?')) return;
    setDeletingId(id);
    try {
      await api.deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete trip');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-card my-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Bookmark className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to View Saved Trips</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Save custom itineraries, track budget breakdowns, and access your travel plans anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Trips
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your personalized travel itineraries and weather-adapted schedules.
          </p>
        </div>

        <button
          onClick={() => setTab('planner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Design an itinerary with our Random Forest AI planner and save it to your profile.
          </p>
          <button
            onClick={() => setTab('planner')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            Launch AI Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip) => {
            const vibesList = trip.vibes ? trip.vibes.split(',').map(s => s.trim()) : [];
            return (
              <div
                key={trip.id}
                onClick={() => onOpenSavedTrip(trip)}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 block">
                        {trip.destinationCountry || 'India'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {trip.destinationName}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, trip.id)}
                      disabled={deletingId === trip.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete saved trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.durationDays} Days</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{trip.travelStyle || 'Relaxed'}</span>
                  </div>

                  {vibesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vibesList.slice(0, 3).map((vibe) => (
                        <span
                          key={vibe}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Estimated Budget</span>
                    <span className="text-sm font-bold text-slate-900">₹{Number(trip.totalEstimatedCost || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTripForTools(trip);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                      title="Open Expense Ledger & Packing Checklist"
                    >
                      <Receipt className="w-3.5 h-3.5 text-blue-600" />
                      <span>Trip Tools</span>
                    </button>

                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trip Tools Modal (Expenses Ledger & Smart Packing Checklist) */}
      {selectedTripForTools && (
        <TripToolsModal
          isOpen={!!selectedTripForTools}
          onClose={() => setSelectedTripForTools(null)}
          trip={selectedTripForTools}
        />
      )}
    </div>
  );
};

