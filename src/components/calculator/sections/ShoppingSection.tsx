/**
 * ShoppingSection – consumption habit inputs for the carbon calculator.
 *
 * @module ShoppingSection
 * @accessibility Labelled numeric inputs and checkboxes
 */

'use client';

import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ShoppingData } from '@/types';
import { sanitizeNumber } from '@/lib/sanitize';

interface ShoppingSectionProps {
  readonly shopping: ShoppingData;
  readonly setShopping: Dispatch<SetStateAction<ShoppingData>>;
}

/**
 * Renders the shopping section of the calculator form.
 *
 * @param props - The shopping slice of state and its setter
 * @returns The shopping input section
 */
export default function ShoppingSection({ shopping, setShopping }: ShoppingSectionProps): React.JSX.Element {
  return (
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
              onChange={(e) => setShopping((prev) => ({ ...prev, buysSecondHand: e.target.checked }))}
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
              onChange={(e) => setShopping((prev) => ({ ...prev, recycles: e.target.checked }))}
              id="recycles"
              aria-label="I actively recycle"
            />
            <span>I actively recycle</span>
          </label>
        </div>
      </div>
    </section>
  );
}
