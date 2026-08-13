'use client';

import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  TrendingDown,
  BarChart3,
  Tags,
  Shield,
  Zap,
} from 'lucide-react';
import { NairaIcon } from '@/components/naira-icon';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import Contact from './contact';

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: smoothEase },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: TrendingDown,
    title: 'Smart Expense Tracking',
    description:
      'Automatically categorize and track every Naira flowing through your business. Get real-time visibility into spending patterns.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Visual Financial Reports',
    description:
      'Beautiful charts and dashboards that make financial data easy to understand. Spot trends and optimize your cash flow.',
    gradient: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
  },
  {
    icon: Tags,
    title: 'Multi-Category Tagging',
    description:
      'Organize expenses by vendor, category, and payment method. Filter and search instantly to find any transaction.',
    gradient: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: NairaIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    title: 'Built for Naira (₦)',
    description:
      'Designed specifically for Nigerian SMEs. Full Naira support with local payment methods like POS, Mobile Money, and Bank Transfer.',
    gradient: 'from-crimson-500/20 to-crimson-500/5',
    iconColor: 'text-crimson-400',
  },
];

const trustBadges = [
  { label: '2,500+ SMEs', icon: '🏢' },
  { label: '₦2.4B Tracked', icon: '💰' },
  { label: '99.9% Uptime', icon: '⚡' },
  { label: 'Bank-Grade Security', icon: '🔒' },
];

export default function LandingPage() {
  const { setView, setAuthMode } = useAuthStore();

  const handleGetStarted = () => {
    setAuthMode('register');
  };

  const handleLogin = () => {
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="glass-subtle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
                <NairaIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SpendWise
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white hover:bg-white/5"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                className="bg-violet hover:bg-violet/90 text-white font-semibold glow-violet transition-all duration-300"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Trust badges */}
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8"
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
                >
                  <span>{badge.icon}</span>
                  <span className="text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Take Control of Your{' '}
              <span className="gradient-text">SME Finances</span>{' '}
              in Naira
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The smart expense tracker built for Nigerian businesses. Track every Naira,
              visualize spending patterns, and make data-driven financial decisions — all in
              one beautiful dashboard.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-violet hover:bg-violet/90 text-white font-bold text-base px-8 py-6 glow-violet transition-all duration-300 hover:scale-105"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 text-white hover:bg-white/5 hover:border-white/25 text-base px-8 py-6"
                onClick={handleLogin}
              >
                Login to Dashboard
              </Button>
            </motion.div>

            {/* Security badge */}
            <motion.div
              variants={fadeInUp}
              custom={4}
              className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Bank-grade encryption • No credit card required</span>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="glass-strong rounded-2xl p-1 glow-violet">
              <div className="rounded-xl bg-slate-deep overflow-hidden">
                {/* Mock top bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-crimson/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald/80" />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium hidden sm:block">
                      dashboard.spendwise.ng
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet/30 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-violet-400" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                      AO
                    </div>
                  </div>
                </div>

                {/* Mock dashboard content */}
                <div className="p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Total Spent', value: '₦3.2M', change: '+12%', color: 'text-crimson' },
                    { label: 'Budget Limit', value: '₦5.0M', change: '64% used', color: 'text-amber-400' },
                    { label: 'Top Category', value: 'Rent', change: '₦2.5M', color: 'text-violet-400' },
                    { label: 'Transactions', value: '48', change: 'This month', color: 'text-emerald' },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="glass rounded-xl p-3 sm:p-4 hover:border-white/15 transition-all duration-300"
                    >
                      <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-lg sm:text-xl font-bold text-white">{card.value}</p>
                      <p className={`text-xs mt-1 ${card.color}`}>{card.change}</p>
                    </div>
                  ))}
                </div>

                {/* Mock chart area */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="glass rounded-xl p-4 sm:p-6">
                    <div className="flex items-end gap-2 sm:gap-3 h-24 sm:h-32">
                      {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                          className={`flex-1 rounded-t-sm ${
                            i === 11
                              ? 'bg-gradient-to-t from-violet-600 to-violet-400'
                              : 'bg-gradient-to-t from-white/10 to-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] sm:text-xs text-muted-foreground">Jan</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">Jun</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">Aug</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-surface to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Manage Expenses</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for the unique needs of Nigerian small and medium businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group glass rounded-2xl p-6 hover:border-white/15 transition-all duration-500 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet/10 via-transparent to-emerald/10" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Ready to Master Your{' '}
              <span className="gradient-text">Business Finances</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of Nigerian SMEs already saving time and money with SpendWise.
            </p>
            <Button
              size="lg"
              className="bg-violet hover:bg-violet/90 text-white font-bold text-lg px-10 py-7 glow-violet transition-all duration-300 hover:scale-105"
              onClick={handleGetStarted}
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Contact />

      {/* Footer */}
      <footer className="glass-subtle mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
                <NairaIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">SpendWise</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 SpendWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
