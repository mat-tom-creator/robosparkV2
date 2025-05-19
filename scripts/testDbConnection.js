import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('Connection successful!');
    console.log('Query result:', result);
    
    // Test a more complex query
    console.log('\nTesting model access...');
    
    // Count courses
    const courseCount = await prisma.course.count();
    console.log(`Number of courses in database: ${courseCount}`);
    
    // Get a sample course
    if (courseCount > 0) {
      const sampleCourse = await prisma.course.findFirst({
        include: {
          instructor: true,
        },
      });
      console.log('\nSample course data:');
      console.log(`Title: ${sampleCourse.title}`);
      console.log(`Instructor: ${sampleCourse.instructor?.name}`);
      console.log(`Ages: ${sampleCourse.minAge}-${sampleCourse.maxAge}`);
      console.log(`Level: ${sampleCourse.skillLevel}`);
    }
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`\nNumber of users in database: ${userCount}`);
    
    // Count registered participants
    const registrationCount = await prisma.registration.count();
    console.log(`Number of registrations in database: ${registrationCount}`);
    
    console.log('\nDatabase tests completed successfully!');
  } catch (error) {
    console.error('Database connection test failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();