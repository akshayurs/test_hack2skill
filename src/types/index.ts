/**
 * Core type definitions for the CarbonWise carbon footprint tracking application.
 *
 * This module defines all TypeScript interfaces and types used throughout the
 * application, ensuring type safety and consistent data structures.
 *
 * @module types
 * @version 1.0.0
 */

/* ─────────────────────────── Carbon Calculation Types ─────────────────────── */

/**
 * Transportation modes supported by the carbon calculator.
 * Each mode has a different carbon emission factor (kg CO2e per km).
 */
export type TransportMode = 'car' | 'bus' | 'train' | 'bicycle' | 'walking' | 'airplane' | 'motorcycle' | 'electric_car';

/**
 * Dietary preference categories that affect carbon footprint calculations.
 * Based on peer-reviewed environmental impact studies.
 */
export type DietType = 'meat_heavy' | 'average' | 'pescatarian' | 'vegetarian' | 'vegan';

/**
 * Home energy source types for emission calculations.
 */
export type EnergySource = 'electricity' | 'natural_gas' | 'solar' | 'wind' | 'coal' | 'oil';

/**
 * Represents transportation data entered by the user for carbon calculations.
 */
export interface TransportData {
  /** The mode of transportation used */
  readonly mode: TransportMode;
  /** Distance traveled in kilometers (must be non-negative) */
  readonly distanceKm: number;
  /** Frequency of this transport usage per week */
  readonly frequencyPerWeek: number;
}

/**
 * Represents household energy consumption data for carbon calculations.
 */
export interface EnergyData {
  /** Monthly electricity consumption in kilowatt-hours */
  readonly electricityKwh: number;
  /** Monthly natural gas consumption in therms */
  readonly naturalGasTherms: number;
  /** Whether the household uses renewable energy sources */
  readonly usesRenewable: boolean;
  /** Percentage of energy from renewable sources (0-100) */
  readonly renewablePercentage: number;
}

/**
 * Represents dietary habits for carbon footprint estimation.
 */
export interface DietData {
  /** The user's primary dietary preference */
  readonly dietType: DietType;
  /** How often the user eats locally sourced food (0-100 percentage) */
  readonly localFoodPercentage: number;
  /** Whether the user actively reduces food waste */
  readonly reducesFoodWaste: boolean;
}

/**
 * Represents shopping and consumption habits.
 */
export interface ShoppingData {
  /** Monthly spending on new clothing items in USD */
  readonly clothingSpendMonthly: number;
  /** Monthly spending on electronics in USD */
  readonly electronicsSpendMonthly: number;
  /** Whether the user buys second-hand items regularly */
  readonly buysSecondHand: boolean;
  /** Whether the user actively recycles */
  readonly recycles: boolean;
}

/**
 * Complete carbon footprint input data combining all categories.
 */
export interface CarbonFootprintInput {
  readonly transport: TransportData[];
  readonly energy: EnergyData;
  readonly diet: DietData;
  readonly shopping: ShoppingData;
}

/**
 * Breakdown of carbon emissions by category in kg CO2 equivalent per year.
 */
export interface CarbonBreakdown {
  /** Transport emissions in kg CO2e/year */
  readonly transport: number;
  /** Energy/home emissions in kg CO2e/year */
  readonly energy: number;
  /** Diet-related emissions in kg CO2e/year */
  readonly diet: number;
  /** Shopping/consumption emissions in kg CO2e/year */
  readonly shopping: number;
  /** Total emissions in kg CO2e/year */
  readonly total: number;
}

/* ──────────────────────────── Tracking Types ──────────────────────────────── */

/**
 * Represents a single carbon footprint log entry with timestamp.
 */
export interface CarbonLogEntry {
  /** Unique identifier for the log entry */
  readonly id: string;
  /** ISO 8601 date string when the entry was created */
  readonly date: string;
  /** Detailed breakdown of emissions */
  readonly breakdown: CarbonBreakdown;
  /** Optional notes from the user */
  readonly notes?: string;
}

