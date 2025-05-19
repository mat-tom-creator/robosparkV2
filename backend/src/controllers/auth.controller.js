import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import authConfig from '../config/auth.config.js';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone || null,
        role: 'user'
      }
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
export const login = async (req, res) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Require Admin Role!' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        passwordHash: bcrypt.hashSync(req.body.newPassword, 10)
      }
    });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password request
export const resetPasswordRequest = async (req, res) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (!user) {
      // We don't want to reveal if the email exists or not for security reasons
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token (in a real app, you would create a reset token table or add these fields to the user model)
    const resetToken = uuidv4();
    
    // In production, you'd save this token to the database with an expiration time
    // For this demo, we'll just send the token in the reset URL
    // Note: In a real app, you should implement this properly with a table for reset tokens

    // Send email with reset token
    // For demonstration purposes - you would replace this with actual email sending logic
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    try {
      // Set up nodemailer transporter
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Send email
      await transporter.sendMail({
        from: '"RoboSpark" <noreply@robospark.com>',
        to: user.email,
        subject: 'Password Reset Request',
        text: `Please use the following link to reset your password: ${resetUrl}`,
        html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue execution - don't return an error to the user
    }

    // Log the reset URL in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Reset URL: ${resetUrl}`);
    }

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};