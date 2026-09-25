import React, { useState, useEffect } from 'react';
import { User, Bookmark, Heart, Sparkles, Check, LogOut, Save, Camera } from 'lucide-react';
import { VibeSelector } from '../components/VibeSelector.jsx';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { AvatarModal } from '../components/AvatarModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export const Profile = ({ setTab, openAuthModal }) => {
  const { user, isAuthenticated, logout, updatePreferences, updateAvatar } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [preferredVibes, setPreferredVibes] = useState([]);
  const [defaultBudget, setDefaultBudget] = useState('Moderate');
  const [travelStyle, setTravelStyle] = useState('Relaxed');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

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
      <div className="max-w-md mx-auto px-4 py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-card my-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to View Profile</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Manage your traveler preferences and saved itineraries.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          {/* Avatar with Camera Trigger Overlay */}
          <div 
            className="relative group cursor-pointer select-none"
            onClick={() => setAvatarModalOpen(true)}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-200 group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
                {user?.name?.[0]?.toUpperCase() || 'T'}
              </div>
            )}

            {/* Camera / Edit Badge */}
            <div 
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
              title="Change profile photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Change photo</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
              Voyanta Verified Traveler
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Avatar Change / Upload Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={user?.avatar}
        userName={user?.name}
        onSave={async (newAvatar) => {
          await updateAvatar(newAvatar);
        }}
      />

      {/* Quick Nav Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setTab('saved')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-card cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Bookmark className="w-4 h-4 text-blue-600" />
            <span>Saved Trips</span>
          </div>
          <p className="text-xs text-slate-500">View and revisit your personalized travel itineraries.</p>
        </div>

        <div 
          onClick={() => setTab('wishlist')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-card cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlist</span>
          </div>
          <p className="text-xs text-slate-500">Access bookmarked destinations for future journeys.</p>
        </div>
      </div>

      {/* Traveler Preferences Customization Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Traveler Personalization Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            These default preferences prime the Random Forest machine learning classifier for your account.
          </p>
        </div>

        {/* Default Vibes */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Favorite Travel Vibes & Aesthetics
          </label>
          <VibeSelector
            selectedVibes={preferredVibes}
            onChange={setPreferredVibes}
            variant="compact"
          />
        </div>

        {/* Default Budget & Travel Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Default Budget */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Default Budget Tier
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['Economy', 'Moderate', 'Luxury'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDefaultBudget(tier)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    defaultBudget === tier
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Default Travel Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Default Travel Style
            </label>
            <CustomSelect
              value={travelStyle}
              onChange={(val) => setTravelStyle(val)}
              options={['Backpacker', 'Relaxed', 'Fast-paced', 'Cultural', 'Luxury']}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Updating...' : 'Save Preferences'}</span>
          </button>

          {savedSuccess && (
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Preferences updated successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
