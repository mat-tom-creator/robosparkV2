import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await prisma.user.count({
      where: { role: 'user' }
    });
    
    const newUsersThisWeek = await prisma.user.count({
      where: {
        role: 'user',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    const totalCourses = await prisma.course.count();
    
    // Calculate active courses (where end date is in the future)
    const activeCourses = await prisma.course.count({
      where: {
        endDate: {
          gte: new Date()
        }
      }
    });
    
    // Get registrations
    const totalRegistrations = await prisma.registration.count();
    
    const newRegistrationsThisWeek = await prisma.registration.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Calculate total revenue
    const paymentsResult = await prisma.registration.aggregate({
      _sum: {
        amountPaid: true
      },
      where: {
        paymentStatus: 'completed'
      }
    });
    
    const totalRevenue = paymentsResult._sum.amountPaid || 0;
    
    // Calculate revenue this month
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    
    const revenueThisMonth = await prisma.registration.aggregate({
      _sum: {
        amountPaid: true
      },
      where: {
        paymentStatus: 'completed',
        createdAt: {
          gte: thisMonthStart
        }
      }
    });
    
    // Get enrollments by course
    const enrollmentsByCourseName = await prisma.$queryRaw`
      SELECT c.title as courseName, COUNT(r.id) as count
      FROM courses c
      LEFT JOIN registrations r ON c.id = r.course_id AND r.payment_status != 'refunded'
      GROUP BY c.id, c.title
    `;
    
    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // This would be easier with a raw SQL query, but for Prisma we'll do something simpler
    const registrationsByMonth = await prisma.registration.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        },
        paymentStatus: 'completed'
      },
      select: {
        createdAt: true,
        amountPaid: true
      }
    });
    
    // Group by month
    const revenueByMonth = [];
    const monthMap = {};
    
    registrationsByMonth.forEach(reg => {
      const monthYear = `${reg.createdAt.getFullYear()}-${reg.createdAt.getMonth() + 1}`;
      if (!monthMap[monthYear]) {
        monthMap[monthYear] = {
          month: new Date(reg.createdAt.getFullYear(), reg.createdAt.getMonth(), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          amount: 0
        };
        revenueByMonth.push(monthMap[monthYear]);
      }
      monthMap[monthYear].amount += Number(reg.amountPaid);
    });
    
    // Sort by date
    revenueByMonth.sort((a, b) => {
      const aDate = new Date(a.month);
      const bDate = new Date(b.month);
      return aDate - bDate;
    });
    
    // Get recent registrations
    const recentRegistrations = await prisma.registration.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        course: {
          select: {
            title: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    // Format recent registrations for the response
    const formattedRegistrations = recentRegistrations.map(reg => ({
      id: reg.id,
      date: reg.createdAt,
      studentName: `${reg.childFirstName} ${reg.childLastName}`,
      courseName: reg.course.title,
      amount: reg.amountPaid,
      status: reg.paymentStatus
    }));
    
    res.status(200).json({
      totalUsers,
      newUsersThisWeek,
      totalCourses,
      activeCourses,
      totalRegistrations,
      newRegistrationsThisWeek,
      totalRevenue,
      revenueThisMonth: revenueThisMonth._sum.amountPaid || 0,
      enrollmentsByCourseName,
      revenueByMonth,
      recentRegistrations: formattedRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User management (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        registrations: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format users to include registration count instead of the full registrations array
    const formattedUsers = users.map(user => ({
      ...user,
      registrations: user.registrations.length
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: {
          include: {
            course: true
          }
        }
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

export const createUser = async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        role: req.body.role || 'user'
      }
    });
    
    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      role: req.body.role
    };
    
    // Update password if provided
    if (req.body.password) {
      updateData.passwordHash = bcrypt.hashSync(req.body.password, 10);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        registrations: {
          include: {
            course: true
          }
        }
      }
    });
    
    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if admin (can't delete admins)
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }
    
    // Check if user has active registrations
    const activeRegistrations = user.registrations.filter(
      reg => reg.paymentStatus === 'completed' || reg.paymentStatus === 'pending'
    );
    
    if (activeRegistrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete user with active registrations' });
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Course management (Admin)
export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
        registrations: {
          select: {
            id: true,
            paymentStatus: true
          }
        }
      }
    });
    
    // Format courses to include enrollment count
    const formattedCourses = courses.map(course => {
      // Count only non-refunded registrations
      const enrolledCount = course.registrations.filter(
        reg => reg.paymentStatus !== 'refunded'
      ).length;
      
      // Return formatted course
      return {
        ...course,
        enrolledCount,
        // Remove the raw registrations array
        registrations: undefined
      };
    });
    
    res.status(200).json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Count enrollments
    const enrolledCount = course.registrations.filter(
      reg => reg.paymentStatus !== 'refunded'
    ).length;
    
    // Format response
    const formattedCourse = {
      ...course,
      enrolledCount
    };
    
    res.status(200).json(formattedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    // Create course
    const course = await prisma.course.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        longDescription: req.body.longDescription,
        minAge: req.body.minAge,
        maxAge: req.body.maxAge,
        skillLevel: req.body.skillLevel,
        topics: req.body.topics,
        duration: req.body.duration,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        days: req.body.days,
        timeSlot: req.body.timeSlot,
        price: req.body.price,
        discountedPrice: req.body.discountedPrice,
        capacity: req.body.capacity,
        instructorId: req.body.instructorId,
        imageUrl: req.body.imageUrl,
        featured: req.body.featured || false
      },
      include: {
        instructor: true
      }
    });
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title !== undefined ? req.body.title : course.title,
        description: req.body.description !== undefined ? req.body.description : course.description,
        longDescription: req.body.longDescription,
        minAge: req.body.minAge !== undefined ? req.body.minAge : course.minAge,
        maxAge: req.body.maxAge !== undefined ? req.body.maxAge : course.maxAge,
        skillLevel: req.body.skillLevel !== undefined ? req.body.skillLevel : course.skillLevel,
        topics: req.body.topics !== undefined ? req.body.topics : course.topics,
        duration: req.body.duration !== undefined ? req.body.duration : course.duration,
        startDate: req.body.startDate !== undefined ? new Date(req.body.startDate) : course.startDate,
        endDate: req.body.endDate !== undefined ? new Date(req.body.endDate) : course.endDate,
        days: req.body.days !== undefined ? req.body.days : course.days,
        timeSlot: req.body.timeSlot !== undefined ? req.body.timeSlot : course.timeSlot,
        price: req.body.price !== undefined ? req.body.price : course.price,
        discountedPrice: req.body.discountedPrice,
        capacity: req.body.capacity !== undefined ? req.body.capacity : course.capacity,
        instructorId: req.body.instructorId,
        imageUrl: req.body.imageUrl,
        featured: req.body.featured !== undefined ? req.body.featured : course.featured
      },
      include: {
        instructor: true,
        registrations: {
          select: {
            id: true,
            paymentStatus: true
          }
        }
      }
    });
    
    // Calculate enrolled count
    const enrolledCount = updatedCourse.registrations.filter(
      reg => reg.paymentStatus !== 'refunded'
    ).length;
    
    // Format response
    const formattedCourse = {
      ...updatedCourse,
      enrolledCount,
      // Remove the raw registrations array
      registrations: undefined
    };
    
    res.status(200).json(formattedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: true
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if course has registrations
    if (course.registrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete course with registrations' });
    }
    
    // Delete course
    await prisma.course.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Instructor management (Admin)
export const getInstructors = async (req, res) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        courses: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format instructors to include course count
    const formattedInstructors = instructors.map(instructor => ({
      ...instructor,
      courseCount: instructor.courses.length,
      // Remove courses array
      courses: undefined
    }));
    
    res.status(200).json(formattedInstructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInstructor = async (req, res) => {
  try {
    const instructor = await prisma.instructor.create({
      data: {
        name: req.body.name,
        bio: req.body.bio,
        imageUrl: req.body.imageUrl
      }
    });
    
    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: req.params.id }
    });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    const updatedInstructor = await prisma.instructor.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name || instructor.name,
        bio: req.body.bio,
        imageUrl: req.body.imageUrl
      }
    });
    
    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: req.params.id },
      include: {
        courses: true
      }
    });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    // Check if instructor has courses
    if (instructor.courses.length > 0) {
      return res.status(400).json({ message: 'Cannot delete instructor with assigned courses' });
    }
    
    // Delete instructor
    await prisma.instructor.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Discount management (Admin)
