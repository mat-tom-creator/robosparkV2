import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Create instructors
    const instructor1 = await prisma.instructor.create({
      data: {
        name: 'Dr. Emily Chen',
        bio: 'Dr. Chen has 10 years of experience teaching STEM to elementary school students.',
        imageUrl: 'https://via.placeholder.com/150',
      },
    });
    
    const instructor2 = await prisma.instructor.create({
      data: {
        name: 'Prof. James Wilson',
        bio: 'Robotics researcher with experience at leading technology companies.',
        imageUrl: 'https://via.placeholder.com/150',
      },
    });
    
    console.log('Instructors created successfully');
    
    // Create courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Robotics Fundamentals for Beginners',
          description: 'An introductory course to the exciting world of robotics for younger students.',
          longDescription: 'This course introduces young learners to the fascinating world of robotics through engaging hands-on activities.',
          minAge: 7,
          maxAge: 9,
          skillLevel: 'Beginner',
          topics: ['Robot Design', 'Block Coding', 'Basic Electronics'],
          duration: '2 weeks',
          startDate: new Date('2025-06-15'),
          endDate: new Date('2025-06-26'),
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlot: '9:00 AM - 12:00 PM',
          price: 299,
          discountedPrice: 254,
          capacity: 15,
          instructorId: instructor1.id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: true,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Advanced Robotics Engineering',
          description: 'A deep dive into complex robotics systems for experienced students.',
          longDescription: 'Designed for students with prior robotics experience, this advanced course explores sophisticated concepts in robot engineering and automation.',
          minAge: 13,
          maxAge: 16,
          skillLevel: 'Advanced',
          topics: ['Autonomous Systems', 'Python Programming', 'AI Basics'],
          duration: '3 weeks',
          startDate: new Date('2025-07-10'),
          endDate: new Date('2025-07-31'),
          days: ['Tuesday', 'Thursday'],
          timeSlot: '1:00 PM - 4:30 PM',
          price: 499,
          capacity: 12,
          instructorId: instructor2.id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: true,
        },
      }),
    ]);
    
    console.log(`Created ${courses.length} courses successfully`);
    
    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@robospark.com',
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
    });
    
    console.log('Admin user created successfully');
    
    // Create discount codes
    const discountCodes = await Promise.all([
      prisma.discountCode.create({
        data: {
          code: 'SUMMER25',
          description: '25% off any course',
          discountPercentage: 25,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-06-01'),
          isActive: true,
          maxUses: 100,
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'EARLYBIRD15',
          description: '15% early bird discount',
          discountPercentage: 15,
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-05-15'),
          isActive: true,
          maxUses: 50,
        },
      }),
    ]);
    
    console.log(`Created ${discountCodes.length} discount codes successfully`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();