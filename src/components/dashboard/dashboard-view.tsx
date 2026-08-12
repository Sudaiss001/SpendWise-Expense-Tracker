'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from './top-bar';
import MetricCards from './metric-cards';
import DashboardCharts from './dashboard-charts';
import ExpenseTable from './expense-table';
import AddExpenseModal from './add-expense-modal';
import { useAuthStore } from '@/store/auth-store';
import { useExpenseStore } from '@/store/expense-store';

export default function DashboardView() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    async function init() {
      let activeUser = user;
      if (!activeUser) {
        activeUser = await checkAuth();
      }
      if (activeUser?.id) {
        fetchExpenses(activeUser.id);
      }
    }
    init();
  }, [user, checkAuth, fetchExpenses]);

  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      <TopBar onAddExpense={() => setIsAddExpenseOpen(true)} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Expense Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your business spending
          </p>
        </motion.div>

        <MetricCards />
        <DashboardCharts />
        <ExpenseTable />
      </main>

      {/* Footer */}
      <footer className="glass-subtle mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 SpendWise — SME Expense Tracker for Nigerian Businesses
          </p>
        </div>
      </footer>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
    </div>
  );
}