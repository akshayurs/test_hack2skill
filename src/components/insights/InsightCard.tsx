/**
 * InsightCard component for displaying personalized carbon reduction insights.
 *
 * @module InsightCard
 * @version 1.0.0
 * @accessibility Uses semantic article elements and ARIA attributes
 */

import React from 'react';
import type { Insight } from '@/types';
import { formatCarbonValue } from '@/lib/carbonCalculations';

interface InsightCardProps {
  /** Insight data to display */
  readonly insight: Insight;
}

/**
 * Displays a single personalized insight with priority indicator and potential savings.
 *
 * @param props - InsightCard properties
 * @returns Accessible insight card element
 */
export default function InsightCard({ insight }: InsightCardProps): React.JSX.Element {
  return (
    <article
      className="card insight-card animate-fade-in"
      role="article"
      aria-label={`${insight.priority} priority insight: ${insight.title}`}
      id={`insight-${insight.id}`}
    >
      {/* Priority indicator bar */}
      <div
        className={`insight-card__priority insight-card__priority--${insight.priority}`}
        role="presentation"
        aria-hidden="true"
      />

      <div className="insight-card__content">
        <h3 className="insight-card__title">{insight.title}</h3>
        <p className="insight-card__message">{insight.message}</p>

        {insight.potentialSavings > 0 && (
          <p className="insight-card__savings" aria-label={`Potential savings: ${formatCarbonValue(insight.potentialSavings)} per year`}>
            💡 Potential savings: {formatCarbonValue(insight.potentialSavings)}/year
          </p>
        )}
      </div>
    </article>
  );
}
