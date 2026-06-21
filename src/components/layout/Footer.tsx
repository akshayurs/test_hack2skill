/**
 * Footer component with accessible links and copyright.
 *
 * @module Footer
 * @version 1.0.0
 * @accessibility Semantic footer element with proper role
 */

import React from 'react';

/**
 * Application footer with copyright and attribution.
 *
 * @returns Footer element with copyright information
 */
export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" id="site-footer">
      <div className="footer__inner">
        <p className="footer__text">
          🌱 Built with care for our planet
        </p>
        <p className="footer__text">
          © {currentYear} CarbonWise. All emission factors sourced from EPA &amp; IPCC.
        </p>
        <p className="footer__text">
          <a
            href="https://www.epa.gov/ghgemissions"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EPA Greenhouse Gas Emissions data (opens in new tab)"
            id="footer-epa-link"
          >
            EPA Data
          </a>
          {' · '}
          <a
            href="https://www.ipcc.ch/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="IPCC Climate Reports (opens in new tab)"
            id="footer-ipcc-link"
          >
            IPCC Reports
          </a>
        </p>
      </div>
    </footer>
  );
}
