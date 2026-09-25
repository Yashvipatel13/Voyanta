import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, Users, DollarSign, Trash2, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const SavedTrips = ({ onOpenSavedTrip, setTab }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
      <div className="max-w-md mx-auto px-4 py-20 text-center glass-card rounded-2xl space-y-4">
        <Bookmark className="w-12 h-12 text-sky-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In to View Saved Trips</h2>
        <p className="text-xs text-slate-400">
          Save custom itineraries, track budget breakdowns, and access your plans anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-['Outfit'] text-white">
            My Saved Trips
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your personalized travel itineraries and weather-adapted schedules.
          </p>
        </div>

        <button
          onClick={() => setTab('planner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:bg-sky-400 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-surface-card animate-pulse border border-surface-border" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl space-y-4 max-w-lg mx-auto">
          <Compass className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Design an itinerary with our Random Forest AI planner and save it to your profile.
          </p>
          <button
            onClick={() => setTab('planner')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-black"
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
                className="glass-card p-6 rounded-2xl border border-surface-border hover:border-sky-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-sky-400">{trip.destinationCountry}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                        {trip.destinationName}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {trip.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>{trip.durationDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>${trip.totalEstimatedCost.toLocaleString()} Est.</span>
                    </div>
                  </div>

                  {vibesList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {vibesList.map(vibe => (
                        <span key={vibe} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-surface-border text-slate-300">
                          {vibe}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => handleDelete(e, trip.id)}
                    disabled={deletingId === trip.id}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
