/**
 * Carbon footprint calculation engine.
 *
 * Provides pure functions for calculating carbon emissions across different
 * categories (transport, energy, diet, shopping). All calculations are based
 * on peer-reviewed emission factors and produce results in kg CO2 equivalent.
 *
 * @module carbonCalculations
 * @version 1.0.0
 * @see {@link https://www.epa.gov/ghgemissions/overview-greenhouse-gases} EPA GHG Overview
 */

import type {
  TransportData,
  EnergyData,
  DietData,
  ShoppingData,
  CarbonFootprintInput,
  CarbonBreakdown,
  Insight,
} from '@/types';

import {
  TRANSPORT_EMISSION_FACTORS,
  ELECTRICITY_EMISSION_FACTOR,
  NATURAL_GAS_EMISSION_FACTOR,
  DIET_EMISSION_FACTORS,
  CLOTHING_EMISSION_FACTOR,
  ELECTRONICS_EMISSION_FACTOR,
  SECOND_HAND_REDUCTION_FACTOR,
  RECYCLING_REDUCTION_FACTOR,
  MAX_LOCAL_FOOD_REDUCTION,
  FOOD_WASTE_REDUCTION,
  INSIGHT_THRESHOLDS,
  INSIGHT_SAVINGS_RATES,
  WEEKS_PER_YEAR,
  MONTHS_PER_YEAR,
  REFERENCE_FOOTPRINTS,
} from './constants';

/**
 * Rounds a number to two decimal places for consistent emission reporting.
 *
 * @param value - The value to round
 * @returns The value rounded to two decimals
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates annual carbon emissions from transportation in kg CO2e.
 *
 * Formula: emission_factor × distance_km × frequency_per_week × 52 weeks
 *
 * @param transportEntries - Array of transport data entries
 * @returns Annual transport emissions in kg CO2e
 * @throws {Error} If distance or frequency is negative
 *
 * @example
 * ```typescript
 * const emissions = calculateTransportEmissions([
 *   { mode: 'car', distanceKm: 20, frequencyPerWeek: 5 },
 *   { mode: 'train', distanceKm: 50, frequencyPerWeek: 2 },
 * ]);
 * // Returns: 20 * 0.21 * 5 * 52 + 50 * 0.041 * 2 * 52 = 1304.8
 * ```
 */
export function calculateTransportEmissions(transportEntries: TransportData[]): number {
  if (!Array.isArray(transportEntries)) {
    return 0;
  }

  return transportEntries.reduce((total, entry) => {
    if (entry.distanceKm < 0 || entry.frequencyPerWeek < 0) {
      throw new Error(
        `Invalid transport data: distance (${entry.distanceKm}) and frequency (${entry.frequencyPerWeek}) must be non-negative`
      );
    }

    const emissionFactor = TRANSPORT_EMISSION_FACTORS[entry.mode] ?? 0;
    const annualEmissions = emissionFactor * entry.distanceKm * entry.frequencyPerWeek * WEEKS_PER_YEAR;

    return total + annualEmissions;
  }, 0);
}

/**
 * Calculates annual carbon emissions from household energy use in kg CO2e.
 *
 * Accounts for renewable energy usage by reducing emissions proportionally.
 *
 * @param energyData - Household energy consumption data
 * @returns Annual energy emissions in kg CO2e
 * @throws {Error} If energy values are negative
 *
 * @example
 * ```typescript
 * const emissions = calculateEnergyEmissions({
 *   electricityKwh: 900,
 *   naturalGasTherms: 50,
 *   usesRenewable: true,
 *   renewablePercentage: 30,
 * });
 * ```
 */
