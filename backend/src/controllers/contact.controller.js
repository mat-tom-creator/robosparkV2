import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Submit a contact message
export const submitMessage = async (req, res) => {
  try {
    const contact = await prisma.contactMessage.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message,
        status: 'unread'
      }
    });
    
    // Send notification email to admin
    // This is a placeholder - in production, use proper email config
    if (process.env.NODE_ENV === 'production') {
      try {
        let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: '"RoboSpark Contact" <noreply@robospark.com>',
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Message: ${req.body.subject}`,
          text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone || 'Not provided'}\n\nMessage:\n${req.body.message}`,
          html: `<p><strong>Name:</strong> ${req.body.name}</p><p><strong>Email:</strong> ${req.body.email}</p><p><strong>Phone:</strong> ${req.body.phone || 'Not provided'}</p><p><strong>Message:</strong></p><p>${req.body.message}</p>`
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }
    
    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contactId: contact.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};