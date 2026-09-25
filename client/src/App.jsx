import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { InfoModal } from './components/InfoModal.jsx';
import { Home } from './pages/Home.jsx';
import { Planner } from './pages/Planner.jsx';
import { Explore } from './pages/Explore.jsx';
import { ItineraryView } from './pages/ItineraryView.jsx';
import { SavedTrips } from './pages/SavedTrips.jsx';
import { Wishlist } from './pages/Wishlist.jsx';
import { Profile } from './pages/Profile.jsx';
import { Vehicles } from './pages/Vehicles.jsx';
import { Hotels } from './pages/Hotels.jsx';
import { Compass, Twitter, Instagram, Youtube, Globe, Heart } from 'lucide-react';

export const AppContent = () => {
  const [currentTab, setCurrentTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'planner', 'explore', 'hotels', 'vehicles', 'itinerary', 'saved', 'wishlist', 'profile'].includes(hash)
      ? hash
      : 'home';
  });

  const [globalSearch, setGlobalSearch] = useState('');
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [selectedDestinationForPlanner, setSelectedDestinationForPlanner] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [infoModal, setInfoModal] = useState({ isOpen: false, type: 'about' });

  const handleSearch = (query) => {
    setGlobalSearch(query);
    navigateTo('explore');
  };

  // Synchronize state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'planner', 'explore', 'hotels', 'vehicles', 'itinerary', 'saved', 'wishlist', 'profile'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const navigateTo = (tab) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const openInfoModal = (type) => {
    setInfoModal({ isOpen: true, type });
  };

  const closeInfoModal = () => {
    setInfoModal({ isOpen: false, type: 'about' });
  };

  const handleItineraryGenerated = (itineraryData) => {
    setActiveItinerary(itineraryData);
    navigateTo('itinerary');
  };

  const handleOpenSavedTrip = (trip) => {
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
        currency: 'INR',
        isOverBudget: trip.totalEstimatedCost > trip.targetBudget
      },
      itineraryDays: trip.itineraryDays
    };

    setActiveItinerary(formatted);
    navigateTo('itinerary');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100 selection:text-blue-700">
      {/* Global Navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={navigateTo}
        openAuthModal={openAuthModal}
        onSearch={handleSearch}
        setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            setTab={navigateTo}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
          />
        )}

        {currentTab === 'planner' && (
          <Planner
            selectedDestination={selectedDestinationForPlanner}
            onItineraryGenerated={handleItineraryGenerated}
            setTab={navigateTo}
          />
        )}

        {currentTab === 'explore' && (
          <Explore
            setTab={navigateTo}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
            initialSearch={globalSearch}
          />
        )}

        {currentTab === 'hotels' && (
          <Hotels
            setTab={navigateTo}
            openAuthModal={openAuthModal}
          />
        )}

        {currentTab === 'vehicles' && (
          <Vehicles
            setTab={navigateTo}
            openAuthModal={openAuthModal}
          />
        )}


        {currentTab === 'itinerary' && (
          <ItineraryView
            itinerary={activeItinerary}
            onBackToPlanner={() => navigateTo('planner')}
            openAuthModal={openAuthModal}
            setTab={navigateTo}
          />
        )}

        {currentTab === 'saved' && (
          <SavedTrips
            onOpenSavedTrip={handleOpenSavedTrip}
            setTab={navigateTo}
          />
        )}

        {currentTab === 'wishlist' && (
          <Wishlist
            setTab={navigateTo}
            setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
          />
        )}

        {currentTab === 'profile' && (
          <Profile
            setTab={navigateTo}
            openAuthModal={openAuthModal}
          />
        )}
      </main>

      {/* Clean Premium Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <a 
                href="#home"
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                className="inline-flex items-center gap-2.5 cursor-pointer group select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  Voyanta
                </span>
              </a>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                AI-powered travel planning for modern explorers. Discover. Plan. Travel by your vibe.
              </p>
              {/* Social icons with target="_blank" */}
              <div className="flex items-center gap-3 pt-1 text-slate-400">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:text-blue-500 hover:bg-slate-100 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:text-pink-500 hover:bg-slate-100 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:text-red-500 hover:bg-slate-100 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://voyanta.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-100 transition-colors"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>
                  <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="hover:text-slate-900 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#planner" onClick={(e) => { e.preventDefault(); navigateTo('planner'); }} className="hover:text-slate-900 transition-colors">
                    AI Trip Planner
                  </a>
                </li>
                <li>
                  <a href="#explore" onClick={(e) => { e.preventDefault(); navigateTo('explore'); }} className="hover:text-slate-900 transition-colors">
                    Explore Destinations
                  </a>
                </li>
                <li>
                  <a href="#vehicles" onClick={(e) => { e.preventDefault(); navigateTo('vehicles'); }} className="hover:text-slate-900 transition-colors">
                    Vehicle Rentals
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>
                  <button onClick={() => openInfoModal('guides')} className="hover:text-slate-900 text-left transition-colors">
                    Travel Guides
                  </button>
                </li>
                <li>
                  <button onClick={() => openInfoModal('blog')} className="hover:text-slate-900 text-left transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => openInfoModal('help')} className="hover:text-slate-900 text-left transition-colors">
                    Help & Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>
                  <button onClick={() => openInfoModal('about')} className="hover:text-slate-900 text-left transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => openInfoModal('privacy')} className="hover:text-slate-900 text-left transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openInfoModal('terms')} className="hover:text-slate-900 text-left transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: 2026 Copyright */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>Made with ❤️ for travelers worldwide.</p>
            <p>© 2026 Voyanta. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={infoModal.isOpen}
        type={infoModal.type}
        onClose={closeInfoModal}
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
