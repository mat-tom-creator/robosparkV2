import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import courseRoutes from './src/routes/courseRoutes.js';
import registrationRoutes from './src/routes/registrationRoutes.js';
import discountRoutes from './src/routes/discountRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RoboSpark API',
    version: '1.0.0',
    status: 'online'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  await prisma.$disconnect();
  console.log('Database connections closed.');
  process.exit(0);
});

export default app;