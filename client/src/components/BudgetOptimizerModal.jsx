import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, TrendingDown, ArrowRight, Check, ShieldCheck, 
  IndianRupee, Bed, Car, Utensils, Compass, Zap 
} from 'lucide-react';
import { api } from '../services/api.js';

export const BudgetOptimizerModal = ({ isOpen, onClose, trip, onApplyOptimizations }) => {
  const [loading, setLoading] = useState(false);
  const [optimizationData, setOptimizationData] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [appliedBanner, setAppliedBanner] = useState(false);

  useEffect(() => {
    if (!isOpen || !trip) return;

    const fetchOptimizations = async () => {
      setLoading(true);
      try {
        const data = await api.optimizeBudget({
          destinationName: trip.destinationName,
          durationDays: trip.durationDays || 4,
          travelers: trip.travelers || 2,
          targetBudget: trip.targetBudget || trip.totalEstimatedCost || 40000,
          budgetTier: trip.budgetTier || 'Moderate'
        });
        setOptimizationData(data);
        // Default to applying all high impact suggestions
        const defaultApplied = new Set((data.suggestions || []).map(s => s.id));
        setAppliedSuggestions(defaultApplied);
      } catch (err) {
        console.error('Failed to optimize budget:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimizations();
  }, [isOpen, trip]);

  if (!isOpen || !trip) return null;

  const toggleSuggestion = (id) => {
    setAppliedSuggestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Compute live savings based on toggled selections
  const currentSelectedSavings = (optimizationData?.suggestions || [])
    .filter(s => appliedSuggestions.has(s.id))
    .reduce((sum, s) => sum + s.potentialSaving, 0);

  const baseBudget = Number(trip.targetBudget || trip.totalEstimatedCost || 40000);
  const liveOptimizedTotal = Math.max(baseBudget - currentSelectedSavings, 1000);

  const handleApply = () => {
    if (onApplyOptimizations) {
      onApplyOptimizations({
        newBudget: liveOptimizedTotal,
        savings: currentSelectedSavings,
        appliedCount: appliedSuggestions.size
      });
    }
    setAppliedBanner(true);
    setTimeout(() => {
      setAppliedBanner(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  AI Budget Optimizer
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/60">
                  Save in ₹
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {trip.destinationName} • {trip.durationDays} Days • {trip.travelers || 2} Travelers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Applied Notification */}
        {appliedBanner && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold animate-fadeIn">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Successfully updated trip target budget to ₹{liveOptimizedTotal.toLocaleString('en-IN')}!</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Analyzing destination rates and calculating smart savings...
              </p>
            </div>
          ) : !optimizationData ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Unable to calculate optimizations at this time.
            </div>
          ) : (
            <>
              {/* Savings Highlight Hero Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-card">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Potential Trip Savings</span>
                    </span>
                    <p className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                      ₹{currentSelectedSavings.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target budget reduced from ₹{baseBudget.toLocaleString('en-IN')} to ₹{liveOptimizedTotal.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-300">Savings Percentage</span>
                    <p className="text-xl font-bold text-emerald-400">
                      {Math.round((currentSelectedSavings / baseBudget) * 100)}% Saved
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Actionable Swaps ({appliedSuggestions.size} of {optimizationData.suggestions?.length} Active)
                </h3>

                <div className="space-y-3">
                  {optimizationData.suggestions?.map((item) => {
                    const isSelected = appliedSuggestions.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSuggestion(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{item.title}</span>
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {item.description}
                            </p>
                            <span className="text-[10px] font-medium text-slate-400">
                              Category: {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-emerald-600 font-mono">
                            -₹{item.potentialSaving.toLocaleString('en-IN')}
                          </span>
                          <span className="block text-[9px] text-slate-400">est. savings</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-900">New Target: </span>
            ₹{liveOptimizedTotal.toLocaleString('en-IN')}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={loading || currentSelectedSavings === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span>Apply Savings to Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
