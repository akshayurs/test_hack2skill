/**
 * TransportSection – transportation inputs for the carbon calculator.
 *
 * Owns the presentation for one or more transport entries and delegates all
 * state changes to its parent via callbacks.
 *
 * @module TransportSection
 * @accessibility Labelled controls with required-field indicators
 */

'use client';

import React from 'react';
import type { TransportData } from '@/types';
import { TRANSPORT_MODE_LABELS } from '@/lib/constants';

interface TransportSectionProps {
  readonly entries: TransportData[];
  readonly onAdd: () => void;
  readonly onRemove: (index: number) => void;
  readonly onUpdate: (index: number, field: keyof TransportData, value: string | number) => void;
}

/**
 * Renders the transportation section of the calculator form.
 *
 * @param props - Entries and the callbacks used to mutate them
 * @returns The transport input section
 */
export default function TransportSection({
  entries,
  onAdd,
  onRemove,
  onUpdate,
}: TransportSectionProps): React.JSX.Element {
  return (
    <section className="calculator-section card" aria-labelledby="transport-section-title" id="transport-section">
      <div className="calculator-section__header">
        <span className="calculator-section__number" aria-hidden="true">1</span>
        <h2 className="calculator-section__title" id="transport-section-title">
          🚗 Transportation
        </h2>
      </div>

      {entries.map((entry, index) => (
        <div className="transport-entry" key={index}>
          <div className="form-group">
            <label className="form-label" htmlFor={`transport-mode-${index}`}>
              Mode <span className="required" aria-label="required">*</span>
            </label>
            <select
              className="form-select"
              id={`transport-mode-${index}`}
              value={entry.mode}
              onChange={(e) => onUpdate(index, 'mode', e.target.value)}
              aria-label={`Transportation mode for entry ${index + 1}`}
              required
            >
              {Object.entries(TRANSPORT_MODE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`transport-distance-${index}`}>
              Distance (km) <span className="required" aria-label="required">*</span>
            </label>
            <input
              className="form-input"
              type="number"
              id={`transport-distance-${index}`}
              value={entry.distanceKm || ''}
              onChange={(e) => onUpdate(index, 'distanceKm', e.target.value)}
              min="0"
              max="50000"
              step="0.1"
              placeholder="e.g., 20"
              aria-label={`Distance in kilometers for transport entry ${index + 1}`}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`transport-frequency-${index}`}>
              Times/week <span className="required" aria-label="required">*</span>
            </label>
            <input
              className="form-input"
              type="number"
              id={`transport-frequency-${index}`}
              value={entry.frequencyPerWeek || ''}
              onChange={(e) => onUpdate(index, 'frequencyPerWeek', e.target.value)}
              min="0"
              max="100"
              step="1"
              placeholder="e.g., 5"
              aria-label={`Frequency per week for transport entry ${index + 1}`}
              required
            />
          </div>

          {entries.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(index)}
              aria-label={`Remove transport entry ${index + 1}`}
              id={`remove-transport-${index}`}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onAdd}
        aria-label="Add another transportation entry"
        id="add-transport-entry"
      >
        + Add Transport Mode
      </button>
    </section>
  );
}
