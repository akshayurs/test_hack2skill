# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ Supported       |

## Reporting a Vulnerability

If you discover a security vulnerability in CarbonWise, please report it responsibly:

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: <security@carbonwise.com>
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce the issue
5. Include your suggested fix if possible

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

## Security Measures

### HTTP Security Headers

CarbonWise implements the following security headers via `next.config.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | Restrictive policy | Prevents XSS, data injection |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |
| `Permissions-Policy` | Restrictive policy | Limits browser API access |

### Input Security

All user inputs are processed through multiple security layers:

1. **HTML Sanitization** (`sanitize.ts`): Escapes HTML entities to prevent XSS
2. **Input Validation** (`validators.ts`): Validates data types, ranges, and formats
3. **Numeric Sanitization**: Clamps numeric values within safe bounds
4. **URL Validation**: Only permits `http:` and `https:` protocols
5. **Storage Limits**: Enforces size limits on localStorage entries
6. **Secure IDs**: Uses `crypto.randomUUID()` for generating identifiers

### Data Privacy

- **No server-side data storage**: All user data is stored in the browser's localStorage
- **No tracking or analytics**: No third-party tracking scripts
- **No cookies**: The application does not set any cookies
- **No external API calls**: All calculations happen client-side
- **No PII collection**: No personal identifiable information is required

### Content Security Policy Details

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### Dependencies

- Dependencies are kept to a minimum to reduce attack surface
- `npm audit` is run regularly to check for known vulnerabilities
- No runtime dependencies beyond React, Next.js, and their requirements

## Best Practices for Contributors

1. Always sanitize user input before rendering or storing
2. Never use `dangerouslySetInnerHTML` without sanitization
3. Keep dependencies up to date with security patches
4. Run `npm audit` before submitting pull requests
5. Follow the principle of least privilege for all features
6. Use TypeScript strict mode to catch potential issues at compile time
