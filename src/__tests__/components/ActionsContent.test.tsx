/**
 * Unit tests for the ActionsContent component.
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionsContent from '@/components/actions/ActionsContent';

describe('ActionsContent', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders the action list and summary stats', () => {
    render(<ActionsContent />);
    expect(screen.getByText('Actions Taken')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: /actions list/i })).getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('filters actions by category', async () => {
    render(<ActionsContent />);
    const list = screen.getByRole('list', { name: /actions list/i });
    const before = within(list).getAllByRole('listitem').length;
    await userEvent.selectOptions(screen.getByLabelText(/filter actions/i), 'lifestyle');
    expect(within(list).getAllByRole('listitem').length).toBeLessThan(before);
  });

  it('updates progress when an action is toggled', async () => {
    render(<ActionsContent />);
    const firstAction = screen.getAllByRole('checkbox')[0];
    await userEvent.click(firstAction);
    expect(firstAction).toHaveAttribute('aria-checked', 'true');
  });
});
