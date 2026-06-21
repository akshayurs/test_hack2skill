/**
 * Input sanitization utilities for preventing XSS and injection attacks.
 *
 * Provides functions to sanitize user input before storage or display.
 * Uses a whitelist approach for maximum security.
 *
 * @module sanitize
 * @version 1.0.0
 * @security This module is critical for application security
 */

/**
 * HTML entity map for escaping dangerous characters.
 * Prevents XSS attacks by converting special characters to HTML entities.
 */
const HTML_ENTITIES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
} as const;

/**
 * Regular expression matching characters that need HTML entity escaping.
 */
const HTML_ESCAPE_REGEX = /[&<>"'`/]/g;

/**
 * Escapes HTML special characters to prevent XSS attacks.
 *
 * Converts dangerous characters (< > & " ' / `) to their HTML entity equivalents.
 * This is the primary defense against stored and reflected XSS.
 *
 * @param input - The raw user input string to sanitize
 * @returns Sanitized string with HTML entities escaped
 *
 * @example
 * ```typescript
 * sanitizeHtml('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
 * ```
 *
 * @security Always use this function before rendering user-provided content
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input.replace(HTML_ESCAPE_REGEX, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strips all HTML tags from a string, leaving only text content.
 *
 * Uses a regex-based approach that removes all angle-bracket enclosed content.
 * For rich content sanitization, use a library like DOMPurify instead.
 *
 * @param input - String potentially containing HTML tags
 * @returns Clean text string with all HTML tags removed
 *
 * @example
 * ```typescript
 * stripHtmlTags('<p>Hello <strong>World</strong></p>');
 * // Returns: 'Hello World'
 * ```
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes a string for safe use in localStorage or sessionStorage.
 *
 * Removes null bytes, control characters, and trims whitespace.
 * Also enforces a maximum length to prevent storage abuse.
 *
 * @param input - Raw input string to sanitize
 * @param maxLength - Maximum allowed length (default: 10000)
 * @returns Sanitized string safe for storage
 *
 * @security Prevents storage-based injection and DoS attacks
 */
export function sanitizeForStorage(input: string, maxLength: number = 10000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters (except common whitespace)
  const cleaned = input
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  // Enforce maximum length
  return cleaned.slice(0, maxLength);
}

/**
 * Sanitizes a numeric input, ensuring it falls within valid bounds.
 *
 * @param value - The numeric value to sanitize
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: Number.MAX_SAFE_INTEGER)
 * @returns Sanitized number clamped within bounds, or 0 if invalid
 *
 * @example
 * ```typescript
 * sanitizeNumber(-5, 0, 100);  // Returns: 0
 * sanitizeNumber(150, 0, 100); // Returns: 100
 * sanitizeNumber(NaN);         // Returns: 0
 * ```
 */
export function sanitizeNumber(
  value: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  const num = Number(value);

  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * Validates and sanitizes a URL string.
 *
 * Only allows http and https protocols to prevent javascript: and data: URI attacks.
 *
 * @param url - The URL string to validate
 * @returns Sanitized URL string or empty string if invalid
 *
 * @security Prevents javascript: and data: URI injection attacks
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Generates a cryptographically random unique identifier.
 *
 * Uses the Web Crypto API when available, falling back to a
 * timestamp + random combination.
 *
 * @returns A unique identifier string
 */
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
}
