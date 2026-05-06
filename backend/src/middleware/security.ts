import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// ── Rate Limiters ─────────────────────────────────────────────────────────────

/** General API — 120 requests per 15 min per IP */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again in 15 minutes.' },
});

/** Auth endpoints — 10 attempts per 15 min per IP (brute-force protection) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' },
  skipSuccessfulRequests: true,   // Only count failed/errored requests
});

/** Admin routes — 60 requests per 15 min per IP */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many admin requests, please slow down.' },
});

// ── NoSQL Injection Sanitizer ─────────────────────────────────────────────────
// Strips MongoDB operators ($, .) from req.body, req.params, req.query
export const sanitize = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized suspicious key "${key}" from ${req.ip} → ${req.path}`);
  },
});

// ── HTTP Parameter Pollution ──────────────────────────────────────────────────
export const preventHPP = hpp();

// ── Production Error Handler ──────────────────────────────────────────────────
// Hides stack traces and internal details in production
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDev = process.env.NODE_ENV === 'development';

  // Log every error server-side
  console.error(`[ERROR] ${err.status || 500} — ${err.message}`);
  if (isDev) console.error(err.stack);

  // Never leak Mongoose/Razorpay/JWT internals to clients
  let message = 'Something went wrong. Please try again.';
  let status  = err.status || 500;

  if (isDev) {
    message = err.message || message;
  } else {
    // Pass through known safe HTTP errors (4xx)
    if (status >= 400 && status < 500) message = err.message || message;
  }

  res.status(status).json({ message });
};

// ── Request Timeout ───────────────────────────────────────────────────────────
// Abort requests that take longer than 30s
export const requestTimeout = (req: Request, res: Response, next: NextFunction): void => {
  res.setTimeout(30_000, () => {
    res.status(503).json({ message: 'Request timed out.' });
  });
  next();
};
