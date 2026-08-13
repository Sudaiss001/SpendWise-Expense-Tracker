'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building2, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/auth-store';

const quotes = [
  {
    text: "The secret to getting ahead is getting started. Your financial journey begins with a single step.",
    author: 'Mark Twain',
  },
  {
    text: "Do not save what is left after spending, but spend what is left after saving.",
    author: 'Warren Buffett',
  },
  {
    text: "A budget is telling your money where to go instead of wondering where it went.",
    author: 'Dave Ramsey',
  },
];

export default function AuthPage() {
  const { authMode, setAuthMode, setView, login, register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regBusiness, setRegBusiness] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(loginEmail || 'admin@aceventures.ng', loginPassword || 'password123');
      setIsLoading(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      register(
        regName || 'Adebayo Okonkwo',
        regBusiness || 'Ace Ventures Ltd',
        regEmail || 'admin@aceventures.ng',
        regPassword || 'password123'
      );
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration / Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-slate-deep to-emerald-600/20" />
        <div className="absolute top-20 left-20 w-80 h-80 bg-violet/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setView('landing')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="max-w-md">
            <motion.div
              key={randomQuote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center mb-8 pulse-glow">
                <Banknote className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl xl:text-3xl font-light text-white leading-relaxed mb-4 italic">
                &ldquo;{randomQuote.text}&rdquo;
              </blockquote>
              <p className="text-white/50 text-sm">— {randomQuote.author}</p>
            </motion.div>

            {/* Floating stat badges */}
            <div className="flex gap-4 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass rounded-xl px-4 py-3 float-animation"
              >
                <p className="text-emerald text-2xl font-bold">₦2.4B</p>
                <p className="text-white/50 text-xs mt-1">Tracked by SMEs</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass rounded-xl px-4 py-3 float-animation"
                style={{ animationDelay: '2s' }}
              >
                <p className="text-violet text-2xl font-bold">2,500+</p>
                <p className="text-white/50 text-xs mt-1">Active Businesses</p>
              </motion.div>
            </div>
          </div>

          <p className="text-white/30 text-xs">
            &copy; 2026 SpendWise. Built for Nigerian businesses.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile back button */}
          <div className="lg:hidden mb-6">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={() => setView('landing')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SpendWise</span>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground">
                    Sign in to access your expense dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-muted-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="admin@aceventures.ng"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-muted-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-violet data-[state=checked]:border-violet"
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-violet hover:bg-violet/90 text-white font-semibold h-12 glow-violet transition-all duration-300 hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <p className="text-center text-muted-foreground text-sm mt-8">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-violet hover:text-violet/80 font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Create your account
                  </h1>
                  <p className="text-muted-foreground">
                    Start tracking your SME expenses in Naira
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-muted-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Adebayo Okonkwo"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-business" className="text-muted-foreground">
                      Business Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-business"
                        type="text"
                        placeholder="Ace Ventures Ltd"
                        value={regBusiness}
                        onChange={(e) => setRegBusiness(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-muted-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="admin@aceventures.ng"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-muted-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-violet hover:bg-violet/90 text-white font-semibold h-12 glow-violet transition-all duration-300 hover:scale-[1.02] mt-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <p className="text-center text-muted-foreground text-sm mt-8">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-violet hover:text-violet/80 font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
