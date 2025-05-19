// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authConfig from '../config/auth.config.js';

const prisma = new PrismaClient();

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Require Admin Role!' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};