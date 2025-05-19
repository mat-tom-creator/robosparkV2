const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get available spots for a course
 * @param {string} courseId - The course ID
 * @returns {Promise<number>} - Number of available spots
 */
async function getAvailableSpots(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { capacity: true },
  });
  
  if (!course) {
    throw new Error('Course not found');
  }
  
  const registrationCount = await prisma.registration.count({
    where: { 
      courseId,
      paymentStatus: { in: ['completed', 'pending'] },
    },
  });
  
  return course.capacity - registrationCount;
}

/**
 * Check if course is available for registration
 * @param {string} courseId - The course ID
 * @returns {Promise<boolean>} - Whether the course is available
 */
async function isCourseAvailable(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  
  if (!course) {
    return false;
  }
  
  const availableSpots = await getAvailableSpots(courseId);
  const currentDate = new Date();
  const courseStartDate = new Date(course.startDate);
  
  return availableSpots > 0 && courseStartDate > currentDate;
}

module.exports = {
  getAvailableSpots,
  isCourseAvailable,
};