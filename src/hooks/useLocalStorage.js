'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  // Use ref to track if component is mounted
  const isMounted = useRef(false);
  
  // Initialize with a function to avoid SSR issues
  const [storedValue, setStoredValue] = useState(() => {
    // Return initial value for SSR
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with localStorage on mount and handle hydration
  useEffect(() => {
    isMounted.current = true;
    
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    
    setIsLoaded(true);

    return () => {
      isMounted.current = false;
    };
  }, [key]);

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') return;

    try {
      setStoredValue((prevValue) => {
        const newValue = value instanceof Function ? value(prevValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isLoaded];
}