/**
 * Unit tests for the InsightCard component.
 */

import { render, screen } from '@testing-library/react';
import InsightCard from '@/components/insights/InsightCard';
import type { Insight } from '@/types';

const baseInsight: Insight = {
  id: 'insight-1',
  title: 'High Transport Emissions',
  message: 'Consider public transit.',
  category: 'transport',
  priority: 'high',
  potentialSavings: 600,
};

describe('InsightCard', () => {
  it('renders title and message with a priority-aware label', () => {
    render(<InsightCard insight={baseInsight} />);
    expect(screen.getByText('High Transport Emissions')).toBeInTheDocument();
    expect(screen.getByLabelText(/high priority insight/i)).toBeInTheDocument();
  });

  it('shows potential savings when positive', () => {
    render(<InsightCard insight={baseInsight} />);
    expect(screen.getByText(/Potential savings/)).toBeInTheDocument();
  });

  it('hides potential savings when zero', () => {
    render(<InsightCard insight={{ ...baseInsight, potentialSavings: 0 }} />);
    expect(screen.queryByText(/Potential savings/)).not.toBeInTheDocument();
  });
});
