/**
 * Unit tests for the CarbonChart donut chart component.
 */

import { render, screen } from '@testing-library/react';
import CarbonChart from '@/components/dashboard/CarbonChart';
import type { CarbonBreakdown } from '@/types';

const BREAKDOWN: CarbonBreakdown = {
  transport: 1000, energy: 2000, diet: 1500, shopping: 500, total: 5000,
};

const EMPTY: CarbonBreakdown = {
  transport: 0, energy: 0, diet: 0, shopping: 0, total: 0,
};

describe('CarbonChart', () => {
  it('renders an accessible chart with category percentages', () => {
    render(<CarbonChart breakdown={BREAKDOWN} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('aria-label', expect.stringContaining('Transport'));
    expect(screen.getByText(/Transport \(20%\)/)).toBeInTheDocument();
  });

  it('renders no segments when the total is zero', () => {
    render(<CarbonChart breakdown={EMPTY} />);
    expect(screen.queryByText(/Transport \(/)).not.toBeInTheDocument();
  });

  it('formats the center value in tonnes above 1000 kg', () => {
    render(<CarbonChart breakdown={BREAKDOWN} />);
    expect(screen.getByText('5.0t')).toBeInTheDocument();
  });

  it('honors a custom size prop', () => {
    render(<CarbonChart breakdown={BREAKDOWN} size={300} />);
    expect(screen.getByRole('img')).toHaveAttribute('width', '300');
  });
});