export function calculateEnergyEmissions(energyData: EnergyData): number {
  if (energyData.electricityKwh < 0 || energyData.naturalGasTherms < 0) {
    throw new Error('Energy consumption values must be non-negative');
  }

  if (energyData.renewablePercentage < 0 || energyData.renewablePercentage > 100) {
    throw new Error('Renewable percentage must be between 0 and 100');
  }

  // Calculate monthly emissions and annualize
  const electricityEmissions = energyData.electricityKwh * ELECTRICITY_EMISSION_FACTOR * MONTHS_PER_YEAR;
  const gasEmissions = energyData.naturalGasTherms * NATURAL_GAS_EMISSION_FACTOR * MONTHS_PER_YEAR;

  // Apply renewable energy reduction to electricity only
  const renewableReduction = energyData.usesRenewable
    ? 1 - energyData.renewablePercentage / 100
    : 1;

  return electricityEmissions * renewableReduction + gasEmissions;
}

/**
 * Calculates annual carbon emissions from dietary habits in kg CO2e.
 *
 * Adjusts base diet emissions based on local food sourcing and food waste reduction.
 *
 * @param dietData - Dietary habit data
 * @returns Annual diet emissions in kg CO2e
 *
 * @example
 * ```typescript
 * const emissions = calculateDietEmissions({
 *   dietType: 'vegetarian',
 *   localFoodPercentage: 50,
 *   reducesFoodWaste: true,
 * });
 * ```
 */
export function calculateDietEmissions(dietData: DietData): number {
  if (dietData.localFoodPercentage < 0 || dietData.localFoodPercentage > 100) {
    throw new Error('Local food percentage must be between 0 and 100');
  }

  let emissions = DIET_EMISSION_FACTORS[dietData.dietType] ?? DIET_EMISSION_FACTORS.average;

  // Local food reduces transport-related food emissions (up to 10% reduction)
  const localFoodReduction = (dietData.localFoodPercentage / 100) * MAX_LOCAL_FOOD_REDUCTION;
  emissions *= 1 - localFoodReduction;

  // Food waste reduction saves approximately 8% of diet emissions
  if (dietData.reducesFoodWaste) {
    emissions *= 1 - FOOD_WASTE_REDUCTION;
  }

  return emissions;
}

/**
 * Calculates annual carbon emissions from shopping habits in kg CO2e.
 *
 * @param shoppingData - Shopping and consumption data
 * @returns Annual shopping emissions in kg CO2e
 *
 * @example
 * ```typescript
 * const emissions = calculateShoppingEmissions({
 *   clothingSpendMonthly: 100,
 *   electronicsSpendMonthly: 50,
 *   buysSecondHand: true,
 *   recycles: true,
 * });
 * ```
 */
export function calculateShoppingEmissions(shoppingData: ShoppingData): number {
  if (shoppingData.clothingSpendMonthly < 0 || shoppingData.electronicsSpendMonthly < 0) {
    throw new Error('Shopping spend values must be non-negative');
  }

  let clothingEmissions = shoppingData.clothingSpendMonthly * CLOTHING_EMISSION_FACTOR * MONTHS_PER_YEAR;
  let electronicsEmissions = shoppingData.electronicsSpendMonthly * ELECTRONICS_EMISSION_FACTOR * MONTHS_PER_YEAR;

  // Buying second-hand significantly reduces embedded emissions
  if (shoppingData.buysSecondHand) {
    clothingEmissions *= 1 - SECOND_HAND_REDUCTION_FACTOR;
    electronicsEmissions *= 1 - SECOND_HAND_REDUCTION_FACTOR;
  }

  let totalEmissions = clothingEmissions + electronicsEmissions;

  // Recycling provides additional emission reduction
  if (shoppingData.recycles) {
    totalEmissions *= 1 - RECYCLING_REDUCTION_FACTOR;
  }

  return totalEmissions;
}

