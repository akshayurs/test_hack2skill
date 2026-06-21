/**
 * Unit tests for the DashboardContent component.
 */

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardContent from '@/components/dashboard/DashboardContent';
import type { CarbonFootprintInput, CarbonLogEntry } from '@/types';

jest.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));

const POPULATED: CarbonFootprintInput = {
  transport: [{ mode: 'car', distanceKm: 30, frequencyPerWeek: 5 }],
  energy: { electricityKwh: 900, naturalGasTherms: 50, usesRenewable: false, renewablePercentage: 0 },
  diet: { dietType: 'average', localFoodPercentage: 20, reducesFoodWaste: false },
  shopping: { clothingSpendMonthly: 100, electronicsSpendMonthly: 50, buysSecondHand: false, recycles: true },
};

describe('DashboardContent', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders dashboard stats for the default-diet baseline footprint', () => {
    render(<DashboardContent />);
    expect(screen.getByText('Total Footprint')).toBeInTheDocument();
  });

  it('renders stats, comparison bars, and log history', async () => {
    const entry: CarbonLogEntry = {
      id: 'log-1',
      date: new Date('2026-01-01').toISOString(),
      breakdown: { transport: 1000, energy: 2000, diet: 1500, shopping: 500, total: 5000 },
      notes: 'first entry',
    };
    act(() => {
      window.localStorage.setItem('carbonwise-input', JSON.stringify(POPULATED));
      window.localStorage.setItem('carbonwise-log', JSON.stringify([entry]));
    });

    render(<DashboardContent />);
    expect(screen.getByText('Total Footprint')).toBeInTheDocument();
    expect(screen.getByText('How You Compare')).toBeInTheDocument();
    expect(screen.getByText('Tracking History')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Delete log entry/i }));
    expect(screen.queryByText('Tracking History')).not.toBeInTheDocument();
  });
});
