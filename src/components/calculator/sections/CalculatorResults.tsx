/**
 * CalculatorResults – live results panel for the carbon calculator.
 *
 * Pure presentation: receives the computed breakdown, rating, and save state.
 *
 * @module CalculatorResults
 * @accessibility Live region with descriptive labels for the total and rating
 */

'use client';

import React from 'react';
import type { CarbonBreakdown } from '@/types';
import { formatCarbonValue, getEmissionRating } from '@/lib/carbonCalculations';
import CarbonChart from '@/components/dashboard/CarbonChart';

interface CalculatorResultsProps {
  readonly breakdown: CarbonBreakdown;
  readonly rating: ReturnType<typeof getEmissionRating>;
  readonly isSaved: boolean;
  readonly onSave: () => void;
}

const CATEGORY_RESULTS = [
  { key: 'transport', label: 'Transport' },
  { key: 'energy', label: 'Energy' },
  { key: 'diet', label: 'Diet' },
  { key: 'shopping', label: 'Shopping' },
] as const;

/**
 * Renders the calculated footprint, rating, breakdown chart, and save action.
 *
 * @param props - Computed results and the save callback
 * @returns The results panel
 */
export default function CalculatorResults({
  breakdown,
  rating,
  isSaved,
  onSave,
}: CalculatorResultsProps): React.JSX.Element {
  return (
    <section
      className="card results animate-slide-up"
      aria-labelledby="results-heading"
      aria-live="polite"
      id="results-section"
    >
      <h2 id="results-heading" className="sr-only">Your Carbon Footprint Results</h2>

      <div
        className="results__total"
        style={{ color: rating.color }}
        aria-label={`Your total carbon footprint is ${formatCarbonValue(breakdown.total)} per year`}
      >
        {formatCarbonValue(breakdown.total)}
      </div>
      <p className="results__unit">per year</p>

      <div
        className="results__rating"
        style={{
          backgroundColor: `${rating.color}20`,
          color: rating.color,
        }}
        role="status"
        aria-label={`Rating: ${rating.label}. ${rating.description}`}
      >
        {rating.label}
      </div>
      <p className="mt-sm" style={{ color: rating.color, fontSize: 'var(--font-size-sm)' }}>
        {rating.description}
      </p>

      {/* Category Breakdown Chart */}
      <div className="mt-xl" aria-label="Emissions breakdown by category">
        <CarbonChart breakdown={breakdown} />
      </div>

      {/* Category Details */}
      <div className="grid grid-4 mt-xl">
        {CATEGORY_RESULTS.map(({ key, label }) => (
          <div className="stat-card" id={`result-${key}`} key={key}>
            <span className="stat-card__label">{label}</span>
            <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
              {formatCarbonValue(breakdown[key])}
            </span>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="text-center mt-xl">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={isSaved}
          aria-label={isSaved ? 'Results saved to log' : 'Save these results to your tracking log'}
          id="save-to-log-button"
        >
          {isSaved ? '✓ Saved to Log' : '📝 Save to Tracking Log'}
        </button>
      </div>
    </section>
  );
}
