/**
 * Unit tests for the CarbonCalculator component.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarbonCalculator from '@/components/calculator/CarbonCalculator';

describe('CarbonCalculator', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders all four input sections', () => {
    render(<CarbonCalculator />);
    expect(screen.getByText(/Transportation/)).toBeInTheDocument();
    expect(screen.getByText(/Home Energy/)).toBeInTheDocument();
    expect(screen.getByText(/Diet & Food/)).toBeInTheDocument();
    expect(screen.getByText(/Shopping & Consumption/)).toBeInTheDocument();
  });

  it('adds and removes transport entries', async () => {
    render(<CarbonCalculator />);
    expect(screen.getAllByLabelText(/Transportation mode for entry/i)).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: /Add another transportation entry/i }));
    expect(screen.getAllByLabelText(/Transportation mode for entry/i)).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: /Remove transport entry 2/i }));
    expect(screen.getAllByLabelText(/Transportation mode for entry/i)).toHaveLength(1);
  });

  it('reveals the renewable slider only when renewable energy is enabled', async () => {
    render(<CarbonCalculator />);
    expect(screen.queryByLabelText(/Renewable energy percentage/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/I use renewable energy sources/i));
    expect(screen.getByLabelText(/Renewable energy percentage/i)).toBeInTheDocument();
  });

  it('updates every input category and recalculates', async () => {
    render(<CarbonCalculator />);

    await userEvent.selectOptions(screen.getByLabelText(/Transportation mode for entry 1/i), 'train');
    expect((screen.getByLabelText(/Transportation mode for entry 1/i) as HTMLSelectElement).value).toBe('train');

    await userEvent.type(screen.getByLabelText(/Monthly electricity/i), '900');
    await userEvent.type(screen.getByLabelText(/Monthly natural gas/i), '50');

    await userEvent.selectOptions(screen.getByLabelText(/Select your diet type/i), 'vegan');
    await userEvent.click(screen.getByLabelText(/I actively reduce food waste/i));

    await userEvent.type(screen.getByLabelText(/spending on clothing/i), '120');
    await userEvent.type(screen.getByLabelText(/spending on electronics/i), '80');
    await userEvent.click(screen.getByLabelText(/buy second-hand/i));
    await userEvent.click(screen.getByLabelText(/I actively recycle/i));

    await userEvent.click(screen.getByRole('button', { name: /Calculate my carbon footprint/i }));
    expect(screen.getByText('per year')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('adjusts the renewable and local-food range sliders', async () => {
    render(<CarbonCalculator />);
    await userEvent.click(screen.getByLabelText(/I use renewable energy sources/i));

    const renewable = screen.getByLabelText(/Renewable energy percentage/i);
    fireEvent.change(renewable, { target: { value: '50' } });
    expect((renewable as HTMLInputElement).value).toBe('50');

    const localFood = screen.getByLabelText(/Local food percentage/i);
    fireEvent.change(localFood, { target: { value: '40' } });
    expect((localFood as HTMLInputElement).value).toBe('40');
  });

  it('shows results and saves a non-zero footprint to the log', async () => {
    render(<CarbonCalculator />);
    await userEvent.type(screen.getByLabelText(/Distance in kilometers/i), '30');
    await userEvent.type(screen.getByLabelText(/Frequency per week/i), '5');
    await userEvent.click(screen.getByRole('button', { name: /Calculate my carbon footprint/i }));

    expect(screen.getByText('per year')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Save these results/i }));
    expect(screen.getByText(/Saved to Log/)).toBeInTheDocument();

    const log = JSON.parse(window.localStorage.getItem('carbonwise-log') ?? '[]');
    expect(log).toHaveLength(1);
    expect(log[0].breakdown.total).toBeGreaterThan(0);
  });
});
