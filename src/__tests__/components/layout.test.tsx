/**
 * Unit tests for the Header and Footer layout components.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Header', () => {
  it('renders all navigation links', () => {
    render(<Header />);
    expect(screen.getByText('CarbonWise')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('marks the active route with aria-current', () => {
    render(<Header />);
    const active = screen.getByRole('link', { name: /carbon dashboard/i });
    expect(active).toHaveAttribute('aria-current', 'page');
  });

  it('toggles the mobile menu via the toggle button', async () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu when a link is clicked', async () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    await userEvent.click(toggle);
    await userEvent.click(screen.getByText('Calculator'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles the mobile menu via the Enter and Space keys', async () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Footer', () => {
  it('renders the current year and source attribution links', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /EPA/i })).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
