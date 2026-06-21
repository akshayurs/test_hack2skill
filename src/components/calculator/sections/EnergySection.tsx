/**
 * EnergySection – household energy inputs for the carbon calculator.
 *
 * @module EnergySection
 * @accessibility Labelled controls with descriptive hints and slider semantics
 */

'use client';

import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { EnergyData } from '@/types';
import { sanitizeNumber } from '@/lib/sanitize';

interface EnergySectionProps {
  readonly energy: EnergyData;
  readonly setEnergy: Dispatch<SetStateAction<EnergyData>>;
}

/**
 * Renders the home-energy section of the calculator form.
 *
 * @param props - The energy slice of state and its setter
 * @returns The energy input section
 */
export default function EnergySection({ energy, setEnergy }: EnergySectionProps): React.JSX.Element {
  return (
    <section className="calculator-section card" aria-labelledby="energy-section-title" id="energy-section">
      <div className="calculator-section__header">
        <span className="calculator-section__number" aria-hidden="true">2</span>
        <h2 className="calculator-section__title" id="energy-section-title">
          ⚡ Home Energy
        </h2>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="electricity-kwh">
            Monthly Electricity (kWh)
          </label>
          <input
            className="form-input"
            type="number"
            id="electricity-kwh"
            value={energy.electricityKwh || ''}
            onChange={(e) =>
              setEnergy((prev) => ({
                ...prev,
                electricityKwh: sanitizeNumber(e.target.value, 0, 100000),
              }))
            }
            min="0"
            max="100000"
            placeholder="e.g., 900"
            aria-describedby="electricity-hint"
          />
          <span className="form-hint" id="electricity-hint">
            Average US household: ~900 kWh/month
          </span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="natural-gas">
            Monthly Natural Gas (therms)
          </label>
          <input
            className="form-input"
            type="number"
            id="natural-gas"
            value={energy.naturalGasTherms || ''}
            onChange={(e) =>
              setEnergy((prev) => ({
                ...prev,
                naturalGasTherms: sanitizeNumber(e.target.value, 0, 10000),
              }))
            }
            min="0"
            placeholder="e.g., 50"
            aria-describedby="gas-hint"
          />
          <span className="form-hint" id="gas-hint">
            Average US household: ~50 therms/month
          </span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={energy.usesRenewable}
            onChange={(e) => setEnergy((prev) => ({ ...prev, usesRenewable: e.target.checked }))}
            id="uses-renewable"
            aria-label="I use renewable energy sources"
          />
          <span>I use renewable energy sources</span>
        </label>
      </div>

      {energy.usesRenewable && (
        <div className="form-group">
          <label className="form-label" htmlFor="renewable-percentage">
            Renewable energy percentage: {energy.renewablePercentage}%
          </label>
          <input
            className="form-range"
            type="range"
            id="renewable-percentage"
            value={energy.renewablePercentage}
            onChange={(e) =>
              setEnergy((prev) => ({
                ...prev,
                renewablePercentage: Number(e.target.value),
              }))
            }
            min="0"
            max="100"
            step="5"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={energy.renewablePercentage}
            aria-label={`Renewable energy percentage: ${energy.renewablePercentage}%`}
          />
        </div>
      )}
    </section>
  );
}
