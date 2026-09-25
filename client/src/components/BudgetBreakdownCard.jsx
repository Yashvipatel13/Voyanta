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
    currency = 'INR'
  } = budgetBreakdown;

  const percentUsed = Math.min(Math.round((totalEstimatedCost / targetBudget) * 100), 100);
  const isOverBudget = totalEstimatedCost > targetBudget;
  const diff = Math.abs(targetBudget - totalEstimatedCost);
  const currencySymbol = currency === 'INR' || currency === '₹' ? '₹' : '$';

  const categories = [
    { label: 'Transport & Transit', amount: transport, icon: Plane, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Accommodation / Stays', amount: stay, icon: Home, bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Food & Dining', amount: food, icon: Utensils, bg: 'bg-amber-50 text-amber-600' },
    { label: 'Activities & Tickets', amount: activities, icon: Ticket, bg: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Estimated Budget Breakdown</h3>
            <p className="text-xs text-slate-500">Real-time cost calculation based on your itinerary</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Total Estimate</span>
          <p className="text-lg font-extrabold text-slate-900">
            {currencySymbol}{Number(totalEstimatedCost).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar vs Target */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">
            Target Budget: <span className="font-semibold text-slate-800">{currencySymbol}{Number(targetBudget).toLocaleString()}</span>
          </span>
          <span className={`font-semibold ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isOverBudget ? `+${currencySymbol}${diff.toLocaleString()} Over Budget` : `${currencySymbol}${diff.toLocaleString()} Remaining`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : 'bg-blue-600'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* 4 Cost Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${cat.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium text-slate-500 truncate">{cat.label}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{currencySymbol}{Number(cat.amount).toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Budget Status Advice */}
      <div className="text-xs pt-1 border-t border-slate-100">
        {isOverBudget ? (
          <div className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Consider choosing Economy accommodation or free nature trails to fit your target budget.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Well balanced! Your planned activities comfortably align with your target budget.</span>
          </div>
        )}
      </div>
    </div>
  );
};