/**
 * Calculates the complete carbon footprint breakdown from all input categories.
 *
 * This is the main calculation function that combines all category emissions
 * into a comprehensive breakdown with rounded values.
 *
 * @param input - Complete carbon footprint input data
 * @returns Breakdown of emissions by category and total
 *
 * @example
 * ```typescript
 * const breakdown = calculateCarbonFootprint({
 *   transport: [{ mode: 'car', distanceKm: 30, frequencyPerWeek: 5 }],
 *   energy: { electricityKwh: 900, naturalGasTherms: 50, usesRenewable: false, renewablePercentage: 0 },
 *   diet: { dietType: 'average', localFoodPercentage: 20, reducesFoodWaste: false },
 *   shopping: { clothingSpendMonthly: 100, electronicsSpendMonthly: 50, buysSecondHand: false, recycles: true },
 * });
 * ```
 */
export function calculateCarbonFootprint(input: CarbonFootprintInput): CarbonBreakdown {
  const transport = calculateTransportEmissions(input.transport);
  const energy = calculateEnergyEmissions(input.energy);
  const diet = calculateDietEmissions(input.diet);
  const shopping = calculateShoppingEmissions(input.shopping);

  const total = transport + energy + diet + shopping;

  return {
    transport: roundToTwoDecimals(transport),
    energy: roundToTwoDecimals(energy),
    diet: roundToTwoDecimals(diet),
    shopping: roundToTwoDecimals(shopping),
    total: roundToTwoDecimals(total),
  };
}

/**
 * Generates personalized insights based on the user's carbon footprint breakdown.
 *
 * Analyzes each emission category and provides actionable recommendations
 * prioritized by potential impact.
 *
 * @param breakdown - The user's carbon footprint breakdown
 * @returns Array of personalized insights sorted by priority
 */
export function generateInsights(breakdown: CarbonBreakdown): Insight[] {
  const insights: Insight[] = [];

  // Overall comparison insight
  if (breakdown.total > REFERENCE_FOOTPRINTS.global_average) {
    insights.push({
      id: 'insight-above-global',
      title: 'Above Global Average',
      message: `Your carbon footprint of ${breakdown.total.toLocaleString()} kg CO2e/year is above the global average of ${REFERENCE_FOOTPRINTS.global_average.toLocaleString()} kg. Focus on your highest-emission categories for the biggest impact.`,
      category: 'general',
      priority: 'high',
      potentialSavings: breakdown.total - REFERENCE_FOOTPRINTS.global_average,
    });
  } else {
    insights.push({
      id: 'insight-below-global',
      title: 'Below Global Average! 🎉',
      message: `Great job! Your carbon footprint of ${breakdown.total.toLocaleString()} kg CO2e/year is below the global average of ${REFERENCE_FOOTPRINTS.global_average.toLocaleString()} kg. Keep up the good work!`,
      category: 'general',
      priority: 'low',
      potentialSavings: 0,
    });
  }

  // Transport-specific insights
  if (breakdown.transport > INSIGHT_THRESHOLDS.transport) {
    insights.push({
      id: 'insight-high-transport',
      title: 'High Transport Emissions',
      message: 'Your transport emissions are significant. Consider switching to public transit, carpooling, or cycling for shorter trips. Even replacing 2 car trips per week with alternatives can save over 500 kg CO2e annually.',
      category: 'transport',
      priority: 'high',
      potentialSavings: breakdown.transport * INSIGHT_SAVINGS_RATES.transport,
    });
  }

  // Energy-specific insights
  if (breakdown.energy > INSIGHT_THRESHOLDS.energy) {
    insights.push({
      id: 'insight-high-energy',
      title: 'High Energy Consumption',
      message: 'Your home energy use generates significant emissions. Consider improving insulation, switching to LED lighting, and exploring renewable energy options. A smart thermostat alone can reduce energy use by 10-15%.',
      category: 'energy',
      priority: 'high',
      potentialSavings: breakdown.energy * INSIGHT_SAVINGS_RATES.energy,
    });
  }

  // Diet-specific insights
  if (breakdown.diet > INSIGHT_THRESHOLDS.diet) {
    insights.push({
      id: 'insight-high-diet',
      title: 'Diet Has High Impact',
      message: 'Your dietary choices contribute significantly to your footprint. Try incorporating more plant-based meals — even one meatless day per week can reduce diet emissions by about 15%.',
      category: 'diet',
      priority: 'medium',
      potentialSavings: breakdown.diet * INSIGHT_SAVINGS_RATES.diet,
    });
  }

  // Shopping insights
  if (breakdown.shopping > INSIGHT_THRESHOLDS.shopping) {
    insights.push({
      id: 'insight-high-shopping',
      title: 'Shopping Footprint',
      message: 'Your consumption habits contribute to your carbon footprint. Consider buying second-hand, choosing durable products, and repairing items instead of replacing them.',
      category: 'shopping',
      priority: 'medium',
      potentialSavings: breakdown.shopping * INSIGHT_SAVINGS_RATES.shopping,
    });
  }

  // Paris Agreement target comparison
  if (breakdown.total > REFERENCE_FOOTPRINTS.paris_target) {
    insights.push({
      id: 'insight-paris-target',
      title: 'Paris Agreement Goal',
      message: `To meet the Paris Agreement\'s 1.5°C target, individual footprints need to reach ${REFERENCE_FOOTPRINTS.paris_target.toLocaleString()} kg CO2e/year by 2030. You need to reduce by ${(breakdown.total - REFERENCE_FOOTPRINTS.paris_target).toLocaleString()} kg.`,
      category: 'general',
      priority: 'medium',
      potentialSavings: breakdown.total - REFERENCE_FOOTPRINTS.paris_target,
    });
  }

  // Sort by priority: high > medium > low
  const priorityOrder: Record<Insight['priority'], number> = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights;
}

