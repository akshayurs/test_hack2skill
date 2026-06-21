# Contributing to CarbonWise

Thank you for your interest in contributing to CarbonWise! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a welcoming and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. Create a new issue with the "Bug" template
3. Include steps to reproduce, expected behavior, and actual behavior
4. Include browser/OS information if relevant

### Suggesting Features

1. Create a new issue with the "Feature Request" template
2. Describe the use case and expected behavior
3. Explain how it aligns with the project's mission

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the code standards below
4. Write tests for new functionality
5. Run `npm test` and `npm run lint` to verify
6. Submit a pull request

## Code Standards

### TypeScript

- Use strict TypeScript with no `any` types
- Define interfaces for all data structures in `src/types/`
- Use `readonly` for immutable properties
- Add JSDoc comments to all exported functions

### React Components

- Use functional components with TypeScript
- Keep components focused and single-responsibility
- Use `useCallback` and `useMemo` for performance optimization
- Add `aria-label` and `role` attributes for accessibility

### CSS

- Use CSS custom properties defined in `globals.css`
- Follow BEM naming convention for class names
- Ensure WCAG 2.1 AA color contrast compliance
- Support `prefers-reduced-motion`

### Testing

- Write tests for all pure functions in `src/lib/`
- Include edge cases and error conditions
- Aim for 70%+ coverage on new code
- Use descriptive test names

### Security

- Always sanitize user input using `src/lib/sanitize.ts`
- Validate all inputs using `src/lib/validators.ts`
- Never use `dangerouslySetInnerHTML`
- Run `npm audit` before submitting

## Development Setup

```bash
git clone https://github.com/yourusername/carbonwise.git
cd carbonwise
npm install
npm run dev
```

## Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New features have corresponding tests
- [ ] Accessibility requirements are met
- [ ] Documentation is updated if needed
- [ ] No security vulnerabilities introduced

## Questions?

Feel free to open a Discussion on GitHub for any questions about contributing.
