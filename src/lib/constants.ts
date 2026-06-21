/**
 * Application constants for the CarbonWise carbon footprint calculator.
 *
 * All emission factors are sourced from:
 * - EPA Greenhouse Gas Equivalencies Calculator
 * - IPCC AR6 emission factors
 * - World Resources Institute data
 *
 * @module constants
 * @version 1.0.0
 */

import type { TransportMode, DietType, CarbonAction } from '@/types';

/* ──────────────────── Transport Emission Factors ─────────────────────────── */

/**
 * Carbon emission factors for different transport modes in kg CO2e per km.
 * Sources: EPA, DEFRA 2023 emission factor database.
 */
export const TRANSPORT_EMISSION_FACTORS: Readonly<Record<TransportMode, number>> = {
  car: 0.21,           // Average passenger car (gasoline)
  electric_car: 0.05,  // Electric vehicle (grid average)
  bus: 0.089,          // Public bus per passenger
  train: 0.041,        // Rail per passenger
  airplane: 0.255,     // Domestic flight per passenger-km
  motorcycle: 0.113,   // Motorcycle average
  bicycle: 0.0,        // Zero emissions
  walking: 0.0,        // Zero emissions
} as const;

/**
 * Human-readable labels for transport modes.
 */
export const TRANSPORT_MODE_LABELS: Readonly<Record<TransportMode, string>> = {
  car: 'Car (Gasoline)',
  electric_car: 'Electric Car',
  bus: 'Public Bus',
  train: 'Train / Metro',
  airplane: 'Airplane',
  motorcycle: 'Motorcycle',
  bicycle: 'Bicycle',
  walking: 'Walking',
} as const;

/* ───────────────────── Energy Emission Factors ───────────────────────────── */

/**
 * Carbon emission factor for electricity in kg CO2e per kWh.
 * Based on US grid average (EPA eGRID 2022).
 */
export const ELECTRICITY_EMISSION_FACTOR = 0.417; // kg CO2e per kWh

/**
 * Carbon emission factor for natural gas in kg CO2e per therm.
 * Source: EPA Emission Factors Hub.
 */
export const NATURAL_GAS_EMISSION_FACTOR = 5.3; // kg CO2e per therm

/* ──────────────────────── Diet Emission Factors ──────────────────────────── */

/**
 * Annual diet-related carbon emissions by diet type in kg CO2e per year.
 * Sources: Poore & Nemecek (2018), Science.
 */
export const DIET_EMISSION_FACTORS: Readonly<Record<DietType, number>> = {
  meat_heavy: 3300,    // High meat consumption
  average: 2500,       // Average omnivore diet
  pescatarian: 1900,   // Fish but no meat
  vegetarian: 1700,    // No meat or fish
  vegan: 1500,         // Plant-based only
} as const;

/**
 * Human-readable labels for diet types.
 */
export const DIET_TYPE_LABELS: Readonly<Record<DietType, string>> = {
  meat_heavy: 'Meat Heavy',
  average: 'Average Omnivore',
  pescatarian: 'Pescatarian',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
} as const;

/* ──────────────────── Shopping Emission Factors ──────────────────────────── */

/**
 * Carbon emission factor for clothing purchases in kg CO2e per USD spent.
 * Source: Quantis World Apparel LCA (2018).
 */
export const CLOTHING_EMISSION_FACTOR = 0.02; // kg CO2e per USD

/**
 * Carbon emission factor for electronics purchases in kg CO2e per USD spent.
 * Source: ICT sector lifecycle analyses.
 */
export const ELECTRONICS_EMISSION_FACTOR = 0.015; // kg CO2e per USD

/**
 * Reduction factor for buying second-hand items.
 */
export const SECOND_HAND_REDUCTION_FACTOR = 0.7; // 70% reduction

/**
 * Reduction factor for active recycling behavior.
 */
export const RECYCLING_REDUCTION_FACTOR = 0.15; // 15% reduction

/* ──────────────────── Diet Adjustment Factors ────────────────────────────── */

/**
 * Maximum diet emission reduction achievable through fully local food sourcing.
 * Local food reduces transport-related food emissions by up to 10%.
 */
