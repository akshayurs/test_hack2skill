/**
 * Dashboard page for visualizing carbon footprint data and tracking progress.
 *
 * @module DashboardPage
 * @version 1.0.0
 */

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'View your carbon footprint breakdown, track your progress over time, and see how you compare to global averages.',
};

/**
 * Dashboard page component.
 *
 * @returns Dashboard page with charts and stats
 */
export default function DashboardPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content" role="main" aria-label="Carbon footprint dashboard">
        <div className="container page-wrapper">
          <div className="page-header">
            <h1 id="dashboard-heading">Your Carbon Dashboard</h1>
            <p>
              Track your environmental impact and monitor your progress toward a sustainable footprint.
            </p>
          </div>

          <DashboardContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
