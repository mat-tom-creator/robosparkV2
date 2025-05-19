import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Submit a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }
    
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'unread',
      },
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact message', error: error.message });
  }
});

export default router;