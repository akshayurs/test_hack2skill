/**
 * Unit tests for the useLocalStorage hook.
 */

import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('returns the default value when no key is stored', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('reads an existing value from localStorage', () => {
    window.localStorage.setItem('existing', JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => useLocalStorage('existing', { a: 0 }));
    expect(result.current[0]).toEqual({ a: 1 });
  });

  it('persists a direct value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(window.localStorage.getItem('count')).toBe('5');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1));
    act(() => result.current[1]((prev) => prev + 9));
    expect(result.current[0]).toBe(10);
  });

  it('removes a value and resets to the default', () => {
    const { result } = renderHook(() => useLocalStorage('temp', 'default'));
    act(() => result.current[1]('changed'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('default');
    expect(window.localStorage.getItem('temp')).toBeNull();
  });

  it('falls back to the default on malformed JSON', () => {
    window.localStorage.setItem('bad', '{not-json');
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('bad', 'safe'));
    expect(result.current[0]).toBe('safe');
  });

  it('rejects values exceeding the 5MB size limit', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('big', ''));
    const huge = 'x'.repeat(5 * 1024 * 1024 + 1);
    act(() => result.current[1](huge));
    expect(window.localStorage.getItem('big')).toBeNull();
  });

  it('synchronizes state from external storage events', () => {
    const { result } = renderHook(() => useLocalStorage('synced', 'a'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'synced', newValue: JSON.stringify('b') })
      );
    });
    expect(result.current[0]).toBe('b');
  });

  it('ignores storage events for unrelated keys', () => {
    const { result } = renderHook(() => useLocalStorage('mine', 'a'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'other', newValue: JSON.stringify('b') })
      );
    });
    expect(result.current[0]).toBe('a');
  });
});
