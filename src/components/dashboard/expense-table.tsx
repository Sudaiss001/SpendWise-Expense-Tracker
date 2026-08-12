'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Edit2, Trash2, ArrowUpDown, CalendarDays,
  ChevronDown, X, ChevronLeft, ChevronRight, Filter, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useExpenseStore,
  type Expense,
  type ExpenseCategory,
  type PaymentMethod,
  ALL_CATEGORIES,
} from '@/store/expense-store';

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Bank Transfer', 'Cash', 'POS', 'Mobile Money', 'Cheque',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Office Supplies': 'bg-violet/15 text-violet-400',
  'Utilities': 'bg-blue-500/15 text-blue-400',
  'Transport': 'bg-amber-400/15 text-amber-400',
  'Marketing': 'bg-crimson/15 text-crimson',
  'Salaries': 'bg-emerald/15 text-emerald',
  'Software': 'bg-indigo-500/15 text-indigo-400',
  'Rent': 'bg-pink-500/15 text-pink-400',
  'Meals & Entertainment': 'bg-orange-500/15 text-orange-400',
  'Inventory': 'bg-teal-500/15 text-teal-400',
  'Miscellaneous': 'bg-gray-500/15 text-gray-400',
};

interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
}

function EditExpenseModal({ expense, onClose }: EditExpenseModalProps) {
  const editExpense = useExpenseStore((s) => s.editExpense);
  const [date, setDate] = useState(expense.date);
  const [vendor, setVendor] = useState(expense.vendor);
  const [category, setCategory] = useState(expense.category);
  const [paymentMethod, setPaymentMethod] = useState(expense.paymentMethod);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [description, setDescription] = useState(expense.description || '');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showPayDropdown, setShowPayDropdown] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    editExpense(expense.id, {
      date,
      vendor: vendor.trim(),
      category,
      paymentMethod,
      amount: parseFloat(amount),
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        >
          <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="text-lg font-bold text-white">Edit Expense</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-white hover:bg-white/5">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white/5 border-white/10 text-white h-11 [color-scheme:dark]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Vendor</label>
                <Input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} required className="bg-white/5 border-white/10 text-white h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Category</label>
                  <div className="relative">
                    <button type="button" onClick={() => { setShowCatDropdown(!showCatDropdown); setShowPayDropdown(false); }} className="w-full flex items-center justify-between h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                      <span className="truncate">{category}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                    <AnimatePresence>
                      {showCatDropdown && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 top-full mt-1 w-full glass-strong rounded-lg overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                          {ALL_CATEGORIES.map((cat) => (
                            <button key={cat} type="button" onClick={() => { setCategory(cat); setShowCatDropdown(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${cat === category ? 'text-violet bg-violet/10' : 'text-white'}`}>{cat}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Payment</label>
                  <div className="relative">
                    <button type="button" onClick={() => { setShowPayDropdown(!showPayDropdown); setShowCatDropdown(false); }} className="w-full flex items-center justify-between h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                      <span className="truncate">{paymentMethod}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                    <AnimatePresence>
                      {showPayDropdown && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 top-full mt-1 w-full glass-strong rounded-lg overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                          {PAYMENT_METHODS.map((m) => (
                            <button key={m} type="button" onClick={() => { setPaymentMethod(m); setShowPayDropdown(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${m === paymentMethod ? 'text-violet bg-violet/10' : 'text-white'}`}>{m}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₦</span>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" className="pl-8 bg-white/5 border-white/10 text-white h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Description</label>
                <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/5 border-white/10 text-white h-11" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white hover:bg-white/5 h-11">Cancel</Button>
                <Button type="submit" className="flex-1 bg-violet hover:bg-violet/90 text-white font-semibold h-11">Save Changes</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

export default function ExpenseTable() {
  const {
    getFilteredExpenses, getPaginatedExpenses, getTotalPages,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    currentPage, setCurrentPage,
    deleteExpense, resetFilters,
  } = useExpenseStore();

  const [sortField, setSortField] = useState<'date' | 'amount' | 'vendor'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredExpenses = getFilteredExpenses();
  const totalPages = getTotalPages();

  const paginatedExpenses = getPaginatedExpenses().sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sortField === 'amount') return dir * (a.amount - b.amount);
    return dir * a.vendor.localeCompare(b.vendor);
  });

  const hasActiveFilters = filterCategory !== 'All' || filterDateFrom || filterDateTo;

  const handleSort = (field: 'date' | 'amount' | 'vendor') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Pagination info
  const startIdx = (currentPage - 1) * useExpenseStore.getState().pageSize + 1;
  const endIdx = Math.min(currentPage * useExpenseStore.getState().pageSize, filteredExpenses.length);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="glass rounded-xl"
      >
        {/* Filter & Search Bar */}
        <div className="p-5 border-b border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-10 w-full"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`flex items-center gap-2 h-10 px-3 rounded-lg border text-sm whitespace-nowrap transition-colors ${
                  filterCategory !== 'All'
                    ? 'bg-violet/15 border-violet/40 text-violet'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{filterCategory === 'All' ? 'All Categories' : filterCategory}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 top-full mt-1 w-full min-w-[200px] glass-strong rounded-lg overflow-hidden max-h-56 overflow-y-auto custom-scrollbar"
                  >
                    <button
                      type="button"
                      onClick={() => { setFilterCategory('All'); setShowCategoryDropdown(false); }}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 transition-colors ${filterCategory === 'All' ? 'text-violet bg-violet/10 font-medium' : 'text-white'}`}
                    >
                      All Categories
                    </button>
                    {ALL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setFilterCategory(cat); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 transition-colors ${cat === filterCategory ? 'text-violet bg-violet/10 font-medium' : 'text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Date From */}
            <div className="relative w-full sm:w-auto">
              <Input
                type="date"
                placeholder="From"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-10 w-full sm:w-[150px] text-sm [color-scheme:dark]"
              />
            </div>

            {/* Date To */}
            <div className="relative w-full sm:w-auto">
              <Input
                type="date"
                placeholder="To"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-10 w-full sm:w-[150px] text-sm [color-scheme:dark]"
              />
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="h-10 px-3 text-muted-foreground hover:text-violet hover:bg-violet/10 text-sm flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  { key: 'date' as const, label: 'Date' },
                  { key: 'vendor' as const, label: 'Vendor' },
                  { key: 'amount' as const, label: 'Amount' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Payment
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedExpenses.map((expense, i) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-white whitespace-nowrap">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-white font-medium">{expense.vendor}</span>
                      {expense.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5 hidden lg:block">
                          {expense.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-crimson">
                        {formatNaira(expense.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          CATEGORY_COLORS[expense.category] || 'bg-gray-500/15 text-gray-400'
                        }`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{expense.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingExpense(expense)}
                          className="w-8 h-8 text-muted-foreground hover:text-violet hover:bg-violet/10"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                          className="w-8 h-8 text-muted-foreground hover:text-crimson hover:bg-crimson/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {paginatedExpenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No expenses found.</p>
            {(searchQuery || hasActiveFilters) && (
              <p className="text-sm text-muted-foreground/60 mt-1">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        )}

        {/* Footer: Count + Pagination */}
        <div className="px-5 py-3 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {filteredExpenses.length > 0 ? `${startIdx}-${endIdx}` : '0'} of {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>

          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-3 border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first, last, current, and neighbors
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push('dots');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'dots' ? (
                    <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                        item === currentPage
                          ? 'bg-violet text-white'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-3 border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Edit modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </>
  );
}
