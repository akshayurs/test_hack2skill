/**
 * Unit tests for the carbon footprint calculation engine.
 *
 * Tests all calculation functions with various inputs including
 * edge cases, boundary values, and error conditions.
 *
 * @module carbonCalculations.test
 * @version 1.0.0
 */

import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateDietEmissions,
  calculateShoppingEmissions,
  calculateCarbonFootprint,
  generateInsights,
  calculatePercentages,
  formatCarbonValue,
  getEmissionRating,
} from '@/lib/carbonCalculations';

import type {
  TransportData,
  EnergyData,
  DietData,
  ShoppingData,
  CarbonFootprintInput,
} from '@/types';

/* ─────────────────── Transport Emissions Tests ──────────────────────────── */

describe('calculateTransportEmissions', () => {
  it('should return 0 for empty transport array', () => {
    expect(calculateTransportEmissions([])).toBe(0);
  });

  it('should return 0 for zero-emission transport modes', () => {
    const entries: TransportData[] = [
      { mode: 'bicycle', distanceKm: 10, frequencyPerWeek: 5 },
      { mode: 'walking', distanceKm: 5, frequencyPerWeek: 7 },
    ];
    expect(calculateTransportEmissions(entries)).toBe(0);
  });

  it('should treat an unknown transport mode as zero emissions', () => {
    const entries = [
      { mode: 'teleport' as unknown as TransportData['mode'], distanceKm: 100, frequencyPerWeek: 5 },
    ];
    expect(calculateTransportEmissions(entries)).toBe(0);
  });

  it('should correctly calculate car emissions', () => {
    const entries: TransportData[] = [
      { mode: 'car', distanceKm: 20, frequencyPerWeek: 5 },
    ];
    // 0.21 * 20 * 5 * 52 = 1092
    expect(calculateTransportEmissions(entries)).toBe(1092);
  });

  it('should correctly calculate multiple transport modes', () => {
    const entries: TransportData[] = [
      { mode: 'car', distanceKm: 20, frequencyPerWeek: 5 },
      { mode: 'train', distanceKm: 50, frequencyPerWeek: 2 },
    ];
    // Car: 0.21 * 20 * 5 * 52 = 1092
    // Train: 0.041 * 50 * 2 * 52 = 213.2
    const expected = 1092 + 213.2;
    expect(calculateTransportEmissions(entries)).toBeCloseTo(expected, 1);
  });

  it('should handle electric car with lower emissions', () => {
    const entries: TransportData[] = [
      { mode: 'electric_car', distanceKm: 20, frequencyPerWeek: 5 },
    ];
    // 0.05 * 20 * 5 * 52 = 260
    expect(calculateTransportEmissions(entries)).toBe(260);
  });

  it('should throw error for negative distance', () => {
    const entries: TransportData[] = [
      { mode: 'car', distanceKm: -10, frequencyPerWeek: 5 },
    ];
    expect(() => calculateTransportEmissions(entries)).toThrow(
      'Invalid transport data'
    );
  });

  it('should throw error for negative frequency', () => {
    const entries: TransportData[] = [
      { mode: 'car', distanceKm: 10, frequencyPerWeek: -1 },
    ];
    expect(() => calculateTransportEmissions(entries)).toThrow(
      'Invalid transport data'
    );
  });

  it('should return 0 for non-array input', () => {
    // @ts-expect-error Testing invalid input
    expect(calculateTransportEmissions(null)).toBe(0);
  });

  it('should handle zero distance and frequency', () => {
    const entries: TransportData[] = [
      { mode: 'car', distanceKm: 0, frequencyPerWeek: 0 },
    ];
    expect(calculateTransportEmissions(entries)).toBe(0);
  });
});

/* ────────────────────── Energy Emissions Tests ──────────────────────────── */

