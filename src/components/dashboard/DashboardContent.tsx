/**
 * DashboardContent client component with interactive charts and stats.
 *
 * @module DashboardContent
 * @version 1.0.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useCarbonData } from '@/hooks/useCarbonData';
import { formatCarbonValue, getEmissionRating } from '@/lib/carbonCalculations';
import { REFERENCE_FOOTPRINTS } from '@/lib/constants';
import CarbonChart from './CarbonChart';
import StatCard from './StatCard';

/**
 * Dashboard content with charts, stats, comparison bars, and log history.
 *
 * @returns Interactive dashboard content
 */
export default function DashboardContent(): React.JSX.Element {
  const { breakdown, logEntries, totalSavings, deleteLogEntry, actions } = useCarbonData();

  const rating = getEmissionRating(breakdown.total);
  const completedActions = actions.filter((a) => a.completed).length;

  // If no data, show empty state
  if (breakdown.total === 0 && logEntries.length === 0) {
    return (
      <div className="empty-state" id="dashboard-empty" role="status">
        <div className="empty-state__icon" aria-hidden="true">📊</div>
        <h2 className="empty-state__title">No Data Yet</h2>
        <p className="empty-state__text">
          Calculate your carbon footprint first to see your dashboard with personalized data and charts.
        </p>
        <Link
          href="/calculator"
          className="btn btn-primary mt-lg"
          aria-label="Go to the carbon footprint calculator"
          id="dashboard-cta-calculator"
        >
          🧮 Calculate Now
        </Link>
      </div>
    );
  }

  const maxRef = REFERENCE_FOOTPRINTS.us_average;

  return (
    <div id="dashboard-content">
      {/* ─── Key Stats ─── */}
      <section aria-labelledby="stats-heading" id="stats-section">
        <h2 id="stats-heading" className="sr-only">Key Statistics</h2>
        <div className="grid grid-4">
          <StatCard
            title="Total Footprint"
            value={Math.round(breakdown.total)}
            unit="kg CO₂e/yr"
            icon="🌍"
            ariaLabel={`Total carbon footprint: ${formatCarbonValue(breakdown.total)} per year`}
          />
          <StatCard
            title="Rating"
            value={rating.label as unknown as number}
            unit=""
            icon="📊"
            ariaLabel={`Your rating: ${rating.label}. ${rating.description}`}
          />
          <StatCard
            title="Actions Taken"
            value={completedActions}
            unit={`of ${actions.length}`}
            icon="✅"
            ariaLabel={`${completedActions} of ${actions.length} carbon reduction actions completed`}
          />
          <StatCard
            title="Est. Savings"
            value={totalSavings}
            unit="kg CO₂e/yr"
            icon="💰"
            ariaLabel={`Estimated savings from actions: ${formatCarbonValue(totalSavings)} per year`}
          />
        </div>
      </section>

      {/* ─── Breakdown Chart ─── */}
      <section className="card mt-xl" aria-labelledby="breakdown-heading" id="breakdown-section">
        <h2 id="breakdown-heading" style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>
          Emissions Breakdown
        </h2>
        <CarbonChart breakdown={breakdown} size={240} />
      </section>

      {/* ─── Comparison Section ─── */}
      <section className="card mt-xl" aria-labelledby="comparison-heading" id="comparison-section">
        <h2 id="comparison-heading" style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>
          How You Compare
        </h2>

        <div className="comparison-chart" role="list" aria-label="Carbon footprint comparisons">
          {/* Your footprint */}
          <div className="comparison-bar" role="listitem">
            <span className="comparison-bar__label">You</span>
            <div className="comparison-bar__track" role="progressbar" aria-valuenow={breakdown.total} aria-valuemin={0} aria-valuemax={maxRef}>
              <div
                className="comparison-bar__fill"
                style={{
                  width: `${Math.min((breakdown.total / maxRef) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${rating.color}, ${rating.color}dd)`,
                }}
              />
            </div>
            <span className="comparison-bar__value">{formatCarbonValue(breakdown.total)}</span>
          </div>

          {/* Paris Target */}
          <div className="comparison-bar" role="listitem">
            <span className="comparison-bar__label">Paris Target</span>
            <div className="comparison-bar__track" role="progressbar" aria-valuenow={REFERENCE_FOOTPRINTS.paris_target} aria-valuemin={0} aria-valuemax={maxRef}>
              <div
                className="comparison-bar__fill"
                style={{
                  width: `${(REFERENCE_FOOTPRINTS.paris_target / maxRef) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #10b981dd)',
                }}
              />
            </div>
            <span className="comparison-bar__value">{formatCarbonValue(REFERENCE_FOOTPRINTS.paris_target)}</span>
          </div>

          {/* Global Average */}
          <div className="comparison-bar" role="listitem">
            <span className="comparison-bar__label">Global Avg</span>
            <div className="comparison-bar__track" role="progressbar" aria-valuenow={REFERENCE_FOOTPRINTS.global_average} aria-valuemin={0} aria-valuemax={maxRef}>
              <div
                className="comparison-bar__fill"
                style={{
                  width: `${(REFERENCE_FOOTPRINTS.global_average / maxRef) * 100}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #3b82f6dd)',
                }}
              />
            </div>
            <span className="comparison-bar__value">{formatCarbonValue(REFERENCE_FOOTPRINTS.global_average)}</span>
          </div>

          {/* US Average */}
          <div className="comparison-bar" role="listitem">
            <span className="comparison-bar__label">US Average</span>
            <div className="comparison-bar__track" role="progressbar" aria-valuenow={REFERENCE_FOOTPRINTS.us_average} aria-valuemin={0} aria-valuemax={maxRef}>
              <div
                className="comparison-bar__fill"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #ef4444, #ef4444dd)',
                }}
              />
            </div>
            <span className="comparison-bar__value">{formatCarbonValue(REFERENCE_FOOTPRINTS.us_average)}</span>
          </div>
        </div>
      </section>

      {/* ─── Log History ─── */}
      {logEntries.length > 0 && (
        <section className="card mt-xl" aria-labelledby="log-heading" id="log-section">
          <h2 id="log-heading" style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>
            Tracking History
          </h2>

          <div role="list" aria-label="Carbon footprint log entries">
            {logEntries.slice(0, 10).map((entry) => (
              <div className="log-entry" key={entry.id} role="listitem">
                <div>
                  <span className="log-entry__date">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {entry.notes && (
                    <span style={{ marginLeft: '8px', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                      — {entry.notes}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-md">
                  <span className="log-entry__total">
                    {formatCarbonValue(entry.breakdown.total)}
                  </span>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteLogEntry(entry.id)}
                    aria-label={`Delete log entry from ${new Date(entry.date).toLocaleDateString()}`}
                    id={`delete-log-${entry.id}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
