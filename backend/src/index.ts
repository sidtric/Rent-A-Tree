import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import connectDB from './config/db';

import {
  apiLimiter,
  authLimiter,
  adminLimiter,
  sanitize,
  preventHPP,
  errorHandler,
  requestTimeout,
} from './middleware/security';

import authRoutes         from './routes/auth';
import treeRoutes         from './routes/trees';
import rentalRoutes       from './routes/rentals';
import paymentRoutes      from './routes/payments';
import reviewRoutes       from './routes/reviews';
import farmUpdateRoutes   from './routes/farmUpdates';
import videoRoutes        from './routes/videos';
import farmPhotoRoutes    from './routes/farmPhotos';
import publicUpdateRoutes from './routes/publicUpdates';
import contactRoutes      from './routes/contact';
import boxOrderRoutes     from './routes/boxOrders';
import adminRoutes        from './admin/adminRoutes';

const app = express();

// ── 1. Security Headers (Helmet) ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images/media from CDN
  contentSecurityPolicy: false,                           // frontend handles its own CSP
}));

// ── 2. CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://rent-a-tree.vercel.app',
  'https://yourorchard.in',
  'https://www.yourorchard.in',
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── 3. Body Parsing (with size limit) ────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── 4. MongoDB Injection Sanitization ────────────────────────────────────────
app.use(sanitize as any);

// ── 5. HTTP Parameter Pollution Prevention ───────────────────────────────────
app.use(preventHPP);

// ── 6. Request Timeout ───────────────────────────────────────────────────────
app.use(requestTimeout);

// ── 7. General API Rate Limit ─────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── 8. Static Files ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── 9. Routes (auth & admin get stricter limits) ─────────────────────────────
app.use('/api/auth',           authLimiter,  authRoutes);
app.use('/api/trees',          treeRoutes);
app.use('/api/rentals',        rentalRoutes);
app.use('/api/payments',       paymentRoutes); 
app.use('/api/reviews',        reviewRoutes);
app.use('/api/farm-updates',   farmUpdateRoutes);
app.use('/api/videos',         videoRoutes);
app.use('/api/farm-photos',    farmPhotoRoutes);
app.use('/api/public-updates', publicUpdateRoutes);
app.use('/api/contact',        contactRoutes);
app.use('/api/box-orders',     boxOrderRoutes);
app.use('/api/admin',          adminLimiter, adminRoutes);

// ── 10. Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 11. 404 Handler ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));

// ── 12. Global Error Handler (must be last) ───────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`[server] running on port ${PORT}`)))
  .catch((err) => { process.stderr.write(String(err)); process.exit(1); });