describe('calculateEnergyEmissions', () => {
  it('should calculate emissions from electricity only', () => {
    const data: EnergyData = {
      electricityKwh: 900,
      naturalGasTherms: 0,
      usesRenewable: false,
      renewablePercentage: 0,
    };
    // 900 * 0.417 * 12 = 4503.6
    expect(calculateEnergyEmissions(data)).toBeCloseTo(4503.6, 1);
  });

  it('should calculate emissions from natural gas only', () => {
    const data: EnergyData = {
      electricityKwh: 0,
      naturalGasTherms: 50,
      usesRenewable: false,
      renewablePercentage: 0,
    };
    // 50 * 5.3 * 12 = 3180
    expect(calculateEnergyEmissions(data)).toBe(3180);
  });

  it('should apply renewable energy reduction', () => {
    const data: EnergyData = {
      electricityKwh: 900,
      naturalGasTherms: 0,
      usesRenewable: true,
      renewablePercentage: 50,
    };
    // 900 * 0.417 * 12 * 0.5 = 2251.8
    expect(calculateEnergyEmissions(data)).toBeCloseTo(2251.8, 1);
  });

  it('should apply 100% renewable to eliminate electricity emissions', () => {
    const data: EnergyData = {
      electricityKwh: 900,
      naturalGasTherms: 50,
      usesRenewable: true,
      renewablePercentage: 100,
    };
    // Electricity: 0 (100% renewable)
    // Gas: 50 * 5.3 * 12 = 3180
    expect(calculateEnergyEmissions(data)).toBeCloseTo(3180, 1);
  });

  it('should throw error for negative electricity value', () => {
    const data: EnergyData = {
      electricityKwh: -100,
      naturalGasTherms: 0,
      usesRenewable: false,
      renewablePercentage: 0,
    };
    expect(() => calculateEnergyEmissions(data)).toThrow(
      'Energy consumption values must be non-negative'
    );
  });

  it('should throw error for invalid renewable percentage', () => {
    const data: EnergyData = {
      electricityKwh: 900,
      naturalGasTherms: 0,
      usesRenewable: true,
      renewablePercentage: 150,
    };
    expect(() => calculateEnergyEmissions(data)).toThrow(
      'Renewable percentage must be between 0 and 100'
    );
  });

  it('should handle zero energy consumption', () => {
    const data: EnergyData = {
      electricityKwh: 0,
      naturalGasTherms: 0,
      usesRenewable: false,
      renewablePercentage: 0,
    };
    expect(calculateEnergyEmissions(data)).toBe(0);
  });
});

/* ──────────────────────── Diet Emissions Tests ──────────────────────────── */

describe('calculateDietEmissions', () => {
  it('should return base emissions for average diet', () => {
    const data: DietData = {
      dietType: 'average',
      localFoodPercentage: 0,
      reducesFoodWaste: false,
    };
    expect(calculateDietEmissions(data)).toBe(2500);
  });

  it('should fall back to the average factor for an unknown diet type', () => {
    const data = {
      dietType: 'carnivore' as unknown as DietData['dietType'],
      localFoodPercentage: 0,
      reducesFoodWaste: false,
    };
    expect(calculateDietEmissions(data)).toBe(2500);
  });

  it('should return highest emissions for meat heavy diet', () => {
    const data: DietData = {
      dietType: 'meat_heavy',
      localFoodPercentage: 0,
      reducesFoodWaste: false,
    };
    expect(calculateDietEmissions(data)).toBe(3300);
  });

  it('should return lowest emissions for vegan diet', () => {
    const data: DietData = {
      dietType: 'vegan',
      localFoodPercentage: 0,
      reducesFoodWaste: false,
    };
    expect(calculateDietEmissions(data)).toBe(1500);
  });

  it('should apply local food reduction', () => {
    const data: DietData = {
      dietType: 'average',
      localFoodPercentage: 100,
      reducesFoodWaste: false,
    };
    // 2500 * (1 - 0.1) = 2250
    expect(calculateDietEmissions(data)).toBeCloseTo(2250, 1);
  });

  it('should apply food waste reduction', () => {
    const data: DietData = {
      dietType: 'average',
      localFoodPercentage: 0,
      reducesFoodWaste: true,
    };
    // 2500 * 0.92 = 2300
    expect(calculateDietEmissions(data)).toBe(2300);
  });

  it('should apply both reductions', () => {
    const data: DietData = {
      dietType: 'average',
      localFoodPercentage: 50,
      reducesFoodWaste: true,
    };
    // 2500 * (1 - 0.05) * 0.92 = 2500 * 0.95 * 0.92 = 2185
    expect(calculateDietEmissions(data)).toBeCloseTo(2185, 0);
  });

  it('should throw error for invalid local food percentage', () => {
    const data: DietData = {
      dietType: 'average',
      localFoodPercentage: -10,
      reducesFoodWaste: false,
    };
    expect(() => calculateDietEmissions(data)).toThrow(
      'Local food percentage must be between 0 and 100'
    );
  });
});

