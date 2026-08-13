import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (token && storedUser && storedUser !== 'undefined') {
    try {
      return {
        user: JSON.parse(storedUser) as User,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Failed to parse user session tokens:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initialAuth.isAuthenticated,
  user: initialAuth.user,
  loading: false,

  login: (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({
      user: userData,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.clear();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const authData = getStoredAuth();
    set({
      user: authData.user,
      isAuthenticated: authData.isAuthenticated,
      loading: false,
    });
  },
}));