export const getDiscountCodes = async (req, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      include: {
        registrations: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format response
    const formattedDiscounts = discounts.map(discount => ({
      ...discount,
      usageCount: discount.registrations.length,
      // Remove raw registrations
      registrations: undefined
    }));
    
    res.status(200).json(formattedDiscounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDiscountCode = async (req, res) => {
  try {
    const discount = await prisma.discountCode.create({
      data: {
        code: req.body.code,
        description: req.body.description,
        discountPercentage: req.body.discountPercentage,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        maxUses: req.body.maxUses,
        currentUses: 0
      }
    });
    
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscountCode = async (req, res) => {
  try {
    const discount = await prisma.discountCode.findUnique({
      where: { id: req.params.id }
    });
    
    if (!discount) {
      return res.status(404).json({ message: 'Discount code not found' });
    }
    
    const updatedDiscount = await prisma.discountCode.update({
      where: { id: req.params.id },
      data: {
        code: req.body.code || discount.code,
        description: req.body.description,
        discountPercentage: req.body.discountPercentage !== undefined ? 
          req.body.discountPercentage : discount.discountPercentage,
        startDate: req.body.startDate ? new Date(req.body.startDate) : discount.startDate,
        endDate: req.body.endDate ? new Date(req.body.endDate) : discount.endDate,
        isActive: req.body.isActive !== undefined ? req.body.isActive : discount.isActive,
        maxUses: req.body.maxUses !== undefined ? req.body.maxUses : discount.maxUses
      }
    });
    
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscountCode = async (req, res) => {
  try {
    const discount = await prisma.discountCode.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: true
      }
    });
    
    if (!discount) {
      return res.status(404).json({ message: 'Discount code not found' });
    }
    
    // Check if discount has been used in registrations
    if (discount.registrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete discount code that has been used in registrations' });
    }
    
    // Delete discount
    await prisma.discountCode.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ message: 'Discount code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contact messages (Admin)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactMessageStatus = async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id }
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const updatedMessage = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: {
        status: req.body.status
      }
    });
    
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id }
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await prisma.contactMessage.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
