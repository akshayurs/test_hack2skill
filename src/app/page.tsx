/**
 * Home page for CarbonWise application.
 *
 * Serves as the landing page with hero section, feature highlights,
 * and calls to action for the carbon calculator and dashboard.
 *
 * @module HomePage
 * @version 1.0.0
 */

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { REFERENCE_FOOTPRINTS } from '@/lib/constants';

/**
 * Landing page component with hero, features, and CTA sections.
 *
 * @returns The home page with all sections
 */
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Header />

      <main id="main-content" role="main" aria-label="CarbonWise home page">
        <div className="container">
          {/* ─── Hero Section ─── */}
          <section className="hero" aria-labelledby="hero-heading" id="hero-section">
            <span className="hero__badge" role="status">
              🌍 Join the climate action movement
            </span>

            <h1 id="hero-heading">
              Understand Your{' '}
              <span className="gradient-text">Carbon Footprint</span>
            </h1>

            <p className="hero__subtitle">
              CarbonWise helps you track, understand, and reduce your environmental impact
              through personalized insights and actionable steps toward a sustainable future.
            </p>

            <div className="hero__cta">
              <Link
                href="/calculator"
                className="btn btn-primary btn-lg"
                aria-label="Calculate your carbon footprint"
                id="cta-calculator"
              >
                🧮 Calculate Footprint
              </Link>
              <Link
                href="/dashboard"
                className="btn btn-outline btn-lg"
                aria-label="View your carbon dashboard"
                id="cta-dashboard"
              >
                📊 View Dashboard
              </Link>
            </div>
          </section>

          {/* ─── Features Section ─── */}
          <section className="features" aria-labelledby="features-heading" id="features-section">
            <div className="section-heading">
              <h2 id="features-heading">How CarbonWise Helps You</h2>
              <p>Simple tools for meaningful environmental impact</p>
            </div>

            <div className="grid grid-3">
              <article className="card feature-card animate-fade-in stagger-1" id="feature-calculate">
                <span className="feature-card__icon" aria-hidden="true">🧮</span>
                <h3>Calculate</h3>
                <p>
                  Estimate your annual carbon footprint across transportation, energy,
                  diet, and shopping with our science-backed calculator using EPA and IPCC data.
                </p>
              </article>

              <article className="card feature-card animate-fade-in stagger-2" id="feature-track">
                <span className="feature-card__icon" aria-hidden="true">📈</span>
                <h3>Track Progress</h3>
                <p>
                  Log your footprint over time and visualize your progress with interactive
                  charts. See exactly where your emissions come from and how they change.
                </p>
              </article>

              <article className="card feature-card animate-fade-in stagger-3" id="feature-reduce">
                <span className="feature-card__icon" aria-hidden="true">🎯</span>
                <h3>Take Action</h3>
                <p>
                  Get personalized reduction tips and commit to actionable steps.
                  Track your commitments and see their cumulative impact on your footprint.
                </p>
              </article>
            </div>
          </section>

          {/* ─── Impact Stats Section ─── */}
          <section className="features" aria-labelledby="impact-heading" id="impact-section">
            <div className="section-heading">
              <h2 id="impact-heading">Global Carbon Footprint Context</h2>
              <p>Understanding where we stand and where we need to be</p>
            </div>

            <div className="grid grid-4">
              <article className="card stat-card animate-fade-in" id="stat-global-avg">
                <span className="stat-card__icon" aria-hidden="true">🌍</span>
                <span className="stat-card__label">Global Average</span>
                <span className="stat-card__value">
                  {(REFERENCE_FOOTPRINTS.global_average / 1000).toFixed(1)}
                  <span className="stat-card__unit">tonnes CO₂e/yr</span>
                </span>
              </article>

              <article className="card stat-card animate-fade-in stagger-1" id="stat-us-avg">
                <span className="stat-card__icon" aria-hidden="true">🇺🇸</span>
                <span className="stat-card__label">US Average</span>
                <span className="stat-card__value">
                  {(REFERENCE_FOOTPRINTS.us_average / 1000).toFixed(0)}
                  <span className="stat-card__unit">tonnes CO₂e/yr</span>
                </span>
              </article>

              <article className="card stat-card animate-fade-in stagger-2" id="stat-eu-avg">
                <span className="stat-card__icon" aria-hidden="true">🇪🇺</span>
                <span className="stat-card__label">EU Average</span>
                <span className="stat-card__value">
                  {(REFERENCE_FOOTPRINTS.eu_average / 1000).toFixed(1)}
                  <span className="stat-card__unit">tonnes CO₂e/yr</span>
                </span>
              </article>

              <article className="card stat-card animate-fade-in stagger-3" id="stat-paris-target">
                <span className="stat-card__icon" aria-hidden="true">🎯</span>
                <span className="stat-card__label">2030 Paris Target</span>
                <span className="stat-card__value">
                  {(REFERENCE_FOOTPRINTS.paris_target / 1000).toFixed(1)}
                  <span className="stat-card__unit">tonnes CO₂e/yr</span>
                </span>
              </article>
            </div>
          </section>

          {/* ─── CTA Section ─── */}
          <section
            className="hero"
            aria-labelledby="cta-section-heading"
            id="cta-section"
            style={{ paddingTop: '2rem' }}
          >
            <h2 id="cta-section-heading">Ready to Make a Difference?</h2>
            <p className="hero__subtitle">
              Start by calculating your carbon footprint. It takes just 5 minutes
              and gives you a clear picture of your environmental impact.
            </p>
            <div className="hero__cta">
              <Link
                href="/calculator"
                className="btn btn-primary btn-lg"
                aria-label="Start calculating your carbon footprint now"
                id="cta-start-now"
              >
                Get Started Now →
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
