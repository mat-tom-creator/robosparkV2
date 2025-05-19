import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
      },
    });
    
    // Transform data to match frontend format
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      longDescription: course.longDescription,
      ageRange: {
        min: course.minAge,
        max: course.maxAge
      },
      skillLevel: course.skillLevel,
      topics: course.topics,
      duration: course.duration,
      schedule: {
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        days: course.days,
        timeSlot: course.timeSlot
      },
      instructor: {
        name: course.instructor?.name,
        bio: course.instructor?.bio,
        image: course.instructor?.imageUrl
      },
      price: Number(course.price),
      discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : undefined,
      capacity: course.capacity,
      enrolledCount: 0, // This would be computed from registrations
      image: course.imageUrl,
      featured: course.featured
    }));
    
    res.json(transformedCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
      },
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Transform data to match frontend format
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      longDescription: course.longDescription,
      ageRange: {
        min: course.minAge,
        max: course.maxAge
      },
      skillLevel: course.skillLevel,
      topics: course.topics,
      duration: course.duration,
      schedule: {
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        days: course.days,
        timeSlot: course.timeSlot
      },
      instructor: {
        name: course.instructor?.name,
        bio: course.instructor?.bio,
        image: course.instructor?.imageUrl
      },
      price: Number(course.price),
      discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : undefined,
      capacity: course.capacity,
      enrolledCount: 0, // This would be computed from registrations
      image: course.imageUrl,
      featured: course.featured
    };
    
    res.json(transformedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const courseData = req.body;
    
    // Transform data to match database schema
    const prismaData = {
      title: courseData.title,
      description: courseData.description,
      longDescription: courseData.longDescription,
      minAge: courseData.ageRange.min,
      maxAge: courseData.ageRange.max,
      skillLevel: courseData.skillLevel,
      topics: courseData.topics,
      duration: courseData.duration,
      startDate: new Date(courseData.schedule.startDate),
      endDate: new Date(courseData.schedule.endDate),
      days: courseData.schedule.days,
      timeSlot: courseData.schedule.timeSlot,
      price: courseData.price,
      discountedPrice: courseData.discountedPrice,
      capacity: courseData.capacity,
      instructorId: courseData.instructorId,
      imageUrl: courseData.image,
      featured: courseData.featured || false,
    };
    
    const course = await prisma.course.create({
      data: prismaData,
      include: {
        instructor: true,
      },
    });
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

export default router;