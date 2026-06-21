/**
 * InsightsContent client component.
 *
 * @module InsightsContent
 * @version 1.0.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useCarbonData } from '@/hooks/useCarbonData';
import InsightCard from './InsightCard';

/**
 * Renders personalized insights based on user's carbon data.
 *
 * @returns Insights list or empty state
 */
export default function InsightsContent(): React.JSX.Element {
  const { insights, breakdown } = useCarbonData();

  if (breakdown.total === 0) {
    return (
      <div className="empty-state" id="insights-empty" role="status">
        <div className="empty-state__icon" aria-hidden="true">💡</div>
        <h2 className="empty-state__title">No Insights Yet</h2>
        <p className="empty-state__text">
          Calculate your carbon footprint first to receive personalized insights and recommendations.
        </p>
        <Link
          href="/calculator"
          className="btn btn-primary mt-lg"
          aria-label="Go to the carbon footprint calculator"
          id="insights-cta-calculator"
        >
          🧮 Calculate Now
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Personalized insights list" id="insights-list">
      <div className="grid" style={{ gap: 'var(--space-md)' }}>
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`animate-fade-in stagger-${Math.min(index + 1, 4)}`}
          >
            <InsightCard insight={insight} />
          </div>
        ))}
      </div>

      <div className="text-center mt-xl">
        <Link
          href="/actions"
          className="btn btn-primary btn-lg"
          aria-label="Browse carbon reduction actions"
          id="insights-cta-actions"
        >
          🎯 Take Action Now
        </Link>
      </div>
    </section>
  );
}
