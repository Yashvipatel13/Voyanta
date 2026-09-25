import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { Home } from './pages/Home.jsx';
import { Planner } from './pages/Planner.jsx';
import { Explore } from './pages/Explore.jsx';
import { ItineraryView } from './pages/ItineraryView.jsx';
import { SavedTrips } from './pages/SavedTrips.jsx';
import { Wishlist } from './pages/Wishlist.jsx';
import { Profile } from './pages/Profile.jsx';
import { Compass, Sparkles, Database, Cpu, CloudSun } from 'lucide-react';

export const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [selectedDestinationForPlanner, setSelectedDestinationForPlanner] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleItineraryGenerated = (itineraryData) => {
    setActiveItinerary(itineraryData);
    setCurrentTab('itinerary');
  };

  const handleOpenSavedTrip = (trip) => {
    // Format saved trip data for ItineraryView
    const formatted = {
      id: trip.id,
      destinationName: trip.destinationName,
      destinationCountry: trip.destinationCountry,
      durationDays: trip.durationDays,
      travelers: trip.travelers,
      travelStyle: trip.travelStyle,
      vibes: trip.vibes ? trip.vibes.split(',').map(s => s.trim()) : [],
      budgetBreakdown: {
        transport: trip.budgetTransport,
        stay: trip.budgetStay,
        food: trip.budgetFood,
        activities: trip.budgetActivities,
        totalEstimatedCost: trip.totalEstimatedCost,
        targetBudget: trip.targetBudget,
        currency: 'USD',
        isOverBudget: trip.totalEstimatedCost > trip.targetBudget
      },
      itineraryDays: trip.itineraryDays
    };

    setActiveItinerary(formatted);
    setCurrentTab('itinerary');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        openAuthModal={openAuthModal}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            setTab={setCurrentTab}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
          />
        )}

        {currentTab === 'planner' && (
          <Planner
            selectedDestination={selectedDestinationForPlanner}
            onItineraryGenerated={handleItineraryGenerated}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === 'explore' && (
          <Explore
            setTab={setCurrentTab}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryView
            itinerary={activeItinerary}
            onBackToPlanner={() => setCurrentTab('planner')}
            openAuthModal={openAuthModal}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === 'saved' && (
          <SavedTrips
            onOpenSavedTrip={handleOpenSavedTrip}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === 'wishlist' && (
          <Wishlist
            setTab={setCurrentTab}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
          />
        )}

        {currentTab === 'profile' && (
          <Profile
            setTab={setCurrentTab}
            openAuthModal={openAuthModal}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-surface-border glass-panel mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white font-['Outfit'] tracking-tight">Voyanta</span>
                <p className="text-xs text-slate-400">AI-Powered Vibe Travel & Dynamic Itinerary Architecture</p>
              </div>
            </div>

            {/* Architecture Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-surface-border">
                <Cpu className="w-3 h-3 text-sky-400" />
                <span>Random Forest ML</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-surface-border">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Prisma ORM & Supabase</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-surface-border">
                <CloudSun className="w-3 h-3 text-amber-400" />
                <span>Smart Weather Adaptation</span>
              </span>
            </div>

            <div className="text-xs text-slate-500 text-center md:text-right">
              Minor Project — Voyanta Architecture
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
