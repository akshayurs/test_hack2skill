/**
 * Jest setup file for extending test matchers.
 *
 * Adds custom DOM matchers from @testing-library/jest-dom
 * for more expressive assertions in component tests.
 */

import '@testing-library/jest-dom';

/**
 * jsdom does not implement navigation, so clicking an anchor (including Next.js
 * <Link>) logs "Not implemented: navigation". Suppress real navigation in tests
 * by preventing the default action on any in-page anchor click.
 */
beforeAll(() => {
  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement | null)?.closest('a');
    if (anchor?.getAttribute('href')) {
      event.preventDefault();
    }
  });
});
