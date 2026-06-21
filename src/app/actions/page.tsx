/**
 * Actions page for browsing and committing to carbon reduction actions.
 *
 * @module ActionsPage
 * @version 1.0.0
 */

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionsContent from '@/components/actions/ActionsContent';

export const metadata: Metadata = {
  title: 'Actions',
  description:
    'Browse curated carbon reduction actions, commit to changes, and track your impact. From easy wins to major lifestyle changes.',
};

/**
 * Actions page component.
 *
 * @returns Actions page with list of carbon reduction actions
 */
export default function ActionsPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content" role="main" aria-label="Carbon reduction actions">
        <div className="container page-wrapper">
          <div className="page-header">
            <h1 id="actions-heading">Carbon Reduction Actions</h1>
            <p>
              Browse curated actions you can take to reduce your carbon footprint.
              Toggle actions to track your commitments and see your estimated savings.
            </p>
          </div>

          <ActionsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
