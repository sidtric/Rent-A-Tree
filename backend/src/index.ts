import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes   from './routes/auth';
import treeRoutes   from './routes/trees';
import rentalRoutes from './routes/rentals';

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/trees',   treeRoutes);
app.use('/api/rentals', rentalRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1); });
