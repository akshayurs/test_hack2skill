/**
 * Unit tests for the ActionCard component.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionCard from '@/components/actions/ActionCard';
import type { CarbonAction } from '@/types';

const action: CarbonAction = {
  id: 'action-test',
  title: 'Bike to Work',
  description: 'Replace your car commute with cycling.',
  category: 'transport',
  estimatedSavingsKgPerYear: 1500,
  difficulty: 'medium',
  completed: false,
  icon: '🚲',
};

describe('ActionCard', () => {
  it('renders title, capitalized difficulty, and savings', () => {
    render(<ActionCard action={action} onToggle={jest.fn()} />);
    expect(screen.getByText('Bike to Work')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText(/1,500 kg/)).toBeInTheDocument();
  });

  it('exposes its completion state via aria-checked', () => {
    render(<ActionCard action={{ ...action, completed: true }} onToggle={jest.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles on click', async () => {
    const onToggle = jest.fn();
    render(<ActionCard action={action} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('action-test');
  });

  it('toggles on keyboard activation', async () => {
    const onToggle = jest.fn();
    render(<ActionCard action={action} onToggle={onToggle} />);
    screen.getByRole('checkbox').focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