/**
 * Represents a carbon reduction action that users can take.
 */
export interface CarbonAction {
  /** Unique identifier for the action */
  readonly id: string;
  /** Human-readable title of the action */
  readonly title: string;
  /** Detailed description of the action and its impact */
  readonly description: string;
  /** Category the action belongs to */
  readonly category: 'transport' | 'energy' | 'diet' | 'shopping' | 'lifestyle';
  /** Estimated CO2 savings in kg per year if the action is adopted */
  readonly estimatedSavingsKgPerYear: number;
  /** Difficulty level of adopting this action */
  readonly difficulty: 'easy' | 'medium' | 'hard';
  /** Whether the user has committed to this action */
  completed: boolean;
  /** Icon identifier for UI display */
  readonly icon: string;
}

/* ───────────────────────────── Insight Types ─────────────────────────────── */

/**
 * Represents a personalized insight generated from the user's data.
 */
export interface Insight {
  /** Unique identifier */
  readonly id: string;
  /** Insight title */
  readonly title: string;
  /** Detailed insight message */
  readonly message: string;
  /** Category of the insight */
  readonly category: 'transport' | 'energy' | 'diet' | 'shopping' | 'general';
  /** Priority level for display ordering */
  readonly priority: 'high' | 'medium' | 'low';
  /** Potential savings if the insight is acted upon (kg CO2e/year) */
  readonly potentialSavings: number;
}

/* ────────────────────────── User Profile Types ───────────────────────────── */

/**
 * User profile data stored locally for personalization.
 */
export interface UserProfile {
  /** User's display name */
  readonly name: string;
  /** Country/region for location-specific calculations */
  readonly country: string;
  /** Household size for per-capita calculations */
  readonly householdSize: number;
  /** Date the profile was created (ISO 8601) */
  readonly createdAt: string;
  /** Date the profile was last updated (ISO 8601) */
  readonly updatedAt: string;
}

/* ──────────────────────── Chart / Visualization Types ────────────────────── */

/**
 * Data point for time-series chart visualization.
 */
export interface ChartDataPoint {
  /** Label for the x-axis (e.g., month name) */
  readonly label: string;
  /** Value for the y-axis (kg CO2e) */
  readonly value: number;
}

/**
 * Configuration for chart components.
 */
export interface ChartConfig {
  /** Chart title */
  readonly title: string;
  /** Label for the x-axis */
  readonly xAxisLabel: string;
  /** Label for the y-axis */
  readonly yAxisLabel: string;
  /** Color scheme for the chart */
  readonly colorScheme: readonly string[];
}

/* ──────────────────────── Component Prop Types ───────────────────────────── */

/**
 * Props for the StatCard component displaying a single metric.
 */
export interface StatCardProps {
  /** Title of the statistic */
  readonly title: string;
  /** Value to display (numbers are locale-formatted; strings render as-is) */
  readonly value: number | string;
  /** Unit of measurement (e.g., "kg CO2e") */
  readonly unit: string;
  /** Optional icon identifier */
  readonly icon?: string;
  /** Trend direction compared to previous period */
  readonly trend?: 'up' | 'down' | 'neutral';
  /** Percentage change from previous period */
  readonly trendPercentage?: number;
  /** Accessible description for screen readers */
  readonly ariaLabel?: string;
}

/**
 * Form validation error structure.
 */
export interface ValidationError {
  /** Field name that has the error */
  readonly field: string;
  /** Human-readable error message */
  readonly message: string;
}

/**
 * API response wrapper for consistent error handling.
 */
export interface ApiResponse<T> {
  /** Whether the operation was successful */
  readonly success: boolean;
  /** Response data (present on success) */
  readonly data?: T;
  /** Error message (present on failure) */
  readonly error?: string;
  /** Timestamp of the response */
  readonly timestamp: string;
}