export const MAX_LOCAL_FOOD_REDUCTION = 0.1;

/**
 * Diet emission reduction from actively minimizing food waste (~8%).
 */
export const FOOD_WASTE_REDUCTION = 0.08;

/* ──────────────────── Insight Generation Thresholds ──────────────────────── */

/**
 * Per-category emission thresholds (kg CO2e/year) above which a high-impact
 * insight is generated for that category.
 */
export const INSIGHT_THRESHOLDS = {
  transport: 2000,
  energy: 3000,
  diet: 2500,
  shopping: 300,
} as const;

/**
 * Estimated fraction of a category's emissions that can realistically be saved
 * by acting on the corresponding insight.
 */
export const INSIGHT_SAVINGS_RATES = {
  transport: 0.3,
  energy: 0.25,
  diet: 0.15,
  shopping: 0.4,
} as const;

/* ──────────────────── Carbon Category Visualization ──────────────────────── */

/**
 * Emission categories shared across calculations and visualizations.
 */
export const CARBON_CATEGORIES = ['transport', 'energy', 'diet', 'shopping'] as const;

/**
 * Display colors for each emission category, used by charts and comparison bars.
 */
export const CATEGORY_COLORS: Readonly<Record<(typeof CARBON_CATEGORIES)[number], string>> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  diet: '#10b981',
  shopping: '#8b5cf6',
} as const;

/**
 * Human-readable labels for each emission category.
 */
export const CATEGORY_LABELS: Readonly<Record<(typeof CARBON_CATEGORIES)[number], string>> = {
  transport: 'Transport',
  energy: 'Energy',
  diet: 'Diet',
  shopping: 'Shopping',
} as const;

/* ──────────────────────── Reference Values ───────────────────────────────── */

/**
 * Global and regional average carbon footprints for comparison (kg CO2e/year).
 */
export const REFERENCE_FOOTPRINTS = {
  global_average: 4700,
  us_average: 16000,
  eu_average: 6800,
  india_average: 1900,
  china_average: 7400,
  paris_target: 2300,  // 2030 target to limit warming to 1.5°C
} as const;

/**
 * Weeks per year, used to annualize weekly transport data.
 */
export const WEEKS_PER_YEAR = 52;

/**
 * Months per year, used to annualize monthly spending data.
 */
export const MONTHS_PER_YEAR = 12;

/* ──────────────────────── Predefined Actions ─────────────────────────────── */

/**
 * Curated list of carbon reduction actions users can take.
 * Each action includes estimated annual savings based on peer-reviewed data.
 */
