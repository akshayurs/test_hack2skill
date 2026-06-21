/**
 * Insights page for personalized carbon reduction recommendations.
 *
 * @module InsightsPage
 * @version 1.0.0
 */

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InsightsContent from '@/components/insights/InsightsContent';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Get personalized insights and recommendations to reduce your carbon footprint based on your specific habits and lifestyle.',
};

/**
 * Insights page component.
 *
 * @returns Insights page with personalized recommendations
 */
export default function InsightsPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content" role="main" aria-label="Personalized carbon reduction insights">
        <div className="container page-wrapper">
          <div className="page-header">
            <h1 id="insights-heading">Personalized Insights</h1>
            <p>
              Actionable recommendations tailored to your carbon footprint data
              to help you make the biggest impact.
            </p>
          </div>

          <InsightsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
