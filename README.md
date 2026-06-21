# CarbonWise 🌱

> A comprehensive web application that helps individuals understand, track, and reduce their carbon footprint through personalized insights and actionable recommendations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Jest-red.svg)](./jest.config.ts)
[![WCAG 2.1](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-brightgreen.svg)](#accessibility)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Security](#security)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 🌍 Overview

CarbonWise addresses the growing need for individuals to understand and reduce their environmental impact. Climate change requires collective action, and CarbonWise empowers users with:

- **Science-backed calculations** using EPA and IPCC emission factors
- **Personalized insights** tailored to individual habits
- **Actionable steps** with estimated CO₂ savings
- **Progress tracking** over time with visual dashboards

### Problem Statement

Most people don't know the size or composition of their carbon footprint. CarbonWise bridges this knowledge gap by providing an intuitive interface for calculating, tracking, and reducing personal carbon emissions across four key categories: transportation, energy, diet, and shopping.

## ✨ Features

### 🧮 Carbon Footprint Calculator
- Multi-category calculator covering **transportation**, **home energy**, **diet**, and **shopping**
- Support for 8 transportation modes with accurate per-km emission factors
- 5 dietary patterns from meat-heavy to vegan
- Real-time calculation with instant visual feedback
- Donut chart visualization of emission breakdown

### 📊 Interactive Dashboard
- Summary statistics with trend indicators
- SVG donut chart showing emission category breakdown
- Comparison bars against global averages and Paris Agreement targets
- Historical tracking log with date-stamped entries

### 💡 Personalized Insights
- AI-generated recommendations based on your specific footprint
- Priority-ranked insights (high/medium/low)
- Quantified potential savings for each recommendation
- Category-specific actionable advice

### 🎯 Action Tracker
- 12 curated carbon reduction actions across 5 categories
- Toggle-based commitment tracking
- Difficulty ratings (easy/medium/hard)
- Estimated annual CO₂ savings per action
- Category filtering and progress visualization

### 🔒 Security Features
- Content Security Policy (CSP) headers
- XSS prevention via input sanitization
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Input validation on all user inputs
- Safe URL validation
- No external API dependencies (all data stays local)

### ♿ Accessibility (WCAG 2.1 AA)
- Skip navigation link
- Semantic HTML with ARIA landmarks
- Keyboard-navigable interface
- Screen reader optimized with aria-labels
- Color contrast ratios meeting WCAG AA
- Reduced motion support (`prefers-reduced-motion`)
- Minimum 44×44px touch targets
- Focus-visible indicators

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                   Next.js App                 │
│              (App Router, SSR/SSG)            │
├──────────────────────────────────────────────┤
│  Pages (Server Components)                    │
│  ├── Home (Landing Page)                      │
│  ├── Calculator (Carbon Footprint Form)       │
│  ├── Dashboard (Charts & Stats)               │
│  ├── Insights (Personalized Recommendations)  │
│  └── Actions (Reduction Commitments)          │
├──────────────────────────────────────────────┤
│  Client Components                            │
│  ├── CarbonCalculator (Interactive Form)      │
│  ├── CarbonChart (SVG Donut Chart)            │
│  ├── StatCard (Metric Display)                │
│  ├── InsightCard (Recommendation Card)        │
│  └── ActionCard (Toggle Commitment)           │
├──────────────────────────────────────────────┤
│  Custom Hooks                                 │
│  ├── useCarbonData (State Management)         │
│  └── useLocalStorage (Persistent Storage)     │
├──────────────────────────────────────────────┤
│  Library (Pure Functions)                     │
│  ├── carbonCalculations (Emission Engine)     │
│  ├── validators (Input Validation)            │
│  ├── sanitize (XSS Prevention)               │
│  └── constants (Emission Factors & Config)    │
├──────────────────────────────────────────────┤
│  TypeScript Types (Strict Type Safety)        │
└──────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Sanitization → Validation → Calculation → Visualization
                                              ↓
                                    localStorage (Persistence)
                                              ↓
                                    Insights Generation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/carbonwise.git
cd carbonwise

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# → http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Design system & global styles
│   ├── calculator/
│   │   └── page.tsx            # Calculator page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard page
│   ├── insights/
│   │   └── page.tsx            # Insights page
│   └── actions/
│       └── page.tsx            # Actions page
├── components/                 # React components
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Page footer
│   ├── calculator/
│   │   └── CarbonCalculator.tsx # Calculator form
│   ├── dashboard/
│   │   ├── CarbonChart.tsx     # SVG donut chart
│   │   ├── DashboardContent.tsx # Dashboard client content
│   │   └── StatCard.tsx        # Statistic card
│   ├── insights/
│   │   ├── InsightCard.tsx     # Insight display card
│   │   └── InsightsContent.tsx # Insights client content
│   └── actions/
│       ├── ActionCard.tsx      # Action toggle card
│       └── ActionsContent.tsx  # Actions client content
├── hooks/                      # Custom React hooks
│   ├── useCarbonData.ts        # Carbon data state management
│   └── useLocalStorage.ts      # Type-safe localStorage hook
├── lib/                        # Pure utility functions
│   ├── carbonCalculations.ts   # Emission calculation engine
│   ├── constants.ts            # Emission factors & app config
│   ├── sanitize.ts             # Input sanitization (XSS prevention)
│   └── validators.ts           # Input validation
├── types/
│   └── index.ts                # TypeScript type definitions
└── __tests__/                  # Test suite
    └── lib/
        ├── carbonCalculations.test.ts
        ├── sanitize.test.ts
        └── validators.test.ts
```

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 15 | Server-side rendering, routing, security headers |
| **Language** | TypeScript 5 | Type safety, IDE support, refactoring confidence |
| **Styling** | CSS (Vanilla) | Custom design system with CSS custom properties |
| **State** | React Hooks | Component state + custom hooks |
| **Storage** | localStorage | Client-side data persistence |
| **Testing** | Jest + Testing Library | Unit & component testing |
| **Linting** | ESLint | Code quality enforcement |
| **Security** | Custom middleware | CSP, HSTS, sanitization |

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- carbonCalculations
```

### Test Coverage

The test suite covers:

- **Carbon Calculations**: 40+ tests covering all emission categories, edge cases, error handling
- **Input Sanitization**: 25+ tests for XSS prevention, URL validation, numeric sanitization
- **Input Validation**: 20+ tests for all form inputs with boundary values

### Testing Strategy

| Layer | Testing Approach | Tools |
|-------|-----------------|-------|
| Pure Functions | Unit tests with edge cases | Jest |
| Hooks | Integration tests | React Testing Library |
| Components | Render & interaction tests | RTL + jest-dom |
| Calculations | Mathematical verification | Jest assertions |

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for our security policy.

### Security Measures Implemented

1. **Content Security Policy (CSP)** – Restricts script, style, and resource origins
2. **HTTP Strict Transport Security (HSTS)** – Enforces HTTPS connections
3. **X-Frame-Options: DENY** – Prevents clickjacking attacks
4. **X-Content-Type-Options: nosniff** – Prevents MIME type sniffing
5. **X-XSS-Protection** – Legacy XSS protection header
6. **Referrer-Policy** – Controls referrer information leakage
7. **Permissions-Policy** – Restricts browser API access
8. **Input Sanitization** – HTML entity escaping for all user inputs
9. **Input Validation** – Server-side validation with detailed error messages
10. **URL Sanitization** – Only allows http/https protocols
11. **Storage Size Limits** – Prevents localStorage abuse
12. **Secure ID Generation** – Uses crypto.randomUUID() when available

## ♿ Accessibility

CarbonWise is built to WCAG 2.1 AA standards:

- **Semantic HTML**: Proper use of `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- **ARIA Landmarks**: `role="banner"`, `role="main"`, `role="navigation"`, `role="contentinfo"`
- **Skip Navigation**: "Skip to main content" link for keyboard users
- **Focus Management**: Visible focus indicators with `:focus-visible`
- **Screen Reader Support**: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: All text meets WCAG AA contrast ratios (4.5:1 minimum)
- **Touch Targets**: Minimum 44×44px for all interactive elements
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Form Labels**: All inputs have associated `<label>` elements
- **Error Messages**: Validation errors linked via `aria-invalid` and `aria-describedby`
- **Chart Alternatives**: SVG charts include text alternatives for screen readers

## ⚡ Performance

- **Server Components**: Pages use RSC where possible to reduce client JavaScript
- **Memoization**: `useMemo` for expensive calculations, `useCallback` for handlers
- **Code Splitting**: Automatic per-page code splitting via Next.js
- **CSS Custom Properties**: Efficient theme system without runtime JS
- **Pure SVG Charts**: No heavy charting library dependencies
- **Lazy State Initialization**: `useState` with initializer functions
- **Storage Size Limits**: Prevents localStorage from growing unbounded
- **Zero External API Calls**: All calculations happen client-side

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## 📚 Data Sources

All emission factors are sourced from peer-reviewed scientific data:

- **EPA** – [Greenhouse Gas Equivalencies Calculator](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator)
- **IPCC AR6** – [Sixth Assessment Report](https://www.ipcc.ch/assessment-report/ar6/)
- **DEFRA** – [UK Government Emission Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023)
- **Poore & Nemecek (2018)** – [Reducing food's environmental impacts through producers and consumers](https://science.sciencemag.org/content/360/6392/987)

---

Built with 💚 for our planet | CarbonWise © 2024
# test_hack2skill
