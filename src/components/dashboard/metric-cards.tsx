'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  PiggyBank,
  Tag,
  FileText,
  Pencil,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExpenseStore } from '@/store/expense-store';

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function EditBudgetModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const monthlyBudget = useExpenseStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useExpenseStore((s) => s.setMonthlyBudget);
  const [value, setValue] = useState(monthlyBudget.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value.replace(/[^0-9]/g, ''));
    if (num > 0) {
      setMonthlyBudget(num);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="glass-strong rounded-2xl w-full max-w-sm">
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <h2 className="text-lg font-bold text-white">Edit Monthly Budget</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-white hover:bg-white/5">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">
                    New Budget Limit (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₦</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                      min="1"
                      placeholder="5000000"
                      className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-emerald/50 focus:ring-emerald/20 h-12 text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {value && parseFloat(value.replace(/[^0-9]/g, '')) > 0
                      ? `= ${formatNaira(parseFloat(value.replace(/[^0-9]/g, '')))}`
                      : 'Enter a valid amount'}
                  </p>
                </div>
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
                    className="flex-1 bg-emerald hover:bg-emerald/90 text-white font-semibold h-11"
                  >
                    Update Budget
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function MetricCards() {
  const {
    getTotalSpentThisMonth,
    getTopCategory,
    monthlyBudget,
    expenses,
  } = useExpenseStore();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const totalSpent =
    typeof getTotalSpentThisMonth === 'function' ? getTotalSpentThisMonth() : 0;
  const topCategory =
    typeof getTopCategory === 'function' ? getTopCategory() : '';
  const safeMonthlyBudget =
    Number.isFinite(monthlyBudget) && monthlyBudget > 0 ? monthlyBudget : 0;
  const budgetPercentage =
    safeMonthlyBudget > 0 ? Math.round((totalSpent / safeMonthlyBudget) * 100) : 0;
  const totalEntries = safeExpenses.length;
  const topCategoryTotal = topCategory
    ? safeExpenses
        .filter((expense) => expense.category === topCategory)
        .reduce((total, expense) => total + expense.amount, 0)
    : 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Spent This Month',
            value: formatNaira(totalSpent),
            change: `Budget: ${budgetPercentage}% used`,
            icon: TrendingDown,
            color: 'text-crimson',
            bgColor: 'from-crimson/15 to-crimson/5',
            borderColor: budgetPercentage > 80 ? 'border-crimson/30' : 'border-white/8',
            glow: budgetPercentage > 80 ? 'glow-crimson' : '',
          },
          {
            label: 'Monthly Budget Limit',
            value: formatNaira(safeMonthlyBudget),
            change: `${formatNaira(Math.max(0, safeMonthlyBudget - totalSpent))} remaining`,
            icon: PiggyBank,
            color: 'text-emerald',
            bgColor: 'from-emerald/15 to-emerald/5',
            borderColor: 'border-white/8',
            glow: '',
            editable: true,
          },
          {
            label: 'Top Category',
            value: topCategory || 'N/A',
            change: topCategory ? formatNaira(topCategoryTotal) : 'No data',
            icon: Tag,
            color: 'text-violet',
            bgColor: 'from-violet/15 to-violet/5',
            borderColor: 'border-white/8',
            glow: '',
          },
          {
            label: 'Total Entries',
            value: totalEntries.toString(),
            change: 'All-time transactions',
            icon: FileText,
            color: 'text-amber-400',
            bgColor: 'from-amber-400/15 to-amber-400/5',
            borderColor: 'border-white/8',
            glow: '',
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`glass rounded-xl p-5 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5 ${card.borderColor} ${card.glow}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bgColor} flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {(card as { editable?: boolean }).editable && (
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald hover:bg-emerald/10 transition-all duration-200 hover:scale-110"
                  title="Edit budget"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs mt-2 ${card.color}`}>{card.change}</p>
          </motion.div>
        ))}
      </div>

      <EditBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </>
  );
}
