/**
 * Smoke tests for the application route pages.
 */

import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import CalculatorPage from '@/app/calculator/page';
import DashboardPage from '@/app/dashboard/page';
import InsightsPage from '@/app/insights/page';
import ActionsPage from '@/app/actions/page';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('Route pages', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders the home page with hero and CTAs', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Understand Your/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Calculate your carbon footprint/i })).toBeInTheDocument();
  });

  it('renders the calculator page', () => {
    render(<CalculatorPage />);
    expect(screen.getByRole('heading', { name: /Carbon Footprint Calculator/i })).toBeInTheDocument();
  });

  it('renders the dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Your Carbon Dashboard/i })).toBeInTheDocument();
  });

  it('renders the insights page', () => {
    render(<InsightsPage />);
    expect(screen.getByRole('heading', { name: /Personalized Insights/i })).toBeInTheDocument();
  });

  it('renders the actions page', () => {
    render(<ActionsPage />);
    expect(screen.getByRole('heading', { name: /Carbon Reduction Actions/i })).toBeInTheDocument();
  });
});
