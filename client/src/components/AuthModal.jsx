import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) throw new Error('Please enter your name');
        await register(formData.name, formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('traveler@voyanta.com', 'voyanta123');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome back to Voyanta' : 'Create your Voyanta account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login' 
              ? 'Access your saved trips and personalized travel vibes' 
              : 'Join thousands of modern travelers discovering vibe-first journeys'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="traveler@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Login Shortcut */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Sign In with Demo Traveler Account</span>
          </button>
          <span className="text-[10px] text-slate-400 block mt-1">
            (Quick evaluation mode: traveler@voyanta.com / voyanta123)
          </span>
        </div>
      </div>
    </div>
  );
};
