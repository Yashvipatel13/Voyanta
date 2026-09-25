import React, { useState } from 'react';
import { Compass, Sparkles, Bookmark, Heart, User, LogOut, LogIn, Menu, X, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ currentTab, setTab, openAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'planner', label: 'AI Trip Planner', icon: Sparkles, badge: 'ML Forest' },
    { id: 'explore', label: 'Explore Vibes', icon: Plane },
    { id: 'saved', label: 'Saved Trips', icon: Bookmark, authRequired: true },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-[2px] shadow-glow-primary transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-['Outfit'] tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-white bg-clip-text text-transparent">
                Voyanta
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-semibold text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded">
                AI Travel
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              if (item.authRequired && !isAuthenticated) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth & Profile Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border hover:border-slate-600 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-xl shadow-xl py-2 border border-surface-border z-50">
                    <div className="px-4 py-2 border-b border-surface-border">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setTab('profile'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-sky-400 transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      Traveler Profile
                    </button>
                    <button
                      onClick={() => { setTab('saved'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-sky-400 transition-colors text-left"
                    >
                      <Bookmark className="w-4 h-4" />
                      My Saved Trips
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-t border-surface-border mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-glow-primary transition-all duration-200"
                >
                  Join Voyanta
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-surface-border px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.authRequired && !isAuthenticated) return null;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentTab === item.id ? 'text-sky-400 bg-sky-500/10' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-surface-border">
            {isAuthenticated ? (
              <div className="space-y-1">
                <button
                  onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300"
                >
                  <User className="w-4 h-4 text-sky-400" />
                  Profile ({user?.name})
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-sm text-center font-medium text-slate-200 border border-surface-border rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => { openAuthModal('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-sm text-center font-semibold text-white bg-sky-500 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
