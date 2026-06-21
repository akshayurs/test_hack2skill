/**
 * DietSection – dietary habit inputs for the carbon calculator.
 *
 * @module DietSection
 * @accessibility Labelled select and slider with explicit ARIA names
 */

'use client';

import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DietData, DietType } from '@/types';
import { DIET_TYPE_LABELS } from '@/lib/constants';

interface DietSectionProps {
  readonly diet: DietData;
  readonly setDiet: Dispatch<SetStateAction<DietData>>;
}

/**
 * Renders the diet section of the calculator form.
 *
 * @param props - The diet slice of state and its setter
 * @returns The diet input section
 */
export default function DietSection({ diet, setDiet }: DietSectionProps): React.JSX.Element {
  return (
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
          onChange={(e) => setDiet((prev) => ({ ...prev, dietType: e.target.value as DietType }))}
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
          aria-label={`Local food percentage: ${diet.localFoodPercentage}%`}
        />
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={diet.reducesFoodWaste}
            onChange={(e) => setDiet((prev) => ({ ...prev, reducesFoodWaste: e.target.checked }))}
            id="reduces-food-waste"
            aria-label="I actively reduce food waste"
          />
          <span>I actively reduce food waste</span>
        </label>
      </div>
    </section>
  );
}
