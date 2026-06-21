/**
 * Unit tests for the useCarbonData hook.
 */

import { act, renderHook } from '@testing-library/react';
import { useCarbonData } from '@/hooks/useCarbonData';
import type { CarbonBreakdown, CarbonFootprintInput } from '@/types';

const POPULATED_INPUT: CarbonFootprintInput = {
  transport: [{ mode: 'car', distanceKm: 20, frequencyPerWeek: 5 }],
  energy: { electricityKwh: 900, naturalGasTherms: 50, usesRenewable: false, renewablePercentage: 0 },
  diet: { dietType: 'average', localFoodPercentage: 20, reducesFoodWaste: false },
  shopping: { clothingSpendMonthly: 100, electronicsSpendMonthly: 50, buysSecondHand: false, recycles: true },
};

describe('useCarbonData', () => {
  beforeEach(() => window.localStorage.clear());

  it('starts with the default-diet baseline, seeded actions, and an empty log', () => {
    const { result } = renderHook(() => useCarbonData());
    // Default input has an "average" diet (2500 kg) and zero everything else.
    expect(result.current.breakdown.total).toBe(2500);
    expect(result.current.actions.length).toBeGreaterThan(0);
    expect(result.current.logEntries).toEqual([]);
  });

  it('recomputes the breakdown when input changes', () => {
    const { result } = renderHook(() => useCarbonData());
    act(() => result.current.setInput(POPULATED_INPUT));
    expect(result.current.breakdown.total).toBeGreaterThan(0);
    expect(result.current.insights.length).toBeGreaterThan(0);
  });

  it('saves the current breakdown to the log', () => {
    const { result } = renderHook(() => useCarbonData());
    act(() => result.current.setInput(POPULATED_INPUT));
    act(() => result.current.saveToLog('note'));
    expect(result.current.logEntries).toHaveLength(1);
    expect(result.current.logEntries[0].notes).toBe('note');
    expect(result.current.logEntries[0].breakdown.total).toBeGreaterThan(0);
  });

  it('honors an explicit breakdown override when saving', () => {
    const override: CarbonBreakdown = {
      transport: 1, energy: 2, diet: 3, shopping: 4, total: 10,
    };
    const { result } = renderHook(() => useCarbonData());
    act(() => result.current.saveToLog('override', override));
    expect(result.current.logEntries[0].breakdown).toEqual(override);
  });

  it('deletes a log entry by id', () => {
    const { result } = renderHook(() => useCarbonData());
    act(() => result.current.saveToLog());
    const id = result.current.logEntries[0].id;
    act(() => result.current.deleteLogEntry(id));
    expect(result.current.logEntries).toHaveLength(0);
  });

  it('toggles an action and accumulates savings', () => {
    const { result } = renderHook(() => useCarbonData());
    const target = result.current.actions[0];
    act(() => result.current.toggleAction(target.id));
    expect(result.current.actions.find((a) => a.id === target.id)?.completed).toBe(true);
    expect(result.current.totalSavings).toBe(target.estimatedSavingsKgPerYear);
  });

  it('resets all data back to defaults', () => {
    const { result } = renderHook(() => useCarbonData());
    act(() => result.current.setInput(POPULATED_INPUT));
    act(() => result.current.saveToLog());
    act(() => result.current.toggleAction(result.current.actions[0].id));
    act(() => result.current.resetAll());
    expect(result.current.breakdown.total).toBe(2500);
    expect(result.current.logEntries).toHaveLength(0);
    expect(result.current.totalSavings).toBe(0);
  });
});
