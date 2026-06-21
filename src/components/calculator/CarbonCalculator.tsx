/**
 * CarbonCalculator – Interactive carbon footprint calculator form.
 *
 * A multi-section form for entering transportation, energy, diet, and shopping
 * data. Calculates and displays real-time results with category breakdown.
 *
 * @module CarbonCalculator
 * @version 1.0.0
 * @accessibility Full keyboard navigation, ARIA labels, form validation
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type {
  TransportData,
  EnergyData,
  DietData,
  ShoppingData,
  TransportMode,
  DietType,
  CarbonBreakdown,
} from '@/types';
import {
  TRANSPORT_MODE_LABELS,
  DIET_TYPE_LABELS,
} from '@/lib/constants';
import {
  calculateCarbonFootprint,
  formatCarbonValue,
  getEmissionRating,
} from '@/lib/carbonCalculations';
import { sanitizeNumber } from '@/lib/sanitize';
import CarbonChart from '@/components/dashboard/CarbonChart';
import { useCarbonData } from '@/hooks/useCarbonData';

/**
 * Interactive carbon footprint calculator with real-time results.
 *
 * @returns Calculator form with live results display
 */
export default function CarbonCalculator(): React.JSX.Element {
  const { saveToLog } = useCarbonData();

  // ─── Transport State ───
  const [transportEntries, setTransportEntries] = useState<TransportData[]>([
    { mode: 'car', distanceKm: 0, frequencyPerWeek: 0 },
  ]);

  // ─── Energy State ───
  const [energy, setEnergy] = useState<EnergyData>({
    electricityKwh: 0,
    naturalGasTherms: 0,
    usesRenewable: false,
    renewablePercentage: 0,
  });

  // ─── Diet State ───
  const [diet, setDiet] = useState<DietData>({
    dietType: 'average',
    localFoodPercentage: 20,
    reducesFoodWaste: false,
  });

  // ─── Shopping State ───
  const [shopping, setShopping] = useState<ShoppingData>({
    clothingSpendMonthly: 0,
    electronicsSpendMonthly: 0,
    buysSecondHand: false,
    recycles: false,
  });

  const [showResults, setShowResults] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ─── Computed Results ───
  const breakdown: CarbonBreakdown = useMemo(
    () =>
      calculateCarbonFootprint({
        transport: transportEntries,
        energy,
        diet,
        shopping,
      }),
    [transportEntries, energy, diet, shopping]
  );

  const rating = useMemo(() => getEmissionRating(breakdown.total), [breakdown.total]);

  // ─── Transport Handlers ───
  const addTransportEntry = useCallback(() => {
    setTransportEntries((prev) => [
      ...prev,
      { mode: 'car' as TransportMode, distanceKm: 0, frequencyPerWeek: 0 },
    ]);
  }, []);

  const removeTransportEntry = useCallback((index: number) => {
    setTransportEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateTransportEntry = useCallback(
    (index: number, field: keyof TransportData, value: string | number) => {
      setTransportEntries((prev) =>
        prev.map((entry, i) =>
          i === index ? { ...entry, [field]: field === 'mode' ? value : sanitizeNumber(value) } : entry
        )
      );
    },
    []
  );

  // ─── Form Submit ───
  const handleCalculate = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setShowResults(true);
      setIsSaved(false);
    },
    []
  );

  // ─── Save to Log ───
  const handleSaveToLog = useCallback(() => {
    saveToLog('Calculated from carbon calculator');
    setIsSaved(true);
  }, [saveToLog]);

  return (
    <form
      onSubmit={handleCalculate}
      aria-label="Carbon footprint calculator form"
      id="calculator-form"
      noValidate
    >
      {/* ─── Section 1: Transportation ─── */}
      <section className="calculator-section card" aria-labelledby="transport-section-title" id="transport-section">
        <div className="calculator-section__header">
          <span className="calculator-section__number" aria-hidden="true">1</span>
          <h2 className="calculator-section__title" id="transport-section-title">
            🚗 Transportation
          </h2>
        </div>

        {transportEntries.map((entry, index) => (
          <div className="transport-entry" key={index}>
            <div className="form-group">
              <label className="form-label" htmlFor={`transport-mode-${index}`}>
                Mode <span className="required" aria-label="required">*</span>
              </label>
              <select
                className="form-select"
                id={`transport-mode-${index}`}
                value={entry.mode}
                onChange={(e) => updateTransportEntry(index, 'mode', e.target.value)}
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
                onChange={(e) => updateTransportEntry(index, 'distanceKm', e.target.value)}
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
                onChange={(e) => updateTransportEntry(index, 'frequencyPerWeek', e.target.value)}
                min="0"
                max="100"
                step="1"
                placeholder="e.g., 5"
                aria-label={`Frequency per week for transport entry ${index + 1}`}
                required
              />
            </div>

            {transportEntries.length > 1 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeTransportEntry(index)}
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
          onClick={addTransportEntry}
          aria-label="Add another transportation entry"
          id="add-transport-entry"
        >
          + Add Transport Mode
        </button>
      </section>

      {/* ─── Section 2: Home Energy ─── */}
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
              onChange={(e) =>
                setEnergy((prev) => ({ ...prev, usesRenewable: e.target.checked }))
              }
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

      {/* ─── Section 3: Diet ─── */}
      <section className="calculator-section card" aria-labelledby="diet-section-title" id="diet-section">
        <div className="calculator-section__header">
          <span className="calculator-section__number" aria-hidden="true">3</span>
          <h2 className="calculator-section__title" id="diet-section-title">
            🥗 Diet & Food
          </h2>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="diet-type">
            Diet Type <span className="required" aria-label="required">*</span>
          </label>
          <select
            className="form-select"
            id="diet-type"
            value={diet.dietType}
            onChange={(e) =>
              setDiet((prev) => ({ ...prev, dietType: e.target.value as DietType }))
            }
            aria-label="Select your diet type"
            required
          >
            {Object.entries(DIET_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="local-food">
            Local food percentage: {diet.localFoodPercentage}%
          </label>
          <input
            className="form-range"
            type="range"
            id="local-food"
            value={diet.localFoodPercentage}
            onChange={(e) =>
              setDiet((prev) => ({
                ...prev,
                localFoodPercentage: Number(e.target.value),
              }))
            }
            min="0"
            max="100"
            step="5"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={diet.localFoodPercentage}
          />
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={diet.reducesFoodWaste}
              onChange={(e) =>
                setDiet((prev) => ({ ...prev, reducesFoodWaste: e.target.checked }))
              }
              id="reduces-food-waste"
              aria-label="I actively reduce food waste"
            />
            <span>I actively reduce food waste</span>
          </label>
        </div>
      </section>

      {/* ─── Section 4: Shopping ─── */}
      <section className="calculator-section card" aria-labelledby="shopping-section-title" id="shopping-section">
        <div className="calculator-section__header">
          <span className="calculator-section__number" aria-hidden="true">4</span>
          <h2 className="calculator-section__title" id="shopping-section-title">
            🛍️ Shopping & Consumption
          </h2>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="clothing-spend">
              Monthly Clothing Spend ($)
            </label>
            <input
              className="form-input"
              type="number"
              id="clothing-spend"
              value={shopping.clothingSpendMonthly || ''}
              onChange={(e) =>
                setShopping((prev) => ({
                  ...prev,
                  clothingSpendMonthly: sanitizeNumber(e.target.value, 0, 100000),
                }))
              }
              min="0"
              placeholder="e.g., 100"
              aria-label="Monthly spending on clothing in dollars"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="electronics-spend">
              Monthly Electronics Spend ($)
            </label>
            <input
              className="form-input"
              type="number"
              id="electronics-spend"
              value={shopping.electronicsSpendMonthly || ''}
              onChange={(e) =>
                setShopping((prev) => ({
                  ...prev,
                  electronicsSpendMonthly: sanitizeNumber(e.target.value, 0, 100000),
                }))
              }
              min="0"
              placeholder="e.g., 50"
              aria-label="Monthly spending on electronics in dollars"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={shopping.buysSecondHand}
                onChange={(e) =>
                  setShopping((prev) => ({ ...prev, buysSecondHand: e.target.checked }))
                }
                id="buys-secondhand"
                aria-label="I regularly buy second-hand items"
              />
              <span>I buy second-hand regularly</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={shopping.recycles}
                onChange={(e) =>
                  setShopping((prev) => ({ ...prev, recycles: e.target.checked }))
                }
                id="recycles"
                aria-label="I actively recycle"
              />
              <span>I actively recycle</span>
            </label>
          </div>
        </div>
      </section>

      {/* ─── Calculate Button ─── */}
      <div className="text-center mt-lg mb-lg">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          id="calculate-button"
          aria-label="Calculate my carbon footprint"
        >
          🌱 Calculate My Footprint
        </button>
      </div>

      {/* ─── Results Display ─── */}
      {showResults && (
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
            <div className="stat-card" id="result-transport">
              <span className="stat-card__label">Transport</span>
              <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
                {formatCarbonValue(breakdown.transport)}
              </span>
            </div>
            <div className="stat-card" id="result-energy">
              <span className="stat-card__label">Energy</span>
              <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
                {formatCarbonValue(breakdown.energy)}
              </span>
            </div>
            <div className="stat-card" id="result-diet">
              <span className="stat-card__label">Diet</span>
              <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
                {formatCarbonValue(breakdown.diet)}
              </span>
            </div>
            <div className="stat-card" id="result-shopping">
              <span className="stat-card__label">Shopping</span>
              <span className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
                {formatCarbonValue(breakdown.shopping)}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center mt-xl">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveToLog}
              disabled={isSaved}
              aria-label={isSaved ? 'Results saved to log' : 'Save these results to your tracking log'}
              id="save-to-log-button"
            >
              {isSaved ? '✓ Saved to Log' : '📝 Save to Tracking Log'}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
