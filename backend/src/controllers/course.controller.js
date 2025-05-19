import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true
      }
    });
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        registrations: {
          select: {
            id: true
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Calculate enrolled count
    const enrolledCount = course.registrations.length;
    
    // Restructure the response to match frontend expectations
    const formattedCourse = {
      ...course,
      enrolledCount
    };
    
    // Remove the raw registrations data
    delete formattedCourse.registrations;
    
    res.status(200).json(formattedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};