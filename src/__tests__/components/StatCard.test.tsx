/**
 * Unit tests for the StatCard component.
 */

import { render, screen } from '@testing-library/react';
import StatCard from '@/components/dashboard/StatCard';

describe('StatCard', () => {
  it('renders a numeric value with locale formatting and unit', () => {
    render(<StatCard title="Total Footprint" value={12345} unit="kg" icon="🌍" />);
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText(/kg/)).toBeInTheDocument();
  });

  it('renders a string value verbatim', () => {
    render(<StatCard title="Rating" value="Excellent" unit="" />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('uses an explicit aria-label when provided', () => {
    render(<StatCard title="X" value={1} unit="kg" ariaLabel="custom label" />);
    expect(screen.getByLabelText('custom label')).toBeInTheDocument();
  });

  it('renders an upward trend indicator', () => {
    render(<StatCard title="X" value={1} unit="kg" trend="up" trendPercentage={12} />);
    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByLabelText('Increased by 12%')).toBeInTheDocument();
  });

  it('renders a downward trend indicator', () => {
    render(<StatCard title="X" value={1} unit="kg" trend="down" trendPercentage={8} />);
    expect(screen.getByLabelText('Decreased by 8%')).toBeInTheDocument();
  });
});
