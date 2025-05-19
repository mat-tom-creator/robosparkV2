// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import registrationRoutes from './src/routes/registration.routes.js';
import discountRoutes from './src/routes/discount.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

// Initialize Express app
const app = express();

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize admin user
const initializeAdminUser = async () => {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL }
    });

    if (!adminUser) {
      // Create admin user
      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        }
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Initialize admin user on app start
initializeAdminUser();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RoboSpark API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});