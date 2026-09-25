import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Bookmark, Heart, User, LogOut, LogIn, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { NotificationDropdown } from './NotificationDropdown.jsx';
import { SearchModal } from './SearchModal.jsx';

export const Navbar = ({ currentTab, setTab, openAuthModal, onSearch, setSelectedDestinationForPlanner }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'AI Trip Planner' },
    { id: 'explore', label: 'Explore Vibes' },
    { id: 'hotels', label: 'Stays & Hotels' },
    { id: 'vehicles', label: 'Vehicle Rentals' },
  ];

  const authNavItems = [
    { id: 'saved', label: 'Saved Trips', icon: Bookmark },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  // Global Ctrl+K / Cmd+K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 py-2">
            
            {/* Brand Logo */}
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); setTab('home'); }}
              className="flex items-center gap-3 cursor-pointer group select-none py-1"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Voyanta
              </span>
            </a>

            {/* Desktop Main Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
              {mainNavItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); setTab(item.id); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Icons & Profile Cluster */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
              
              {/* 1. Search Icon Button with Tooltip */}
              <button
                type="button"
                id="navbar-search-btn"
                aria-label="Search destinations and vibes"
                title="Search destinations & vibes (Ctrl+K)"
                onClick={() => setSearchModalOpen(true)}
                className={`relative p-2.5 rounded-full transition-all border shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 group ${
                  currentTab === 'explore'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>

              {/* 2. Wishlist Icon Button */}
              <button
                type="button"
                id="navbar-wishlist-btn"
                aria-label="Wishlist"
                title="Saved Wishlist"
                onClick={() => setTab('wishlist')}
                className={`relative p-2.5 rounded-full transition-all border shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 group ${
                  currentTab === 'wishlist'
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 border-slate-200/80'
                }`}
              >
                <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${currentTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* 3. Saved Trips Icon Button */}
              <button
                type="button"
                id="navbar-saved-btn"
                aria-label="Saved Trips"
                title="Saved Trips"
                onClick={() => setTab('saved')}
                className={`relative p-2.5 rounded-full transition-all border shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 group ${
                  currentTab === 'saved'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 border-slate-200/80'
                }`}
              >
                <Bookmark className={`w-4 h-4 group-hover:scale-110 transition-transform ${currentTab === 'saved' ? 'fill-blue-500 text-blue-500' : ''}`} />
              </button>

              {/* 4. Notification Bell Dropdown */}
              <NotificationDropdown setTab={setTab} />

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* 5. User Profile / Authentication Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl py-2 border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <a
                        href="#profile"
                        onClick={(e) => { e.preventDefault(); setTab('profile'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Traveler Profile
                      </a>
                      <a
                        href="#saved"
                        onClick={(e) => { e.preventDefault(); setTab('saved'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        Saved Trips
                      </a>
                      <a
                        href="#wishlist"
                        onClick={(e) => { e.preventDefault(); setTab('wishlist'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Wishlist
                      </a>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow transition-all duration-150"
                  >
                    Join Voyanta
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Right Bar: Search, Wishlist, Saved, Notification & Hamburger */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTab('wishlist')}
                className="p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-slate-100 border border-slate-200/80"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${currentTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setTab('saved')}
                className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200/80"
                title="Saved Trips"
              >
                <Bookmark className={`w-4 h-4 ${currentTab === 'saved' ? 'fill-blue-500 text-blue-500' : ''}`} />
              </button>
              <NotificationDropdown setTab={setTab} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2">
            {mainNavItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); setTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentTab === item.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <a
                  href="#saved"
                  onClick={(e) => { e.preventDefault(); setTab('saved'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700"
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  Saved Trips
                </a>
                <a
                  href="#wishlist"
                  onClick={(e) => { e.preventDefault(); setTab('wishlist'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  Wishlist
                </a>
                <a
                  href="#profile"
                  onClick={(e) => { e.preventDefault(); setTab('profile'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <User className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Profile ({user?.name})</span>
                </a>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm text-center font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuthModal('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm text-center font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                >
                  Join Voyanta
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal with Suggestions */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={onSearch || ((q) => { setTab('explore'); })}
        setTab={setTab}
        setSelectedDestinationForPlanner={setSelectedDestinationForPlanner}
      />
    </>
  );
};
