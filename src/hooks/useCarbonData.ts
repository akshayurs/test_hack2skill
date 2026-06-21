/**
 * Custom React hook for managing carbon footprint data and calculations.
 *
 * Provides a comprehensive interface for calculating, tracking, and
 * analyzing carbon footprint data with automatic persistence.
 *
 * @module useCarbonData
 * @version 1.0.0
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type {
  CarbonFootprintInput,
  CarbonBreakdown,
  CarbonLogEntry,
  CarbonAction,
  Insight,
} from '@/types';
import {
  calculateCarbonFootprint,
  generateInsights,
  calculatePercentages,
} from '@/lib/carbonCalculations';
import { CARBON_ACTIONS, MAX_LOG_ENTRIES } from '@/lib/constants';
import { generateSecureId } from '@/lib/sanitize';

/**
 * Default carbon footprint input values for new users.
 */
const DEFAULT_INPUT: CarbonFootprintInput = {
  transport: [{ mode: 'car', distanceKm: 0, frequencyPerWeek: 0 }],
  energy: {
    electricityKwh: 0,
    naturalGasTherms: 0,
    usesRenewable: false,
    renewablePercentage: 0,
  },
  diet: {
    dietType: 'average',
    localFoodPercentage: 0,
    reducesFoodWaste: false,
  },
  shopping: {
    clothingSpendMonthly: 0,
    electronicsSpendMonthly: 0,
    buysSecondHand: false,
    recycles: false,
  },
};

/**
 * Return type for the useCarbonData hook.
 */
interface UseCarbonDataReturn {
  /** Current input data */
  input: CarbonFootprintInput;
  /** Update input data */
  setInput: (input: CarbonFootprintInput) => void;
  /** Calculated breakdown of emissions */
  breakdown: CarbonBreakdown;
  /** Percentage breakdown by category */
  percentages: Record<string, number>;
  /** Personalized insights based on current data */
  insights: Insight[];
  /** Historical log entries */
  logEntries: CarbonLogEntry[];
  /** Add a breakdown to the log. Defaults to the hook's current breakdown when none is provided. */
  saveToLog: (notes?: string, breakdownOverride?: CarbonBreakdown) => void;
  /** Remove a log entry by ID */
  deleteLogEntry: (id: string) => void;
  /** Available carbon reduction actions */
  actions: CarbonAction[];
  /** Toggle action completion status */
  toggleAction: (actionId: string) => void;
  /** Total potential savings from completed actions */
  totalSavings: number;
  /** Reset all data to defaults */
  resetAll: () => void;
}

/**
 * Hook for managing all carbon footprint data, calculations, and persistence.
 *
 * @returns Object containing data, calculations, and mutation functions
 *
 * @example
 * ```typescript
 * const { input, setInput, breakdown, insights, saveToLog } = useCarbonData();
 * ```
 */
export function useCarbonData(): UseCarbonDataReturn {
  // Persistent state
  const [input, setInput] = useLocalStorage<CarbonFootprintInput>(
    'carbonwise-input',
    DEFAULT_INPUT
  );
  const [logEntries, setLogEntries] = useLocalStorage<CarbonLogEntry[]>(
    'carbonwise-log',
    []
  );
  const [actions, setActions] = useLocalStorage<CarbonAction[]>(
    'carbonwise-actions',
    [...CARBON_ACTIONS]
  );

  // Derived calculations (memoized for performance)
  const breakdown = useMemo(() => calculateCarbonFootprint(input), [input]);
  const percentages = useMemo(() => calculatePercentages(breakdown), [breakdown]);
  const insights = useMemo(() => generateInsights(breakdown), [breakdown]);

  // Total savings from completed actions
  const totalSavings = useMemo(
    () =>
      actions
        .filter((action) => action.completed)
        .reduce((sum, action) => sum + action.estimatedSavingsKgPerYear, 0),
    [actions]
  );

  /**
   * Saves a breakdown to the log with a timestamp.
   * Callers with their own working state (e.g. the calculator) may pass an
   * explicit breakdown; otherwise the hook's current breakdown is used.
   * Enforces the maximum log entry limit to prevent storage overflow.
   */
  const saveToLog = useCallback(
    (notes?: string, breakdownOverride?: CarbonBreakdown) => {
      const newEntry: CarbonLogEntry = {
        id: generateSecureId(),
        date: new Date().toISOString(),
        breakdown: { ...(breakdownOverride ?? breakdown) },
        notes,
      };

      setLogEntries((prev) => {
        const updated = [newEntry, ...prev];
        // Enforce maximum entries to prevent storage overflow
        return updated.slice(0, MAX_LOG_ENTRIES);
      });
    },
    [breakdown, setLogEntries]
  );

  /**
   * Removes a log entry by its unique ID.
   */
  const deleteLogEntry = useCallback(
    (id: string) => {
      setLogEntries((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setLogEntries]
  );

  /**
   * Toggles the completion status of a carbon reduction action.
   */
  const toggleAction = useCallback(
    (actionId: string) => {
      setActions((prev) =>
        prev.map((action) =>
          action.id === actionId
            ? { ...action, completed: !action.completed }
            : action
        )
      );
    },
    [setActions]
  );

  /**
   * Resets all stored data to default values.
   */
  const resetAll = useCallback(() => {
    setInput(DEFAULT_INPUT);
    setLogEntries([]);
    setActions([...CARBON_ACTIONS]);
  }, [setInput, setLogEntries, setActions]);

  return {
    input,
    setInput,
    breakdown,
    percentages,
    insights,
    logEntries,
    saveToLog,
    deleteLogEntry,
    actions,
    toggleAction,
    totalSavings,
    resetAll,
  };
}
