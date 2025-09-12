import xss from 'xss';

// Validate and sanitize input
export function validateAndSanitize(input: string, maxLength: number = 500): { isValid: boolean; sanitized?: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: "Input is required" };
  }

  const sanitized = xss(input.trim());
  
  if (sanitized.length === 0) {
    return { isValid: false, error: "Input cannot be empty" };
  }

  if (sanitized.length > maxLength) {
    return { isValid: false, error: `Input is too long (max ${maxLength} characters)` };
  }

  return { isValid: true, sanitized };
}

// Security headers for Next.js API routes
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
};
