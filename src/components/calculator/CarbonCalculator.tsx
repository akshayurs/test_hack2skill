/**
 * CarbonCalculator – Interactive carbon footprint calculator form.
 *
 * Orchestrates the four input sections (transport, energy, diet, shopping),
 * derives a live breakdown, and renders the results panel. Each section is a
 * focused child component; this component owns only state and composition.
 *
 * @module CarbonCalculator
 * @version 1.0.0
 * @accessibility Full keyboard navigation, ARIA labels, form validation
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { TransportData, EnergyData, DietData, ShoppingData, TransportMode, CarbonBreakdown } from '@/types';
import { calculateCarbonFootprint, getEmissionRating } from '@/lib/carbonCalculations';
import { sanitizeNumber } from '@/lib/sanitize';
import { useCarbonData } from '@/hooks/useCarbonData';
import TransportSection from './sections/TransportSection';
import EnergySection from './sections/EnergySection';
import DietSection from './sections/DietSection';
import ShoppingSection from './sections/ShoppingSection';
import CalculatorResults from './sections/CalculatorResults';

/**
 * Interactive carbon footprint calculator with real-time results.
 *
 * @returns Calculator form with live results display
 */
export default function CarbonCalculator(): React.JSX.Element {
  const { saveToLog } = useCarbonData();

  const [transportEntries, setTransportEntries] = useState<TransportData[]>([
    { mode: 'car', distanceKm: 0, frequencyPerWeek: 0 },
  ]);

  const [energy, setEnergy] = useState<EnergyData>({
    electricityKwh: 0,
    naturalGasTherms: 0,
    usesRenewable: false,
    renewablePercentage: 0,
  });

  const [diet, setDiet] = useState<DietData>({
    dietType: 'average',
    localFoodPercentage: 20,
    reducesFoodWaste: false,
  });

  const [shopping, setShopping] = useState<ShoppingData>({
    clothingSpendMonthly: 0,
    electronicsSpendMonthly: 0,
    buysSecondHand: false,
    recycles: false,
  });

  const [showResults, setShowResults] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const breakdown: CarbonBreakdown = useMemo(
    () => calculateCarbonFootprint({ transport: transportEntries, energy, diet, shopping }),
    [transportEntries, energy, diet, shopping]
  );

  const rating = useMemo(() => getEmissionRating(breakdown.total), [breakdown.total]);

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

  const handleCalculate = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setShowResults(true);
    setIsSaved(false);
  }, []);

  const handleSaveToLog = useCallback(() => {
    saveToLog('Calculated from carbon calculator', breakdown);
    setIsSaved(true);
  }, [saveToLog, breakdown]);

  return (
    <form
      onSubmit={handleCalculate}
      aria-label="Carbon footprint calculator form"
      id="calculator-form"
      noValidate
    >
      <TransportSection
        entries={transportEntries}
        onAdd={addTransportEntry}
        onRemove={removeTransportEntry}
        onUpdate={updateTransportEntry}
      />
      <EnergySection energy={energy} setEnergy={setEnergy} />
      <DietSection diet={diet} setDiet={setDiet} />
      <ShoppingSection shopping={shopping} setShopping={setShopping} />

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

      {showResults && (
        <CalculatorResults
          breakdown={breakdown}
          rating={rating}
          isSaved={isSaved}
          onSave={handleSaveToLog}
        />
      )}
    </form>
  );
}
