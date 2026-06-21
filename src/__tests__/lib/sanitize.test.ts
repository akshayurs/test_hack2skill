/**
 * Unit tests for the input sanitization module.
 *
 * Tests XSS prevention, storage sanitization, numeric sanitization,
 * and URL validation functions.
 *
 * @module sanitize.test
 * @version 1.0.0
 */

import {
  sanitizeHtml,
  stripHtmlTags,
  sanitizeForStorage,
  sanitizeNumber,
  sanitizeUrl,
  generateSecureId,
} from '@/lib/sanitize';

describe('sanitizeHtml', () => {
  it('should escape HTML angle brackets', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).not.toContain('<script>');
    expect(sanitizeHtml('<script>alert("xss")</script>')).toContain('&lt;script&gt;');
  });

  it('should escape double quotes', () => {
    expect(sanitizeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('should escape single quotes', () => {
    expect(sanitizeHtml("it's")).toBe("it&#x27;s");
  });

  it('should escape ampersands', () => {
    expect(sanitizeHtml('a & b')).toBe('a &amp; b');
  });

  it('should escape forward slashes', () => {
    expect(sanitizeHtml('a/b')).toContain('&#x2F;');
  });

  it('should escape backticks', () => {
    expect(sanitizeHtml('`code`')).toContain('&#96;');
  });

  it('should return empty string for non-string input', () => {
    // @ts-expect-error Testing invalid input
    expect(sanitizeHtml(123)).toBe('');
    // @ts-expect-error Testing invalid input
    expect(sanitizeHtml(null)).toBe('');
    // @ts-expect-error Testing invalid input
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('should handle empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('should not modify safe strings', () => {
    expect(sanitizeHtml('Hello World 123')).toBe('Hello World 123');
  });

  it('should prevent XSS via event handlers', () => {
    const input = '<img onerror="alert(1)" src="x">';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<img');
  });
});

describe('stripHtmlTags', () => {
  it('should remove all HTML tags', () => {
    expect(stripHtmlTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
  });

  it('should handle self-closing tags', () => {
    expect(stripHtmlTags('Hello<br/>World')).toBe('HelloWorld');
  });

  it('should return empty string for non-string input', () => {
    // @ts-expect-error Testing invalid input
    expect(stripHtmlTags(null)).toBe('');
  });

  it('should handle string without tags', () => {
    expect(stripHtmlTags('plain text')).toBe('plain text');
  });
});

describe('sanitizeForStorage', () => {
  it('should remove null bytes', () => {
    expect(sanitizeForStorage('hello\0world')).toBe('helloworld');
  });

  it('should remove control characters', () => {
    expect(sanitizeForStorage('hello\x01world')).toBe('helloworld');
  });

  it('should trim whitespace', () => {
    expect(sanitizeForStorage('  hello  ')).toBe('hello');
  });

  it('should enforce maximum length', () => {
    const longString = 'a'.repeat(100);
    expect(sanitizeForStorage(longString, 50)).toHaveLength(50);
  });

  it('should use default max length of 10000', () => {
    const longString = 'a'.repeat(20000);
    expect(sanitizeForStorage(longString)).toHaveLength(10000);
  });

  it('should return empty string for non-string input', () => {
    // @ts-expect-error Testing invalid input
    expect(sanitizeForStorage(42)).toBe('');
  });
});

describe('sanitizeNumber', () => {
  it('should return the number if within bounds', () => {
    expect(sanitizeNumber(50, 0, 100)).toBe(50);
  });

  it('should clamp to minimum value', () => {
    expect(sanitizeNumber(-5, 0, 100)).toBe(0);
  });

  it('should clamp to maximum value', () => {
    expect(sanitizeNumber(150, 0, 100)).toBe(100);
  });

  it('should return 0 for NaN', () => {
    expect(sanitizeNumber(NaN)).toBe(0);
  });

  it('should return 0 for Infinity', () => {
    expect(sanitizeNumber(Infinity)).toBe(0);
  });

  it('should handle string numbers', () => {
    expect(sanitizeNumber('42', 0, 100)).toBe(42);
  });

  it('should return 0 for non-numeric strings', () => {
    expect(sanitizeNumber('hello')).toBe(0);
  });

  it('should return 0 for null', () => {
    expect(sanitizeNumber(null)).toBe(0);
  });

  it('should return 0 for undefined', () => {
    expect(sanitizeNumber(undefined)).toBe(0);
  });
});

describe('sanitizeUrl', () => {
  it('should allow valid HTTP URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
  });

  it('should allow valid HTTPS URLs', () => {
    expect(sanitizeUrl('https://example.com/path')).toBe('https://example.com/path');
  });

  it('should reject javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
  });

  it('should reject data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('should reject file: URLs', () => {
    expect(sanitizeUrl('file:///etc/passwd')).toBe('');
  });

  it('should return empty string for invalid URLs', () => {
    expect(sanitizeUrl('not-a-url')).toBe('');
  });

  it('should return empty string for non-string input', () => {
    // @ts-expect-error Testing invalid input
    expect(sanitizeUrl(123)).toBe('');
  });
});

describe('generateSecureId', () => {
  it('should generate a non-empty string', () => {
    expect(generateSecureId().length).toBeGreaterThan(0);
  });

  it('should generate unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateSecureId()));
    expect(ids.size).toBe(100);
  });

  it('should fall back to timestamp + random when crypto.randomUUID is unavailable', () => {
    const original = crypto.randomUUID;
    // @ts-expect-error - intentionally removing the API to exercise the fallback
    crypto.randomUUID = undefined;
    try {
      const id = generateSecureId();
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    } finally {
      crypto.randomUUID = original;
    }
  });
});
