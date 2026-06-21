/**
 * Unit tests for the input validation module.
 *
 * Tests all validation functions for transport, energy, diet,
 * and shopping data with valid, invalid, and edge case inputs.
 *
 * @module validators.test
 * @version 1.0.0
 */

import {
  validateTransportEntry,
  validateEnergyData,
  validateDietData,
  validateShoppingData,
  validateCarbonFootprintInput,
} from '@/lib/validators';

describe('validateTransportEntry', () => {
  it('should return no errors for valid data', () => {
    const errors = validateTransportEntry({
      mode: 'car',
      distanceKm: 20,
      frequencyPerWeek: 5,
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for missing mode', () => {
    const errors = validateTransportEntry({
      distanceKm: 20,
      frequencyPerWeek: 5,
    });
    expect(errors.some((e) => e.field === 'mode')).toBe(true);
  });

  it('should return error for invalid mode', () => {
    const errors = validateTransportEntry({
      // @ts-expect-error Testing invalid mode
      mode: 'spaceship',
      distanceKm: 20,
      frequencyPerWeek: 5,
    });
    expect(errors.some((e) => e.field === 'mode')).toBe(true);
  });

  it('should return error for negative distance', () => {
    const errors = validateTransportEntry({
      mode: 'car',
      distanceKm: -10,
      frequencyPerWeek: 5,
    });
    expect(errors.some((e) => e.field === 'distanceKm')).toBe(true);
  });

  it('should return error for excessive distance', () => {
    const errors = validateTransportEntry({
      mode: 'car',
      distanceKm: 60000,
      frequencyPerWeek: 5,
    });
    expect(errors.some((e) => e.field === 'distanceKm')).toBe(true);
  });

  it('should return error for missing distance', () => {
    const errors = validateTransportEntry({
      mode: 'car',
      frequencyPerWeek: 5,
    });
    expect(errors.some((e) => e.field === 'distanceKm')).toBe(true);
  });

  it('should return error for excessive frequency', () => {
    const errors = validateTransportEntry({
      mode: 'car',
      distanceKm: 20,
      frequencyPerWeek: 200,
    });
    expect(errors.some((e) => e.field === 'frequencyPerWeek')).toBe(true);
  });

  it('should accept zero values', () => {
    const errors = validateTransportEntry({
      mode: 'bicycle',
      distanceKm: 0,
      frequencyPerWeek: 0,
    });
    expect(errors).toHaveLength(0);
  });
});

describe('validateEnergyData', () => {
  it('should return no errors for valid data', () => {
    const errors = validateEnergyData({
      electricityKwh: 900,
      naturalGasTherms: 50,
      renewablePercentage: 30,
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for negative electricity', () => {
    const errors = validateEnergyData({
      electricityKwh: -100,
      naturalGasTherms: 50,
    });
    expect(errors.some((e) => e.field === 'electricityKwh')).toBe(true);
  });

  it('should return error for excessive electricity', () => {
    const errors = validateEnergyData({
      electricityKwh: 200000,
      naturalGasTherms: 50,
    });
    expect(errors.some((e) => e.field === 'electricityKwh')).toBe(true);
  });

  it('should return error for invalid renewable percentage', () => {
    const errors = validateEnergyData({
      electricityKwh: 900,
      naturalGasTherms: 50,
      renewablePercentage: 150,
    });
    expect(errors.some((e) => e.field === 'renewablePercentage')).toBe(true);
  });
});

describe('validateDietData', () => {
  it('should return no errors for valid data', () => {
    const errors = validateDietData({
      dietType: 'vegetarian',
      localFoodPercentage: 50,
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for invalid diet type', () => {
    const errors = validateDietData({
      // @ts-expect-error Testing invalid diet type
      dietType: 'invalid',
    });
    expect(errors.some((e) => e.field === 'dietType')).toBe(true);
  });

  it('should return error for invalid local food percentage', () => {
    const errors = validateDietData({
      dietType: 'vegan',
      localFoodPercentage: -10,
    });
    expect(errors.some((e) => e.field === 'localFoodPercentage')).toBe(true);
  });
});

describe('validateShoppingData', () => {
  it('should return no errors for valid data', () => {
    const errors = validateShoppingData({
      clothingSpendMonthly: 100,
      electronicsSpendMonthly: 50,
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for negative clothing spend', () => {
    const errors = validateShoppingData({
      clothingSpendMonthly: -50,
    });
    expect(errors.some((e) => e.field === 'clothingSpendMonthly')).toBe(true);
  });

  it('should return error for excessive electronics spend', () => {
    const errors = validateShoppingData({
      electronicsSpendMonthly: 200000,
    });
    expect(errors.some((e) => e.field === 'electronicsSpendMonthly')).toBe(true);
  });
});

describe('validateCarbonFootprintInput', () => {
  it('should validate complete valid input', () => {
    const result = validateCarbonFootprintInput({
      transport: [{ mode: 'car', distanceKm: 20, frequencyPerWeek: 5 }],
      energy: { electricityKwh: 900, naturalGasTherms: 50, usesRenewable: false, renewablePercentage: 0 },
      diet: { dietType: 'average', localFoodPercentage: 20, reducesFoodWaste: false },
      shopping: { clothingSpendMonthly: 100, electronicsSpendMonthly: 50, buysSecondHand: false, recycles: false },
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should aggregate errors from all sections', () => {
    const result = validateCarbonFootprintInput({
      transport: [{ mode: 'car', distanceKm: -10, frequencyPerWeek: 5 }],
      energy: { electricityKwh: -100, naturalGasTherms: 50, usesRenewable: false, renewablePercentage: 0 },
      diet: { dietType: 'average', localFoodPercentage: -10, reducesFoodWaste: false },
      shopping: { clothingSpendMonthly: -50, electronicsSpendMonthly: 50, buysSecondHand: false, recycles: false },
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
  });

  it('should handle empty partial input', () => {
    const result = validateCarbonFootprintInput({});
    expect(result.isValid).toBe(true);
  });
});
