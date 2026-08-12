'use client';

import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import LandingPage from '@/components/landing/landing-page';
import AuthPage from '@/components/auth/auth-page';
import DashboardView from '@/components/dashboard/dashboard-view';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.35,
};

export default function Home() {
  const currentView = useAuthStore((s) => s.currentView);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <LandingPage />
          </motion.div>
        )}

        {currentView === 'auth' && (
          <motion.div
            key="auth"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AuthPage />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <DashboardView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
