/**
 * ActionCard component for displaying carbon reduction actions.
 *
 * @module ActionCard
 * @version 1.0.0
 * @accessibility Keyboard accessible toggle with ARIA states
 */

'use client';

import React, { useCallback } from 'react';
import type { CarbonAction } from '@/types';

interface ActionCardProps {
  /** Carbon reduction action data */
  readonly action: CarbonAction;
  /** Callback when action completion is toggled */
  readonly onToggle: (actionId: string) => void;
}

/**
 * Displays a single carbon reduction action with toggle functionality.
 *
 * @param props - ActionCard properties
 * @returns Interactive, accessible action card element
 */
export default function ActionCard({
  action,
  onToggle,
}: ActionCardProps): React.JSX.Element {
  const handleClick = useCallback(() => {
    onToggle(action.id);
  }, [action.id, onToggle]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle(action.id);
      }
    },
    [action.id, onToggle]
  );

  return (
    <article
      className={`card action-card ${action.completed ? 'action-card--completed' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={action.completed}
      aria-label={`${action.title}: ${action.description}. Saves approximately ${action.estimatedSavingsKgPerYear} kg CO2e per year. Difficulty: ${action.difficulty}. ${action.completed ? 'Completed' : 'Not completed'}`}
      tabIndex={0}
      id={`action-${action.id}`}
    >
      {/* Checkbox indicator */}
      <div className="action-card__checkbox" aria-hidden="true">
        {action.completed && (
          <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
        )}
      </div>

      {/* Action icon */}
      <span className="action-card__icon" aria-hidden="true">
        {action.icon}
      </span>

      {/* Action content */}
      <div className="action-card__content">
        <h3 className="action-card__title">{action.title}</h3>
        <p className="action-card__description">{action.description}</p>

        <div className="action-card__meta">
          <span className={`action-card__badge action-card__badge--${action.difficulty}`}>
            {action.difficulty.charAt(0).toUpperCase() + action.difficulty.slice(1)}
          </span>
          <span className="action-card__savings">
            Saves ~{action.estimatedSavingsKgPerYear.toLocaleString()} kg CO₂e/year
          </span>
        </div>
      </div>
    </article>
  );
}
