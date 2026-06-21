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

  // Reference points the user is compared against, rendered as a list of bars.
  const comparisons = [
    { key: 'you', label: 'You', value: breakdown.total, color: rating.color },
    { key: 'paris', label: 'Paris Target', value: REFERENCE_FOOTPRINTS.paris_target, color: '#10b981' },
    { key: 'global', label: 'Global Avg', value: REFERENCE_FOOTPRINTS.global_average, color: '#3b82f6' },
    { key: 'us', label: 'US Average', value: REFERENCE_FOOTPRINTS.us_average, color: '#ef4444' },
  ];

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
            value={rating.label}
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
          {comparisons.map(({ key, label, value, color }) => (
            <div className="comparison-bar" role="listitem" key={key}>
              <span className="comparison-bar__label">{label}</span>
              <div
                className="comparison-bar__track"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={maxRef}
                aria-label={`${label}: ${formatCarbonValue(value)} per year`}
              >
                <div
                  className="comparison-bar__fill"
                  style={{
                    width: `${Math.min((value / maxRef) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                  }}
                />
              </div>
              <span className="comparison-bar__value">{formatCarbonValue(value)}</span>
            </div>
          ))}
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
