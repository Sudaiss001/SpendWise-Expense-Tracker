'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-slate-deep to-emerald-600/20" />
        <div className="absolute top-20 left-20 w-80 h-80 bg-violet/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div>
            <Link href="/">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center mb-8 pulse-glow">
              <Banknote className="w-8 h-8 text-white" />
            </div>
            <blockquote className="text-2xl xl:text-3xl font-light text-white leading-relaxed mb-4 italic">
              &ldquo;Do not save what is left after spending, but spend what is left after saving.&rdquo;
            </blockquote>
            <p className="text-white/50 text-sm">— Warren Buffett</p>

            <div className="flex gap-4 mt-12">
              <div className="glass rounded-xl px-4 py-3 float-animation">
                <p className="text-emerald text-2xl font-bold">₦2.4B</p>
                <p className="text-white/50 text-xs mt-1">Tracked by SMEs</p>
              </div>
              <div className="glass rounded-xl px-4 py-3 float-animation" style={{ animationDelay: '2s' }}>
                <p className="text-violet text-2xl font-bold">2,500+</p>
                <p className="text-white/50 text-xs mt-1">Active Businesses</p>
              </div>
            </div>
          </div>

          <p className="text-white/30 text-xs">
            &copy; 2026 SpendWise. Built for Nigerian businesses.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SpendWise</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-violet/50 focus:ring-violet/20 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <Link
                href="/signup"
                className="text-violet hover:text-violet/80 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
