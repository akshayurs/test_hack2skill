/**
 * Header component with responsive navigation.
 *
 * Implements:
 * - Accessible navigation with ARIA landmarks
 * - Mobile hamburger menu with keyboard support
 * - Active link highlighting
 * - Sticky positioning with glassmorphism backdrop
 *
 * @module Header
 * @version 1.0.0
 * @accessibility WCAG 2.1 AA compliant navigation
 */

'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

/**
 * Main application header with responsive navigation.
 *
 * @returns Header element with logo and navigation links
 */
export default function Header(): React.JSX.Element {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggles the mobile navigation menu.
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Closes the mobile menu when a link is clicked.
   */
  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Handles keyboard interaction for the mobile menu toggle.
   */
  const handleToggleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMobileMenu();
      }
    },
    [toggleMobileMenu]
  );

  return (
    <header className="header" role="banner" id="site-header">
      <div className="header__inner">
        {/* Logo / Home Link */}
        <Link
          href="/"
          className="header__logo"
          aria-label="CarbonWise – Go to homepage"
          id="header-logo"
        >
          <span className="header__logo-icon" aria-hidden="true">🌱</span>
          <span className="header__logo-text">CarbonWise</span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
          onKeyDown={handleToggleKeyDown}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          id="mobile-menu-toggle"
          type="button"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Main Navigation */}
        <nav
          className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
          id="main-navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                onClick={handleLinkClick}
                id={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
