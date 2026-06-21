/**
 * DonutChart component for visualizing carbon footprint breakdown.
 *
 * Renders an SVG donut chart with animated segments and accessible labels.
 * Uses pure SVG without external charting libraries for minimal bundle size.
 *
 * @module CarbonChart
 * @version 1.0.0
 * @accessibility Includes role="img" and aria-label for screen readers
 */

'use client';

import React, { useMemo } from 'react';
import type { CarbonBreakdown } from '@/types';
import { formatCarbonValue } from '@/lib/carbonCalculations';
import { CARBON_CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants';

interface CarbonChartProps {
  /** Carbon footprint breakdown data */
  readonly breakdown: CarbonBreakdown;
  /** Size of the chart in pixels */
  readonly size?: number;
}

/**
 * SVG donut chart visualizing carbon footprint breakdown by category.
 *
 * @param props - Chart properties including breakdown data
 * @returns SVG donut chart with legend
 */
export default function CarbonChart({
  breakdown,
  size = 220,
}: CarbonChartProps): React.JSX.Element {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  /**
   * Calculate segment data for the donut chart.
   * Memoized to avoid recalculation on every render.
   */
  const segments = useMemo(() => {
    if (breakdown.total === 0) return [];

    let cumulativeOffset = 0;

    return CARBON_CATEGORIES.map((category) => {
      const value = breakdown[category];
      const percentage = (value / breakdown.total) * 100;
      const segmentLength = (percentage / 100) * circumference;
      const offset = cumulativeOffset;

      cumulativeOffset += segmentLength;

      return {
        category,
        value,
        percentage,
        segmentLength,
        offset,
        color: CATEGORY_COLORS[category],
        label: CATEGORY_LABELS[category],
      };
    });
  }, [breakdown, circumference]);

  const chartAriaLabel = `Carbon footprint breakdown: Transport ${Math.round((breakdown.transport / Math.max(breakdown.total, 1)) * 100)}%, Energy ${Math.round((breakdown.energy / Math.max(breakdown.total, 1)) * 100)}%, Diet ${Math.round((breakdown.diet / Math.max(breakdown.total, 1)) * 100)}%, Shopping ${Math.round((breakdown.shopping / Math.max(breakdown.total, 1)) * 100)}%`;

  return (
    <div className="donut-chart" id="carbon-breakdown-chart">
      {/* SVG Donut Chart */}
      <svg
        className="donut-chart__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={chartAriaLabel}
      >
        <title>Carbon Footprint Breakdown Chart</title>

        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="24"
          aria-hidden="true"
        />

        {/* Data segments */}
        {segments.map((segment) => (
          <circle
            key={segment.category}
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="24"
            strokeDasharray={`${segment.segmentLength} ${circumference - segment.segmentLength}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <title>{`${segment.label}: ${segment.value.toLocaleString()} kg CO₂e (${segment.percentage.toFixed(1)}%)`}</title>
          </circle>
        ))}
      </svg>

      {/* Center label */}
      <div className="donut-chart__center" aria-hidden="true">
        <div className="donut-chart__value">
          {breakdown.total >= 1000
            ? `${(breakdown.total / 1000).toFixed(1)}t`
            : `${Math.round(breakdown.total)}`}
        </div>
        <div className="donut-chart__label">
          {breakdown.total >= 1000 ? 'CO₂e/yr' : 'kg CO₂e/yr'}
        </div>
      </div>

      {/* Accessible text alternative */}
      <div className="sr-only" role="list" aria-label="Breakdown details">
        {segments.map((segment) => (
          <div key={segment.category} role="listitem">
            {segment.label}: {formatCarbonValue(segment.value)} ({segment.percentage.toFixed(1)}%)
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend" role="list" aria-label="Chart legend">
        {segments.map((segment) => (
          <div className="legend__item" key={segment.category} role="listitem">
            <span
              className="legend__dot"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span>{segment.label} ({segment.percentage.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
