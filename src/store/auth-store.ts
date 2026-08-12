import { create } from 'zustand';

export type AppView = 'landing' | 'auth' | 'dashboard';

interface User {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  avatarInitials: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentView: AppView;
  authMode: 'login' | 'register';

  login: (email: string, password: string) => void;
  register: (fullName: string, businessName: string, email: string, password: string) => void;
  logout: () => void;
  setView: (view: AppView) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  currentView: 'landing',
  authMode: 'login',

  login: (email: string, _password: string) => {
    set({
      isAuthenticated: true,
      user: {
        id: 'usr_001',
        fullName: 'Adebayo Okonkwo',
        email: email,
        businessName: 'Ace Ventures Ltd',
        avatarInitials: 'AO',
      },
      currentView: 'dashboard',
    });
  },

  register: (fullName: string, businessName: string, email: string, _password: string) => {
    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    set({
      isAuthenticated: true,
      user: {
        id: 'usr_002',
        fullName,
        email,
        businessName,
        avatarInitials: initials,
      },
      currentView: 'dashboard',
    });
  },

  logout: () => {
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
