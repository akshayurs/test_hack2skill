/**
 * ActionsContent client component with interactive action list.
 *
 * @module ActionsContent
 * @version 1.0.0
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useCarbonData } from '@/hooks/useCarbonData';
import { formatCarbonValue } from '@/lib/carbonCalculations';
import ActionCard from './ActionCard';

/**
 * Category filter options.
 */
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'transport', label: '🚗 Transport' },
  { value: 'energy', label: '⚡ Energy' },
  { value: 'diet', label: '🥗 Diet' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'lifestyle', label: '🌳 Lifestyle' },
] as const;

/**
 * Renders the list of carbon reduction actions with filtering and summary.
 *
 * @returns Interactive actions content
 */
export default function ActionsContent(): React.JSX.Element {
  const { actions, toggleAction, totalSavings } = useCarbonData();
  const [filter, setFilter] = useState<string>('all');

  const completedCount = useMemo(
    () => actions.filter((a) => a.completed).length,
    [actions]
  );

  const filteredActions = useMemo(
    () =>
      filter === 'all'
        ? actions
        : actions.filter((a) => a.category === filter),
    [actions, filter]
  );

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  }, []);

  return (
    <div id="actions-content">
      {/* ─── Summary Stats ─── */}
      <section className="grid grid-3 mb-lg" aria-label="Actions summary" id="actions-summary">
        <article className="card stat-card" id="actions-completed-stat">
          <span className="stat-card__icon" aria-hidden="true">✅</span>
          <span className="stat-card__label">Actions Taken</span>
          <span className="stat-card__value">
            {completedCount}
            <span className="stat-card__unit"> of {actions.length}</span>
          </span>
        </article>

        <article className="card stat-card" id="actions-savings-stat">
          <span className="stat-card__icon" aria-hidden="true">💰</span>
          <span className="stat-card__label">Est. Annual Savings</span>
          <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
            {formatCarbonValue(totalSavings)}
          </span>
        </article>

        <article className="card stat-card" id="actions-progress-stat">
          <span className="stat-card__icon" aria-hidden="true">📈</span>
          <span className="stat-card__label">Progress</span>
          <span className="stat-card__value">
            {actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0}
            <span className="stat-card__unit">%</span>
          </span>
          <div className="progress-bar mt-sm" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={actions.length} aria-label="Actions completion progress">
            <div
              className="progress-bar__fill"
              style={{
                width: `${actions.length > 0 ? (completedCount / actions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </article>
      </section>

      {/* ─── Filter ─── */}
      <div className="flex justify-between items-center mb-lg" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="action-filter">
            Filter by Category
          </label>
          <select
            className="form-select"
            id="action-filter"
            value={filter}
            onChange={handleFilterChange}
            aria-label="Filter actions by category"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Showing {filteredActions.length} actions
        </p>
      </div>

      {/* ─── Action Cards ─── */}
      <div
        className="grid"
        style={{ gap: 'var(--space-md)' }}
        role="list"
        aria-label="Carbon reduction actions list"
        id="actions-list"
      >
        {filteredActions.map((action, index) => (
          <div
            key={action.id}
            role="listitem"
            className={`animate-fade-in stagger-${Math.min(index + 1, 4)}`}
          >
            <ActionCard action={action} onToggle={toggleAction} />
          </div>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <div className="empty-state" role="status">
          <div className="empty-state__icon" aria-hidden="true">🔍</div>
          <h2 className="empty-state__title">No Actions Found</h2>
          <p className="empty-state__text">
            No actions match the selected category filter.
          </p>
        </div>
      )}
    </div>
  );
}
