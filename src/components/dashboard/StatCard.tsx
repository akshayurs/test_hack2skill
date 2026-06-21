/**
 * StatCard component for displaying key metrics on the dashboard.
 *
 * Supports trend indicators and accessible labeling.
 *
 * @module StatCard
 * @version 1.0.0
 * @accessibility Includes aria-label and role for screen readers
 */

import React from 'react';
import type { StatCardProps } from '@/types';

/**
 * Displays a single statistic with optional trend indicator.
 *
 * @param props - StatCard properties including title, value, unit, and trend
 * @returns Accessible stat card element
 */
export default function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendPercentage,
  ariaLabel,
}: StatCardProps): React.JSX.Element {
  const trendLabel = trend === 'up'
    ? `Increased by ${trendPercentage}%`
    : trend === 'down'
      ? `Decreased by ${trendPercentage}%`
      : 'No change';

  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const labelId = `stat-label-${slug}`;

  return (
    <article
      className="card stat-card animate-fade-in"
      role="group"
      aria-label={ariaLabel || `${title}: ${value} ${unit}`}
      id={`stat-card-${slug}`}
    >
      {icon && (
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="stat-card__label" id={labelId}>
        {title}
      </span>

      <span
        className="stat-card__value"
        aria-describedby={labelId}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="stat-card__unit"> {unit}</span>
      </span>

      {trend && trendPercentage !== undefined && (
        <span
          className={`stat-card__trend stat-card__trend--${trend}`}
          aria-label={trendLabel}
          role="status"
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          {' '}{Math.abs(trendPercentage)}%
        </span>
      )}
    </article>
  );
}
