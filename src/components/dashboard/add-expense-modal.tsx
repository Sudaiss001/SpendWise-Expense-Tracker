'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExpenseStore, ALL_CATEGORIES, type PaymentMethod } from '@/store/expense-store';
import { useAuthStore } from '@/store/auth-store';

const CATEGORIES = ALL_CATEGORIES;
const DEFAULT_CATEGORY = 'Inventory';

type CategoryOption = {
  id: string;
  name: string;
};

const FALLBACK_CATEGORY_OPTIONS: CategoryOption[] = CATEGORIES.map((name) => ({
  id: name,
  name,
}));

const PAYMENT_METHODS: PaymentMethod[] = [
  'Bank Transfer', 'Cash', 'POS', 'Mobile Money', 'Cheque',
];

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const addExpense = useExpenseStore((s) => s.addExpense);
  const fetchExpenses = useExpenseStore((s) => s.fetchExpenses);
  const user = useAuthStore((s) => s.user);
  const activeUserId = user?.id || 'user_1';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(DEFAULT_CATEGORY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>(FALLBACK_CATEGORY_OPTIONS);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const categoryOptions = categories.length > 0 ? categories : FALLBACK_CATEGORY_OPTIONS;
  const selectedCategory = categoryOptions.find((cat) => cat.id === selectedCategoryId);
  const selectedCategoryLabel = selectedCategory?.name || 'Select category';

  const getDefaultCategoryId = (options: CategoryOption[]) =>
    options.find((cat) => cat.name === DEFAULT_CATEGORY)?.id || options[0]?.id || '';

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    async function loadCategories() {
      try {
        const res = await fetch(`/api/categories?userId=${encodeURIComponent(activeUserId)}`);

        if (!res.ok) {
          throw new Error(`Failed to load categories (${res.status} ${res.statusText})`);
        }

        const data = await res.json();
        const fetchedCategories = Array.isArray(data)
          ? data.filter(
              (category): category is CategoryOption =>
                typeof category?.id === 'string' &&
                typeof category?.name === 'string'
            )
          : [];

        if (isCancelled) return;

        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setSelectedCategoryId((currentCategoryId) => {
            if (fetchedCategories.some((cat) => cat.id === currentCategoryId)) {
              return currentCategoryId;
            }

            const categoryWithCurrentName = fetchedCategories.find(
              (cat) => cat.name === currentCategoryId
            );

            return categoryWithCurrentName?.id || getDefaultCategoryId(fetchedCategories);
          });
        } else {
          setCategories(FALLBACK_CATEGORY_OPTIONS);
          setSelectedCategoryId((current) => current || getDefaultCategoryId(FALLBACK_CATEGORY_OPTIONS));
        }
      } catch (error) {
        console.error('Failed to load expense categories:', error);
        if (!isCancelled) {
          setCategories(FALLBACK_CATEGORY_OPTIONS);
        }
      }
    }

    loadCategories();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, activeUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!title.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) return;

    try {
      await addExpense({
        title,
        amount: parseFloat(amount),
        paymentMethod,
        date: new Date().toISOString(),
        notes,
        categoryId: selectedCategoryId,
        category: selectedCategory?.name || selectedCategoryId,
        userId: activeUserId,
      });
      await fetchExpenses(activeUserId);

      setDate(new Date().toISOString().split('T')[0]);
      setTitle('');
      setSelectedCategoryId(getDefaultCategoryId(categoryOptions));
      setPaymentMethod('Bank Transfer');
      setAmount('');
      setNotes('');
      setShowCategoryDropdown(false);
      setShowPaymentDropdown(false);
      onClose();
    } catch (error) {
      console.error('Failed to submit Add Expense form:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <div>
                  <h2 className="text-lg font-bold text-white">Add New Expense</h2>
                  <p className="text-sm text-muted-foreground">Record a new transaction</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white focus:border-violet/50 focus:ring-violet/20 h-11 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Vendor */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Vendor / Payee</label>
                  <Input
                    type="text"
                    placeholder="e.g. Jumia Office Supplies"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-11"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Category</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowPaymentDropdown(false); }}
                      className="w-full flex items-center justify-between h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 transition-colors"
                    >
                      <span>{selectedCategoryLabel}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-10 top-full mt-1 w-full glass-strong rounded-lg overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
                        >
                          {categoryOptions.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => { setSelectedCategoryId(cat.id); setShowCategoryDropdown(false); }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                                cat.id === selectedCategoryId ? 'text-violet bg-violet/10' : 'text-white'
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Payment Method Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Payment Method</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setShowPaymentDropdown(!showPaymentDropdown); setShowCategoryDropdown(false); }}
                      className="w-full flex items-center justify-between h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 transition-colors"
                    >
                      <span>{paymentMethod}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {showPaymentDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-10 top-full mt-1 w-full glass-strong rounded-lg overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
                        >
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => { setPaymentMethod(method); setShowPaymentDropdown(false); }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                                method === paymentMethod ? 'text-violet bg-violet/10' : 'text-white'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Amount (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₦</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                      step="0.01"
                      className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-11"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">Notes (optional)</label>
                  <Input
                    type="text"
                    placeholder="Brief description of the expense"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-11"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-white/10 text-white hover:bg-white/5 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-violet hover:bg-violet/90 text-white font-semibold glow-violet transition-all duration-300 h-11"
                  >
                    Add Expense
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