/* ──────────────────── Shopping Emissions Tests ──────────────────────────── */

describe('calculateShoppingEmissions', () => {
  it('should calculate basic shopping emissions', () => {
    const data: ShoppingData = {
      clothingSpendMonthly: 100,
      electronicsSpendMonthly: 50,
      buysSecondHand: false,
      recycles: false,
    };
    // Clothing: 100 * 0.02 * 12 = 24
    // Electronics: 50 * 0.015 * 12 = 9
    // Total: 33
    expect(calculateShoppingEmissions(data)).toBe(33);
  });

  it('should apply second-hand reduction', () => {
    const data: ShoppingData = {
      clothingSpendMonthly: 100,
      electronicsSpendMonthly: 50,
      buysSecondHand: true,
      recycles: false,
    };
    // Clothing: 100 * 0.02 * 12 * 0.3 = 7.2
    // Electronics: 50 * 0.015 * 12 * 0.3 = 2.7
    // Total: 9.9
    expect(calculateShoppingEmissions(data)).toBeCloseTo(9.9, 1);
  });

  it('should apply recycling reduction', () => {
    const data: ShoppingData = {
      clothingSpendMonthly: 100,
      electronicsSpendMonthly: 50,
      buysSecondHand: false,
      recycles: true,
    };
    // Total: 33 * 0.85 = 28.05
    expect(calculateShoppingEmissions(data)).toBeCloseTo(28.05, 1);
  });

  it('should handle zero spending', () => {
    const data: ShoppingData = {
      clothingSpendMonthly: 0,
      electronicsSpendMonthly: 0,
      buysSecondHand: false,
      recycles: false,
    };
    expect(calculateShoppingEmissions(data)).toBe(0);
  });

  it('should throw error for negative spending', () => {
    const data: ShoppingData = {
      clothingSpendMonthly: -50,
      electronicsSpendMonthly: 0,
      buysSecondHand: false,
      recycles: false,
    };
    expect(() => calculateShoppingEmissions(data)).toThrow(
      'Shopping spend values must be non-negative'
    );
  });
});

/* ──────────────── Complete Calculation Tests ────────────────────────────── */

