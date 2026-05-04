import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';

import authRoutes    from './routes/auth';
import treeRoutes    from './routes/trees';
import rentalRoutes  from './routes/rentals';
import paymentRoutes from './routes/payments';
import reviewRoutes     from './routes/reviews';
import farmUpdateRoutes from './routes/farmUpdates';
import videoRoutes      from './routes/videos';
import contactRoutes    from './routes/contact';
import adminRoutes      from './admin/adminRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://rent-a-tree.vercel.app',
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',     authRoutes);
app.use('/api/trees',    treeRoutes);
app.use('/api/rentals',  rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews',     reviewRoutes);
app.use('/api/farm-updates', farmUpdateRoutes);
app.use('/api/videos',      videoRoutes);
app.use('/api/contact',     contactRoutes);
app.use('/api/admin',       adminRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectDB().catch((err) => console.error('MongoDB connection failed:', err.message));
