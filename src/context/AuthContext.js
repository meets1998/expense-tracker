'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

const STORAGE_KEY = 'expensewise_auth';

const initialAuthState = {
  isAuthenticated: false,
  user: null,
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState(initialAuthState);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('🔐 Loading auth from storage');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isAuthenticated && parsed.user) {
          console.log('✅ User found:', parsed.user.name);
          setAuthState(parsed);
        }
      }
    } catch (error) {
      console.error('❌ Error loading auth:', error);
    }
    
    setIsLoading(false);
    setIsReady(true);
  }, []);

  // Save to localStorage whenever authState changes
  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
      console.log('💾 Auth saved to storage');
    } catch (error) {
      console.error('❌ Error saving auth:', error);
    }
  }, [authState, isReady]);

  // Login function
  const login = useCallback((userData) => {
    console.log('🔑 Logging in:', userData.email);
    
    const newAuthState = {
      isAuthenticated: true,
      user: {
        id: userData.id || Date.now().toString(),
        email: userData.email,
        name: userData.name,
        avatarId: userData.avatarId || 'avatar1',
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    setAuthState(newAuthState);
    
    // Save immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthState));
    }
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    console.log('🚪 Logging out');
    
    setAuthState(initialAuthState);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    router.push('/login');
  }, [router]);

  // Update user function
  const updateUser = useCallback((updates) => {
    console.log('✏️ Updating user:', updates);
    
    setAuthState(prev => {
      if (!prev || !prev.user) {
        console.error('❌ No user to update');
        return prev;
      }
      
      const newState = {
        ...prev,
        user: {
          ...prev.user,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      };
      
      console.log('✅ Updated user:', newState.user);
      
      // Save immediately to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        console.log('💾 Updated auth saved');
      }
      
      return newState;
    });
  }, []);

  // Refresh user from storage
  const refreshUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
        console.log('🔄 User refreshed from storage');
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  }, []);

  const value = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading,
    isReady,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};