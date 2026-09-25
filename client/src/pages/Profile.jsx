import React, { useState, useEffect } from 'react';
import { User, Bookmark, Heart, Sparkles, Check, LogOut, Save } from 'lucide-react';
import { VibeSelector } from '../components/VibeSelector.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export const Profile = ({ setTab, openAuthModal }) => {
  const { user, isAuthenticated, logout, updatePreferences } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [preferredVibes, setPreferredVibes] = useState([]);
  const [defaultBudget, setDefaultBudget] = useState('Moderate');
  const [travelStyle, setTravelStyle] = useState('Relaxed');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFullProfile = async () => {
      try {
        const res = await api.getProfile();
        setProfileData(res.user);
        const prefs = res.user.preferences || {};
        setPreferredVibes(prefs.preferredVibes || ['Nature & Peace', 'Café / Slow Travel']);
        setDefaultBudget(prefs.defaultBudget || 'Moderate');
        setTravelStyle(prefs.travelStyle || 'Relaxed');
      } catch (err) {
        console.error(err);
      }
    };
    fetchFullProfile();
  }, [isAuthenticated]);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        preferredVibes,
        defaultBudget,
        travelStyle
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center glass-card rounded-2xl space-y-4">
        <User className="w-12 h-12 text-sky-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In to View Profile</h2>
        <p className="text-xs text-slate-400">
          Manage your traveler preferences and saved itineraries.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-20">
      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-emerald-400 p-[2px] shadow-glow-primary">
            <div className="w-full h-full bg-surface rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-white">
              {user?.name?.[0]?.toUpperCase() || 'T'}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Voyanta Verified Traveler
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setTab('saved')}
          className="glass-card p-4 rounded-xl border border-surface-border cursor-pointer hover:border-sky-500/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-semibold">Saved Trips</span>
          </div>
          <p className="text-2xl font-extrabold text-white">
            {profileData?.trips?.length || 0}
          </p>
        </div>

        <div 
          onClick={() => setTab('wishlist')}
          className="glass-card p-4 rounded-xl border border-surface-border cursor-pointer hover:border-rose-500/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-semibold">Wishlist Spots</span>
          </div>
          <p className="text-2xl font-extrabold text-white">
            {profileData?.wishlists?.length || 0}
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-surface-border col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">Primary Vibe</span>
          </div>
          <p className="text-sm font-bold text-white truncate">
            {preferredVibes[0] || 'Explorer'}
          </p>
        </div>
      </div>

      {/* Travel Preferences Customizer */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surface-border space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Traveler Vibe & Default Preferences</h2>
            <p className="text-xs text-slate-400">
              These defaults train the Random Forest recommendation model when scoring new destinations for you.
            </p>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:bg-sky-400 transition-colors"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Settings'}</span>
              </>
            )}
          </button>
        </div>

        {/* Budget & Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Default Budget Tier</label>
            <select
              value={defaultBudget}
              onChange={(e) => setDefaultBudget(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-sm text-white"
            >
              <option value="Economy">Economy (Budget-friendly / Hostels)</option>
              <option value="Moderate">Moderate (Boutique hotels / City comforts)</option>
              <option value="Luxury">Luxury (5-star resorts / Fine dining)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Default Travel Pace</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-sm text-white"
            >
              <option value="Backpacker">Backpacker (Scrappy, adventurous)</option>
              <option value="Relaxed">Relaxed (Unrushed, café visits, slow walks)</option>
              <option value="Fast-paced">Fast-paced (See everything in fewer days)</option>
              <option value="Cultural">Cultural (Museums, heritage landmarks)</option>
              <option value="Luxury">Luxury (Fine pampering & chauffeur transport)</option>
            </select>
          </div>
        </div>

        {/* Vibes */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Favorite Travel Vibes (Select all that inspire you):
          </label>
          <VibeSelector
            selectedVibes={preferredVibes}
            onChange={setPreferredVibes}
          />
        </div>
      </div>
    </div>
  );
};
