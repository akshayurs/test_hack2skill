/**
 * Tests for the root layout module (metadata, viewport, and structure).
 */

import { render } from '@testing-library/react';
import RootLayout, { metadata, viewport } from '@/app/layout';

describe('RootLayout', () => {
  it('exports SEO metadata and viewport configuration', () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toContain('carbon footprint');
    expect(viewport.themeColor).toBe('#0f172a');
  });

  it('renders children and a skip-to-content link', () => {
    // Suppress the expected jsdom warning about rendering <html> within a container.
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <RootLayout>
        <main>content</main>
      </RootLayout>
    );
    expect(container.querySelector('.skip-link')).not.toBeNull();
    expect(container.textContent).toContain('Skip to main content');
    spy.mockRestore();
  });
});
