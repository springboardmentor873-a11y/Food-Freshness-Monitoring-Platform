import { create } from 'zustand';
import { USER_ROLES } from '../constants/mockData';

export const useAuthStore = create((set) => ({
  user: {
    id: 'usr-901',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@freshness.ai',
    role: USER_ROLES.ADMINISTRATOR,
    company: 'FreshGuard SaaS Corp',
    phone: '+1 (555) 389-2041',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    permissions: ['all'],
  },
  token: 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  isAuthenticated: true,

  setRole: (newRole) =>
    set((state) => ({
      user: { ...state.user, role: newRole },
    })),

  login: (email, password, role = USER_ROLES.ADMINISTRATOR) => {
    set({
      isAuthenticated: true,
      user: {
        id: 'usr-' + Math.floor(Math.random() * 1000),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: role,
        company: 'AgriTech Enterprise',
        phone: '+1 (555) 019-2831',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
      token: 'mock-jwt-token-active',
    });
  },

  logout: () => set({ isAuthenticated: false, user: null, token: null }),
  
  updateProfile: (updatedData) =>
    set((state) => ({
      user: { ...state.user, ...updatedData },
    })),
}));