export const CARBON_ACTIONS: CarbonAction[] = [
  {
    id: 'action-bike-commute',
    title: 'Bike to Work',
    description: 'Replace your car commute with cycling for distances under 10km. This not only reduces emissions but improves your health and saves money on fuel.',
    category: 'transport',
    estimatedSavingsKgPerYear: 1500,
    difficulty: 'medium',
    completed: false,
    icon: '🚲',
  },
  {
    id: 'action-public-transit',
    title: 'Use Public Transit',
    description: 'Switch from driving alone to using buses, trains, or metro systems. Public transit produces significantly fewer emissions per passenger-kilometer.',
    category: 'transport',
    estimatedSavingsKgPerYear: 2400,
    difficulty: 'easy',
    completed: false,
    icon: '🚆',
  },
  {
    id: 'action-carpool',
    title: 'Start Carpooling',
    description: 'Share your ride with colleagues or neighbors. Carpooling with just one other person cuts your per-person transport emissions in half.',
    category: 'transport',
    estimatedSavingsKgPerYear: 1000,
    difficulty: 'easy',
    completed: false,
    icon: '🚗',
  },
  {
    id: 'action-led-lighting',
    title: 'Switch to LED Lighting',
    description: 'Replace all incandescent and CFL bulbs with LED alternatives. LEDs use 75% less energy and last 25 times longer.',
    category: 'energy',
    estimatedSavingsKgPerYear: 200,
    difficulty: 'easy',
    completed: false,
    icon: '💡',
  },
  {
    id: 'action-thermostat',
    title: 'Smart Thermostat',
    description: 'Install a programmable thermostat and reduce heating/cooling by 2°C. This simple change can save up to 10% on your energy bill.',
    category: 'energy',
    estimatedSavingsKgPerYear: 500,
    difficulty: 'easy',
    completed: false,
    icon: '🌡️',
  },
  {
    id: 'action-renewable-energy',
    title: 'Switch to Renewable Energy',
    description: 'Choose a green energy provider or install solar panels. Renewable energy eliminates the carbon footprint of your electricity consumption.',
    category: 'energy',
    estimatedSavingsKgPerYear: 3000,
    difficulty: 'hard',
    completed: false,
    icon: '☀️',
  },
  {
    id: 'action-reduce-meat',
    title: 'Reduce Meat Consumption',
    description: 'Adopt "Meatless Mondays" or reduce meat intake by 50%. Animal agriculture is responsible for 14.5% of global greenhouse gas emissions.',
    category: 'diet',
    estimatedSavingsKgPerYear: 800,
    difficulty: 'medium',
    completed: false,
    icon: '🥗',
  },
  {
    id: 'action-local-food',
    title: 'Buy Local & Seasonal Food',
    description: 'Shop at farmers markets and choose seasonal produce. Local food travels shorter distances and often uses fewer resources.',
    category: 'diet',
    estimatedSavingsKgPerYear: 400,
    difficulty: 'easy',
    completed: false,
    icon: '🌽',
  },
  {
    id: 'action-reduce-food-waste',
    title: 'Minimize Food Waste',
    description: 'Plan meals, use leftovers, and compost organic waste. Food waste in landfills produces methane, a potent greenhouse gas.',
    category: 'diet',
    estimatedSavingsKgPerYear: 300,
    difficulty: 'easy',
    completed: false,
    icon: '♻️',
  },
  {
    id: 'action-secondhand',
    title: 'Buy Second-Hand',
    description: 'Purchase clothing, furniture, and electronics second-hand. This extends product lifecycles and reduces manufacturing emissions.',
    category: 'shopping',
    estimatedSavingsKgPerYear: 350,
    difficulty: 'easy',
    completed: false,
    icon: '🏷️',
  },
  {
    id: 'action-minimalism',
    title: 'Practice Minimalism',
    description: 'Buy less, choose quality over quantity, and repair instead of replacing. Every product has an embedded carbon footprint from manufacturing.',
    category: 'shopping',
    estimatedSavingsKgPerYear: 500,
    difficulty: 'medium',
    completed: false,
    icon: '✨',
  },
  {
    id: 'action-plant-trees',
    title: 'Plant Trees',
    description: 'Plant trees in your community or support reforestation projects. A single tree absorbs approximately 22 kg of CO2 per year.',
    category: 'lifestyle',
    estimatedSavingsKgPerYear: 22,
    difficulty: 'easy',
    completed: false,
    icon: '🌳',
  },
];

/* ─────────────────────── Application Constants ──────────────────────────── */

/**
 * Maximum number of log entries to retain in local storage.
 * Prevents excessive storage usage.
 */
export const MAX_LOG_ENTRIES = 365;

/**
 * Application metadata.
 */
export const APP_CONFIG = {
  name: 'CarbonWise',
  version: '1.0.0',
  description: 'Track, understand, and reduce your carbon footprint',
  author: 'CarbonWise Team',
  repository: 'https://github.com/carbonwise/app',
} as const;

/**
 * Navigation items for the application header.
 */
export const NAV_ITEMS = [
  { href: '/', label: 'Home', ariaLabel: 'Go to home page' },
  { href: '/calculator', label: 'Calculator', ariaLabel: 'Open carbon footprint calculator' },
  { href: '/dashboard', label: 'Dashboard', ariaLabel: 'View your carbon dashboard' },
  { href: '/insights', label: 'Insights', ariaLabel: 'View personalized insights' },
  { href: '/actions', label: 'Actions', ariaLabel: 'Browse carbon reduction actions' },
] as const;
