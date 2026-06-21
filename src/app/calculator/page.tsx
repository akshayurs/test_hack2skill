/**
 * Carbon Footprint Calculator page.
 *
 * Interactive form allowing users to input their transportation, energy,
 * diet, and shopping habits to calculate their annual carbon footprint.
 *
 * @module CalculatorPage
 * @version 1.0.0
 */

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarbonCalculator from '@/components/calculator/CarbonCalculator';

export const metadata: Metadata = {
  title: 'Carbon Footprint Calculator',
  description:
    'Calculate your annual carbon footprint based on your transportation, energy, diet, and shopping habits. Powered by EPA and IPCC emission factors.',
};

/**
 * Calculator page component.
 *
 * @returns The calculator page with form and results
 */
export default function CalculatorPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content" role="main" aria-label="Carbon footprint calculator">
        <div className="container page-wrapper">
          <div className="page-header">
            <h1 id="calculator-heading">Carbon Footprint Calculator</h1>
            <p>
              Enter your habits below to estimate your annual carbon emissions.
              All calculations use peer-reviewed emission factors from EPA and IPCC.
            </p>
          </div>

          <CarbonCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