describe('calculateCarbonFootprint', () => {
  const defaultInput: CarbonFootprintInput = {
    transport: [{ mode: 'car', distanceKm: 20, frequencyPerWeek: 5 }],
    energy: {
      electricityKwh: 900,
      naturalGasTherms: 50,
      usesRenewable: false,
      renewablePercentage: 0,
    },
    diet: {
      dietType: 'average',
      localFoodPercentage: 0,
      reducesFoodWaste: false,
    },
    shopping: {
      clothingSpendMonthly: 100,
      electronicsSpendMonthly: 50,
      buysSecondHand: false,
      recycles: false,
    },
  };

  it('should return a breakdown with all categories', () => {
    const result = calculateCarbonFootprint(defaultInput);
    expect(result).toHaveProperty('transport');
    expect(result).toHaveProperty('energy');
    expect(result).toHaveProperty('diet');
    expect(result).toHaveProperty('shopping');
    expect(result).toHaveProperty('total');
  });

  it('should have total equal to sum of all categories', () => {
    const result = calculateCarbonFootprint(defaultInput);
    const sum = result.transport + result.energy + result.diet + result.shopping;
    expect(result.total).toBeCloseTo(sum, 0);
  });

  it('should return all non-negative values', () => {
    const result = calculateCarbonFootprint(defaultInput);
    expect(result.transport).toBeGreaterThanOrEqual(0);
    expect(result.energy).toBeGreaterThanOrEqual(0);
    expect(result.diet).toBeGreaterThanOrEqual(0);
    expect(result.shopping).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it('should round values to 2 decimal places', () => {
    const result = calculateCarbonFootprint(defaultInput);
    expect(Number(result.transport.toFixed(2))).toBe(result.transport);
    expect(Number(result.energy.toFixed(2))).toBe(result.energy);
  });
});

/* ──────────────────────── Insights Tests ─────────────────────────────────── */

describe('generateInsights', () => {
  it('should generate insight when above global average', () => {
    const breakdown = { transport: 3000, energy: 3000, diet: 2500, shopping: 500, total: 9000 };
    const insights = generateInsights(breakdown);
    expect(insights.some((i) => i.id === 'insight-above-global')).toBe(true);
  });

  it('should generate positive insight when below global average', () => {
    const breakdown = { transport: 500, energy: 500, diet: 1500, shopping: 100, total: 2600 };
    const insights = generateInsights(breakdown);
    expect(insights.some((i) => i.id === 'insight-below-global')).toBe(true);
  });

  it('should identify high transport emissions', () => {
    const breakdown = { transport: 5000, energy: 500, diet: 1500, shopping: 100, total: 7100 };
    const insights = generateInsights(breakdown);
    expect(insights.some((i) => i.id === 'insight-high-transport')).toBe(true);
  });

  it('should identify high energy emissions', () => {
    const breakdown = { transport: 500, energy: 5000, diet: 1500, shopping: 100, total: 7100 };
    const insights = generateInsights(breakdown);
    expect(insights.some((i) => i.id === 'insight-high-energy')).toBe(true);
  });

  it('should sort insights by priority', () => {
    const breakdown = { transport: 5000, energy: 5000, diet: 3000, shopping: 500, total: 13500 };
    const insights = generateInsights(breakdown);
    const priorities = insights.map((i) => i.priority);
    const highIndex = priorities.indexOf('high');
    const lowIndex = priorities.indexOf('low');
    if (highIndex !== -1 && lowIndex !== -1) {
      expect(highIndex).toBeLessThan(lowIndex);
    }
  });

  it('should return at least one insight for any breakdown', () => {
    const breakdown = { transport: 0, energy: 0, diet: 0, shopping: 0, total: 0 };
    const insights = generateInsights(breakdown);
    expect(insights.length).toBeGreaterThanOrEqual(1);
  });
});

/* ──────────────────── Utility Function Tests ─────────────────────────────── */

describe('calculatePercentages', () => {
  it('should return percentages that roughly sum to 100', () => {
    const breakdown = { transport: 1000, energy: 2000, diet: 500, shopping: 500, total: 4000 };
    const percentages = calculatePercentages(breakdown);
    const sum = Object.values(percentages).reduce((a, b) => a + b, 0);
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });

  it('should return all zeros for zero total', () => {
    const breakdown = { transport: 0, energy: 0, diet: 0, shopping: 0, total: 0 };
    const percentages = calculatePercentages(breakdown);
    expect(percentages.transport).toBe(0);
    expect(percentages.energy).toBe(0);
    expect(percentages.diet).toBe(0);
    expect(percentages.shopping).toBe(0);
  });
});

describe('formatCarbonValue', () => {
  it('should format values under 1000 as kg', () => {
    expect(formatCarbonValue(500)).toBe('500 kg CO₂e');
  });

  it('should format values over 1000 as tonnes', () => {
    expect(formatCarbonValue(2500)).toBe('2.5 tonnes CO₂e');
  });

  it('should format exactly 1000 as tonnes', () => {
    expect(formatCarbonValue(1000)).toBe('1.0 tonnes CO₂e');
  });

  it('should round small values to integers', () => {
    expect(formatCarbonValue(99.7)).toBe('100 kg CO₂e');
  });
});

describe('getEmissionRating', () => {
  it('should return Excellent for Paris-target-level emissions', () => {
    const result = getEmissionRating(2000);
    expect(result.label).toBe('Excellent');
  });

  it('should return Good for below-global-average emissions', () => {
    const result = getEmissionRating(3000);
    expect(result.label).toBe('Good');
  });

  it('should return Average for moderate emissions', () => {
    const result = getEmissionRating(5500);
    expect(result.label).toBe('Average');
  });

  it('should return High for above-average emissions', () => {
    const result = getEmissionRating(12000);
    expect(result.label).toBe('High');
  });

  it('should return Very High for extreme emissions', () => {
    const result = getEmissionRating(20000);
    expect(result.label).toBe('Very High');
  });

  it('should include a color value', () => {
    const result = getEmissionRating(5000);
    expect(result.color).toMatch(/^#[0-9a-f]{6}$/);
  });
});
