import React, { useState, useEffect } from 'react';
import { 
  X, Receipt, CheckSquare, Plus, Trash2, Sparkles, AlertCircle, 
  TrendingUp, TrendingDown, DollarSign, Calendar, Tag, Check, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api.js';

export const TripToolsModal = ({ isOpen, onClose, trip }) => {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'checklist'
  
  // Expenses State
  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Checklist State
  const [checklists, setChecklists] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [checkCategoryFilter, setCheckCategoryFilter] = useState('All');
  const [newCheckItem, setNewCheckItem] = useState({ item: '', category: 'Essentials' });
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const tripId = trip?.id;

  // Load data whenever modal opens or trip changes
  useEffect(() => {
    if (!isOpen || !tripId) return;

    const loadData = async () => {
      setExpensesLoading(true);
      setChecklistLoading(true);
      try {
        const [expData, chkData] = await Promise.all([
          api.getExpenses(tripId).catch(() => []),
          api.getChecklists(tripId).catch(() => [])
        ]);
        const expList = Array.isArray(expData) ? expData : (expData?.expenses || []);
        const chkList = Array.isArray(chkData) ? chkData : (chkData?.items || chkData?.checklists || []);
        setExpenses(expList);
        setChecklists(chkList);
      } catch (err) {
        console.error('Failed to load trip tools data:', err);
      } finally {
        setExpensesLoading(false);
        setChecklistLoading(false);
      }
    };

    loadData();
  }, [isOpen, tripId]);

  if (!isOpen || !trip) return null;

  // Calculation Math
  const targetBudget = Number(trip.targetBudget || trip.totalEstimatedCost || 40000);
  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const remainingBudget = targetBudget - totalSpent;
  const spentPercent = Math.min(100, Math.round((totalSpent / targetBudget) * 100));

  const completedChecklistCount = checklists.filter(c => c.completed).length;
  const checklistPercent = checklists.length > 0 
    ? Math.round((completedChecklistCount / checklists.length) * 100) 
    : 0;

  // Expense Handlers
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0 || !expenseForm.description) return;
    setIsSubmittingExpense(true);
    try {
      const created = await api.addExpense(tripId, {
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        description: expenseForm.description,
        date: expenseForm.date
      });
      const newExp = created?.expense || created;
      setExpenses(prev => [newExp, ...prev]);
      setExpenseForm({
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setActionMessage('Expense recorded successfully!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to record expense');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.deleteExpense(tripId, expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  // Checklist Handlers
  const handleToggleChecklist = async (itemId) => {
    // Optimistic UI update
    setChecklists(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
    try {
      await api.toggleChecklistItem(tripId, itemId);
    } catch (err) {
      console.error(err);
      // Revert if failed
      setChecklists(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ));
    }
  };

  const handleAddCheckItem = async (e) => {
    e.preventDefault();
    if (!newCheckItem.item.trim()) return;
    try {
      const created = await api.addChecklistItem(tripId, newCheckItem);
      setChecklists(prev => [...prev, created]);
      setNewCheckItem({ item: '', category: 'Essentials' });
    } catch (err) {
      alert(err.message || 'Failed to add checklist item');
    }
  };

  const handleDeleteCheckItem = async (itemId) => {
    try {
      await api.deleteChecklistItem(tripId, itemId);
      setChecklists(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      alert(err.message || 'Failed to delete checklist item');
    }
  };

  const handleAutoGenerateChecklist = async () => {
    setIsAutoGenerating(true);
    try {
      const result = await api.autoGenerateChecklist(tripId);
      const items = Array.isArray(result) ? result : (result?.items || result?.checklists || []);
      setChecklists(items);
      setActionMessage('✨ Smart packing checklist auto-generated!');
      setTimeout(() => setActionMessage(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to auto-generate checklist');
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const filteredChecklists = checkCategoryFilter === 'All' 
    ? checklists 
    : checklists.filter(c => c.category?.toLowerCase() === checkCategoryFilter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              {activeTab === 'expenses' ? <Receipt className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Trip Tools: {trip.destinationName}
              </h2>
              <p className="text-xs text-slate-500">
                {trip.durationDays} Days • ₹{targetBudget.toLocaleString('en-IN')} Target Budget
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 py-3.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Expense Ledger</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 font-bold text-slate-600">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 py-3.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Packing Checklist</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 font-bold text-slate-600">
              {completedChecklistCount}/{checklists.length}
            </span>
          </button>
        </div>

        {/* Banner Alert Message */}
        {actionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-emerald-800 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ===================== TAB 1: EXPENSES ===================== */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              
              {/* Budget Overview Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Target Budget</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹{targetBudget.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Spent</span>
                    <p className="text-xl font-extrabold text-blue-600 mt-0.5">₹{totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Remaining</span>
                    <p className={`text-xl font-extrabold mt-0.5 ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal ml-1">
                        {remainingBudget >= 0 ? 'left' : 'over budget!'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>{spentPercent}% of total budget utilized</span>
                    <span>{remainingBudget >= 0 ? `₹${remainingBudget.toLocaleString('en-IN')} remaining` : 'Exceeded'}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        spentPercent > 95 ? 'bg-rose-500' : spentPercent > 75 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, spentPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Add Expense Form */}
              <form onSubmit={handleAddExpense} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Log New Expense</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Description (e.g. River rafting pass)"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="sm:col-span-2 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />

                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Amount"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-white text-slate-700"
                  >
                    <option value="Stay">Stay</option>
                    <option value="Transport">Transport</option>
                    <option value="Food">Food</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingExpense}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isSubmittingExpense ? 'Adding...' : 'Add Expense (₹)'}
                  </button>
                </div>
              </form>

              {/* Expense Ledger Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recorded Expenses ({expenses.length})
                  </h3>
                </div>

                {expensesLoading ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading expense ledger...</div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                    No expenses recorded yet. Use the form above to track your trip spending.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                    {expenses.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            item.category === 'Stay' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                            item.category === 'Transport' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                            item.category === 'Food' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                            item.category === 'Activities' ? 'bg-purple-50 text-purple-700 border border-purple-200/60' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {item.category}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 leading-snug">{item.description}</p>
                            <span className="text-[10px] text-slate-400">{item.date || 'Recent'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-slate-900 font-mono">
                            ₹{Number(item.amount).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(item.id)}
                            className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 2: PACKING CHECKLIST ===================== */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              
              {/* Checklist Progress & Auto-Generate Bar */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {completedChecklistCount} of {checklists.length} Packed
                    </span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                      {checklistPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Smart checklist curated for {trip.destinationName}'s high altitude & regional climate.
                  </p>
                </div>

                <button
                  onClick={handleAutoGenerateChecklist}
                  disabled={isAutoGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 shadow-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAutoGenerating ? 'Curating Items...' : 'Auto-Generate Checklist'}</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Documents', 'Clothing', 'Medical', 'Electronics', 'Essentials'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCheckCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      checkCategoryFilter === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Add Custom Checklist Item */}
              <form onSubmit={handleAddCheckItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom packing item (e.g. Extra camera battery)"
                  value={newCheckItem.item}
                  onChange={(e) => setNewCheckItem(prev => ({ ...prev, item: e.target.value }))}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
                <select
                  value={newCheckItem.category}
                  onChange={(e) => setNewCheckItem(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-700"
                >
                  <option value="Documents">Documents</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Medical">Medical</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Essentials">Essentials</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Add
                </button>
              </form>

              {/* Checklist Items */}
              {checklistLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading packing items...</div>
              ) : filteredChecklists.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No items found. Click "Auto-Generate Checklist" above to load climate-recommended essentials.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChecklists.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleToggleChecklist(c.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        c.completed 
                          ? 'bg-slate-50 border-slate-200 text-slate-400' 
                          : 'bg-white border-slate-200/90 hover:border-blue-300 text-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          c.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {c.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-medium ${c.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {c.item}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100">
                          {c.category}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCheckItem(c.id); }}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded-md"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Synced directly with your Supabase cloud database</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
