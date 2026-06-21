/**
 * Unit tests for the InsightsContent component.
 */

import { act, render, screen } from '@testing-library/react';
import InsightsContent from '@/components/insights/InsightsContent';
import type { CarbonFootprintInput } from '@/types';

const POPULATED: CarbonFootprintInput = {
  transport: [{ mode: 'car', distanceKm: 40, frequencyPerWeek: 7 }],
  energy: { electricityKwh: 1200, naturalGasTherms: 80, usesRenewable: false, renewablePercentage: 0 },
  diet: { dietType: 'meat_heavy', localFoodPercentage: 0, reducesFoodWaste: false },
  shopping: { clothingSpendMonthly: 300, electronicsSpendMonthly: 200, buysSecondHand: false, recycles: false },
};

describe('InsightsContent', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders insights for the default-diet baseline footprint', () => {
    render(<InsightsContent />);
    expect(screen.getByRole('region', { name: /insights list/i })).toBeInTheDocument();
  });

  it('renders insights once data exists', () => {
    act(() => {
      window.localStorage.setItem('carbonwise-input', JSON.stringify(POPULATED));
    });
    render(<InsightsContent />);
    expect(screen.getByRole('region', { name: /insights list/i })).toBeInTheDocument();
    expect(screen.getByText(/Take Action Now/)).toBeInTheDocument();
  });
});
