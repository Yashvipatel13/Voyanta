import React from 'react';
import { Wallet, Plane, Home, Utensils, Ticket, AlertCircle, CheckCircle } from 'lucide-react';

export const BudgetBreakdownCard = ({ budgetBreakdown }) => {
  if (!budgetBreakdown) return null;

  const {
    transport = 0,
    stay = 0,
    food = 0,
    activities = 0,
    totalEstimatedCost = 0,
    targetBudget = 1000,
    currency = 'USD'
  } = budgetBreakdown;

  const percentUsed = Math.min(Math.round((totalEstimatedCost / targetBudget) * 100), 100);
  const isOverBudget = totalEstimatedCost > targetBudget;
  const diff = Math.abs(targetBudget - totalEstimatedCost);

  const categories = [
    { label: 'Transport & Transit', amount: transport, icon: Plane, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Accommodation / Stays', amount: stay, icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Food & Dining', amount: food, icon: Utensils, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Activities & Tickets', amount: activities, icon: Ticket, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="glass-card p-5 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Estimated Budget Breakdown</h3>
            <p className="text-xs text-slate-400">Real-time cost calculation based on your itinerary</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Total Estimate</span>
          <p className="text-lg font-extrabold text-white">
            ${totalEstimatedCost.toLocaleString()} <span className="text-xs font-normal text-slate-400">{currency}</span>
          </p>
        </div>
      </div>

      {/* Progress Bar vs Target */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">
            Target Budget: <span className="font-semibold text-slate-200">${targetBudget.toLocaleString()}</span>
          </span>
          <span className={`font-semibold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isOverBudget ? `+$${diff} Over Budget` : `$${diff} Remaining`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-surface-border rounded-full overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : 'bg-gradient-to-r from-sky-500 to-emerald-400'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* 4 Cost Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="p-3 rounded-lg bg-surface/60 border border-surface-border/60">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-md ${cat.bg} ${cat.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium text-slate-400 truncate">{cat.label}</span>
              </div>
              <p className="text-sm font-bold text-slate-200">${cat.amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Budget Status Advice */}
      <div className="flex items-center gap-2 pt-1 text-xs">
        {isOverBudget ? (
          <div className="flex items-center gap-1.5 text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Consider choosing Economy accommodation or free nature trails to fit your target budget.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Well balanced! Your planned activities comfortably align with your target budget.</span>
          </div>
        )}
      </div>
    </div>
  );
};