/**
 * Calculates the percentage breakdown of emissions by category.
 *
 * @param breakdown - Carbon footprint breakdown
 * @returns Object with percentage values for each category
 */
export function calculatePercentages(breakdown: CarbonBreakdown): Record<string, number> {
  if (breakdown.total === 0) {
    return { transport: 0, energy: 0, diet: 0, shopping: 0 };
  }

  return {
    transport: Math.round((breakdown.transport / breakdown.total) * 100),
    energy: Math.round((breakdown.energy / breakdown.total) * 100),
    diet: Math.round((breakdown.diet / breakdown.total) * 100),
    shopping: Math.round((breakdown.shopping / breakdown.total) * 100),
  };
}

/**
 * Formats a carbon value with appropriate units for display.
 *
 * @param kgCO2e - Value in kg CO2e
 * @returns Formatted string with appropriate unit (kg or tonnes)
 */
export function formatCarbonValue(kgCO2e: number): string {
  if (kgCO2e >= 1000) {
    return `${(kgCO2e / 1000).toFixed(1)} tonnes CO₂e`;
  }
  return `${Math.round(kgCO2e)} kg CO₂e`;
}

/**
 * Determines the emission rating category based on total annual emissions.
 *
 * @param totalKgCO2e - Total annual emissions in kg CO2e
 * @returns Rating object with label, color, and description
 */
export function getEmissionRating(totalKgCO2e: number): {
  label: string;
  color: string;
  description: string;
} {
  if (totalKgCO2e <= REFERENCE_FOOTPRINTS.paris_target) {
    return {
      label: 'Excellent',
      color: '#10b981',
      description: 'Your footprint aligns with climate goals!',
    };
  }
  if (totalKgCO2e <= REFERENCE_FOOTPRINTS.global_average) {
    return {
      label: 'Good',
      color: '#3b82f6',
      description: 'Below global average — keep improving!',
    };
  }
  if (totalKgCO2e <= REFERENCE_FOOTPRINTS.eu_average) {
    return {
      label: 'Average',
      color: '#f59e0b',
      description: 'Room for improvement in key areas.',
    };
  }
  if (totalKgCO2e <= REFERENCE_FOOTPRINTS.us_average) {
    return {
      label: 'High',
      color: '#ef4444',
      description: 'Significant reductions are possible.',
    };
  }
  return {
    label: 'Very High',
    color: '#dc2626',
    description: 'Major lifestyle changes recommended.',
  };
}
