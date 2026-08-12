import { create } from 'zustand';

export type AppView = 'landing' | 'auth' | 'dashboard';

export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  businessName: string;
  avatarInitials: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentView: AppView;
  authMode: 'login' | 'register';
  isLoading: boolean;

  checkAuth: () => Promise<User | null>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, businessName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setView: (view: AppView) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
}

function getInitials(name: string): string {
  if (!name) return 'SW';
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  currentView: 'landing',
  authMode: 'login',
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return null;
      }

      const data = await res.json();
      if (data.user) {
        const fullName = data.user.name || data.user.email.split('@')[0];
        const userObj: User = {
          id: data.user.id,
          fullName,
          name: fullName,
          email: data.user.email,
          businessName: data.user.businessName || 'Business',
          avatarInitials: getInitials(fullName),
        };
        set({ isAuthenticated: true, user: userObj, currentView: 'dashboard', isLoading: false });
        return userObj;
      }
      set({ isAuthenticated: false, user: null, isLoading: false });
      return null;
    } catch {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return null;
    }
  },

  login: async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }

    const fullName = data.user.name || data.user.email.split('@')[0];
    const userObj: User = {
      id: data.user.id,
      fullName,
      name: fullName,
      email: data.user.email,
      businessName: data.user.businessName || 'Business',
      avatarInitials: getInitials(fullName),
    };

    set({
      isAuthenticated: true,
      user: userObj,
      currentView: 'dashboard',
    });
  },

  register: async (name: string, businessName: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, businessName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account');
    }

    const fullName = data.user.name || data.user.email.split('@')[0];
    const userObj: User = {
      id: data.user.id,
      fullName,
      name: fullName,
      email: data.user.email,
      businessName: data.user.businessName || 'Business',
      avatarInitials: getInitials(fullName),
    };

    set({
      isAuthenticated: true,
      user: userObj,
      currentView: 'dashboard',
    });
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    set({
      isAuthenticated: false,
      user: null,
      currentView: 'landing',
      authMode: 'login',
    });
  },

  setView: (view: AppView) => {
    set({ currentView: view });
  },

  setAuthMode: (mode: 'login' | 'register') => {
    set({ authMode: mode, currentView: 'auth' });
  },
}));
