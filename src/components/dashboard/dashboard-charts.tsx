'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useExpenseStore } from '@/store/expense-store';

function formatNairaShort(amount: number): string {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
  return `₦${amount}`;
}

function formatNairaFull(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Custom tooltip for bar chart
function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white text-sm font-semibold mb-1">{label}</p>
        <p className="text-emerald text-sm font-bold">{formatNairaFull(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

// Custom tooltip for pie chart
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { category: string; total: number; color: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-strong rounded-lg px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-white text-sm font-semibold">{data.category}</p>
        </div>
        <p className="text-sm font-bold" style={{ color: data.color }}>{formatNairaFull(data.total)}</p>
      </div>
    );
  }
  return null;
}

// Custom legend
function CustomLegend({ payload }: { payload?: Array<{ color: string; value: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground truncate max-w-[80px]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardCharts() {
  const getMonthlyTrends = useExpenseStore((s) => s.getMonthlyTrends);
  const getCategoryBreakdown = useExpenseStore((s) => s.getCategoryBreakdown);

  const monthlyTrends = getMonthlyTrends();
  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Bar Chart - Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="lg:col-span-3 glass rounded-xl p-5"
      >
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Monthly Expense Trends</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Spending overview over time</p>
        </div>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNairaShort}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="total"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
                animationBegin={200}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart - Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="lg:col-span-2 glass rounded-xl p-5"
      >
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Category Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Spending by category</p>
        </div>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="total"
                animationDuration={800}
                animationBegin={400}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
