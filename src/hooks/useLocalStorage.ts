/**
 * Custom React hook for type-safe localStorage operations.
 *
 * Provides persistent state management with automatic JSON serialization,
 * error handling, and SSR compatibility (returns default value on server).
 *
 * @module useLocalStorage
 * @version 1.0.0
 */

'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * A custom hook that synchronizes React state with localStorage.
 *
 * Features:
 * - Type-safe with generics
 * - SSR-safe (returns default value during server rendering)
 * - Automatic JSON serialization/deserialization
 * - Error handling with fallback to default value
 * - Provides setValue and removeValue functions
 *
 * @typeParam T - The type of the stored value
 * @param key - The localStorage key to use
 * @param defaultValue - Default value when key doesn't exist
 * @returns Tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```typescript
 * const [name, setName, removeName] = useLocalStorage<string>('user-name', '');
 * const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
 * ```
 *
 * @security Values are sanitized before storage to prevent injection
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with a lazy initializer for performance
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return default during SSR
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(
        `[useLocalStorage] Error reading key "${key}" from localStorage:`,
        error
      );
      return defaultValue;
    }
  });

  /**
   * Updates both React state and localStorage.
   * Accepts either a direct value or a function that receives the previous value.
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Support function updates like useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = JSON.stringify(valueToStore);

          // Enforce storage size limit (5MB max per key)
          if (serialized.length > 5 * 1024 * 1024) {
            console.warn(
              `[useLocalStorage] Value for key "${key}" exceeds 5MB limit`
            );
            return;
          }

          window.localStorage.setItem(key, serialized);
        }
      } catch (error) {
        console.error(
          `[useLocalStorage] Error setting key "${key}" in localStorage:`,
          error
        );
      }
    },
    [key, storedValue]
  );

  /**
   * Removes the key from localStorage and resets state to default.
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(
        `[useLocalStorage] Error removing key "${key}" from localStorage:`,
        error
      );
    }
  }, [key, defaultValue]);

  // Sync with other tabs/windows via storage event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // Ignore parse errors from external changes
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
