/**
 * Input validation utilities for the CarbonWise application.
 *
 * Provides comprehensive validation functions for all user inputs
 * to ensure data integrity and prevent invalid state.
 *
 * @module validators
 * @version 1.0.0
 */

import type {
  TransportData,
  EnergyData,
  DietData,
  ShoppingData,
  CarbonFootprintInput,
  ValidationError,
} from '@/types';

import { TRANSPORT_EMISSION_FACTORS, DIET_EMISSION_FACTORS } from './constants';

/**
 * Validates a single transport data entry.
 *
 * @param entry - Transport data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateTransportEntry(entry: Partial<TransportData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!entry.mode || !(entry.mode in TRANSPORT_EMISSION_FACTORS)) {
    errors.push({
      field: 'mode',
      message: 'Please select a valid transport mode',
    });
  }

  if (entry.distanceKm === undefined || entry.distanceKm === null) {
    errors.push({
      field: 'distanceKm',
      message: 'Distance is required',
    });
  } else if (typeof entry.distanceKm !== 'number' || entry.distanceKm < 0) {
    errors.push({
      field: 'distanceKm',
      message: 'Distance must be a non-negative number',
    });
  } else if (entry.distanceKm > 50000) {
    errors.push({
      field: 'distanceKm',
      message: 'Distance exceeds maximum allowed value (50,000 km)',
    });
  }

  if (entry.frequencyPerWeek === undefined || entry.frequencyPerWeek === null) {
    errors.push({
      field: 'frequencyPerWeek',
      message: 'Frequency is required',
    });
  } else if (typeof entry.frequencyPerWeek !== 'number' || entry.frequencyPerWeek < 0) {
    errors.push({
      field: 'frequencyPerWeek',
      message: 'Frequency must be a non-negative number',
    });
  } else if (entry.frequencyPerWeek > 100) {
    errors.push({
      field: 'frequencyPerWeek',
      message: 'Frequency exceeds maximum allowed value (100 per week)',
    });
  }

  return errors;
}

/**
 * Validates energy consumption data.
 *
 * @param data - Energy data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateEnergyData(data: Partial<EnergyData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.electricityKwh === undefined || data.electricityKwh === null) {
    errors.push({
      field: 'electricityKwh',
      message: 'Monthly electricity usage is required',
    });
  } else if (typeof data.electricityKwh !== 'number' || data.electricityKwh < 0) {
    errors.push({
      field: 'electricityKwh',
      message: 'Electricity usage must be a non-negative number',
    });
  } else if (data.electricityKwh > 100000) {
    errors.push({
      field: 'electricityKwh',
      message: 'Electricity usage exceeds maximum allowed value',
    });
  }

  if (data.naturalGasTherms === undefined || data.naturalGasTherms === null) {
    errors.push({
      field: 'naturalGasTherms',
      message: 'Monthly natural gas usage is required',
    });
  } else if (typeof data.naturalGasTherms !== 'number' || data.naturalGasTherms < 0) {
    errors.push({
      field: 'naturalGasTherms',
      message: 'Natural gas usage must be a non-negative number',
    });
  }

  if (data.renewablePercentage !== undefined && data.renewablePercentage !== null) {
    if (typeof data.renewablePercentage !== 'number' || data.renewablePercentage < 0 || data.renewablePercentage > 100) {
      errors.push({
        field: 'renewablePercentage',
        message: 'Renewable percentage must be between 0 and 100',
      });
    }
  }

  return errors;
}

/**
 * Validates dietary habit data.
 *
 * @param data - Diet data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateDietData(data: Partial<DietData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.dietType || !(data.dietType in DIET_EMISSION_FACTORS)) {
    errors.push({
      field: 'dietType',
      message: 'Please select a valid diet type',
    });
  }

  if (data.localFoodPercentage !== undefined && data.localFoodPercentage !== null) {
    if (typeof data.localFoodPercentage !== 'number' || data.localFoodPercentage < 0 || data.localFoodPercentage > 100) {
      errors.push({
        field: 'localFoodPercentage',
        message: 'Local food percentage must be between 0 and 100',
      });
    }
  }

  return errors;
}

/**
 * Validates shopping habit data.
 *
 * @param data - Shopping data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateShoppingData(data: Partial<ShoppingData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.clothingSpendMonthly !== undefined && data.clothingSpendMonthly !== null) {
    if (typeof data.clothingSpendMonthly !== 'number' || data.clothingSpendMonthly < 0) {
      errors.push({
        field: 'clothingSpendMonthly',
        message: 'Clothing spend must be a non-negative number',
      });
    } else if (data.clothingSpendMonthly > 100000) {
      errors.push({
        field: 'clothingSpendMonthly',
        message: 'Clothing spend exceeds maximum allowed value',
      });
    }
  }

  if (data.electronicsSpendMonthly !== undefined && data.electronicsSpendMonthly !== null) {
    if (typeof data.electronicsSpendMonthly !== 'number' || data.electronicsSpendMonthly < 0) {
      errors.push({
        field: 'electronicsSpendMonthly',
        message: 'Electronics spend must be a non-negative number',
      });
    } else if (data.electronicsSpendMonthly > 100000) {
      errors.push({
        field: 'electronicsSpendMonthly',
        message: 'Electronics spend exceeds maximum allowed value',
      });
    }
  }

  return errors;
}

/**
 * Validates a complete carbon footprint input object.
 *
 * Aggregates validation errors from all sub-sections.
 *
 * @param input - Complete carbon footprint input to validate
 * @returns Object with isValid flag and array of all validation errors
 */
export function validateCarbonFootprintInput(
  input: Partial<CarbonFootprintInput>
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Validate transport entries
  if (input.transport && Array.isArray(input.transport)) {
    input.transport.forEach((entry, index) => {
      const entryErrors = validateTransportEntry(entry);
      entryErrors.forEach((error) => {
        errors.push({
          field: `transport[${index}].${error.field}`,
          message: error.message,
        });
      });
    });
  }

  // Validate energy data
  if (input.energy) {
    const energyErrors = validateEnergyData(input.energy);
    energyErrors.forEach((error) => {
      errors.push({
        field: `energy.${error.field}`,
        message: error.message,
      });
    });
  }

  // Validate diet data
  if (input.diet) {
    const dietErrors = validateDietData(input.diet);
    dietErrors.forEach((error) => {
      errors.push({
        field: `diet.${error.field}`,
        message: error.message,
      });
    });
  }

  // Validate shopping data
  if (input.shopping) {
    const shoppingErrors = validateShoppingData(input.shopping);
    shoppingErrors.forEach((error) => {
      errors.push({
        field: `shopping.${error.field}`,
        message: error.message,
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
