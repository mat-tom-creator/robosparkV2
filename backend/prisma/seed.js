import { PrismaClient, UserRole, SkillLevel, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Create users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@robospark.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'Admin',
          lastName: 'User',
          phone: '(555) 123-0000',
          address: '123 Admin St',
          city: 'Techville',
          state: 'TX',
          zipCode: '75001',
          role: 'admin',
        },
      }),
      prisma.user.create({
        data: {
          email: 'sarah.johnson@example.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '(555) 123-4567',
          address: '456 Elm St',
          city: 'Techville',
          state: 'TX',
          zipCode: '75001',
          role: 'user',
        },
      }),
      prisma.user.create({
        data: {
          email: 'michael.chen@example.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'Michael',
          lastName: 'Chen',
          phone: '(555) 234-5678',
          address: '789 Oak Dr',
          city: 'Techville',
          state: 'TX',
          zipCode: '75001',
          role: 'user',
        },
      }),
      prisma.user.create({
        data: {
          email: 'james.wilson@example.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'James',
          lastName: 'Wilson',
          phone: '(555) 345-6789',
          address: '101 Pine Ln',
          city: 'Techville',
          state: 'TX',
          zipCode: '75002',
          role: 'user',
        },
      }),
      prisma.user.create({
        data: {
          email: 'amanda.rodriguez@example.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'Amanda',
          lastName: 'Rodriguez',
          phone: '(555) 456-7890',
          address: '202 Maple Ave',
          city: 'Techville',
          state: 'TX',
          zipCode: '75002',
          role: 'user',
        },
      }),
      prisma.user.create({
        data: {
          email: 'robert.smith@example.com',
          passwordHash: '$2a$10$XvgohpMsRzQHRG6aQJ5L8exVz/OJKDqeNEqbYQu39ZWZZfmsjZjj2',
          firstName: 'Robert',
          lastName: 'Smith',
          phone: '(555) 567-8901',
          address: '303 Cedar Blvd',
          city: 'Techville',
          state: 'TX',
          zipCode: '75003',
          role: 'user',
        },
      }),
    ]);
    
    console.log(`Created ${users.length} users successfully`);
    
    // Create instructors
    const instructors = await Promise.all([
      prisma.instructor.create({
        data: {
          name: 'Dr. Emily Chen',
          bio: 'Dr. Emily Chen has a Ph.D. in Robotics Engineering and has been teaching children for over 10 years. She specializes in making complex concepts accessible to young minds.',
          imageUrl: 'https://via.placeholder.com/150',
        },
      }),
      prisma.instructor.create({
        data: {
          name: 'Prof. James Wilson',
          bio: 'Professor James Wilson has extensive experience in computer science and mechanical engineering. He enjoys helping students build and program their first robots.',
          imageUrl: 'https://via.placeholder.com/150',
        },
      }),
      prisma.instructor.create({
        data: {
          name: 'Maria Rodriguez',
          bio: 'Maria Rodriguez has a background in education and robotics. She is passionate about introducing young children to STEM concepts through play.',
          imageUrl: 'https://via.placeholder.com/150',
        },
      }),
      prisma.instructor.create({
        data: {
          name: 'Robert Chang',
          bio: 'Robert Chang is a former NASA engineer who now dedicates his time to teaching advanced robotics to children and teenagers.',
          imageUrl: 'https://via.placeholder.com/150',
        },
      }),
    ]);
    
    console.log(`Created ${instructors.length} instructors successfully`);
    
    // Create courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Robotics Fundamentals for Beginners',
          description: 'A perfect introduction to robotics for children with no prior experience',
          longDescription: 'This course provides a comprehensive introduction to robotics for beginners. Students will learn the basics of robot design, simple mechanics, and block-based programming. By the end of the course, each student will have built and programmed their own simple robot that can navigate obstacles and perform basic tasks.',
          minAge: 7,
          maxAge: 10,
          skillLevel: 'Beginner',
          duration: '2 weeks',
          startDate: new Date('2025-06-15'),
          endDate: new Date('2025-06-26'),
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlot: '9:00 AM - 12:00 PM',
          price: 299.99,
          discountedPrice: 254.99,
          capacity: 15,
          instructorId: instructors[0].id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: true,
          topics: ['Robot Design', 'Block Coding', 'Basic Mechanics'],
        },
      }),
      prisma.course.create({
        data: {
          title: 'Advanced Robotics Engineering',
          description: 'For experienced students ready to take their skills to the next level',
          longDescription: 'This advanced course is designed for students who already have experience with basic robotics. Participants will work with more complex sensors, learn text-based programming, and build sophisticated robots capable of autonomous decision-making. The course culminates in a robotics challenge where students apply their new skills.',
          minAge: 11,
          maxAge: 14,
          skillLevel: 'Advanced',
          duration: '3 weeks',
          startDate: new Date('2025-07-06'),
          endDate: new Date('2025-07-24'),
          days: ['Monday', 'Tuesday', 'Thursday'],
          timeSlot: '1:00 PM - 4:00 PM',
          price: 499.99,
          capacity: 12,
          instructorId: instructors[3].id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: false,
          topics: ['Sensors', 'Python Programming', 'Autonomous Navigation', 'AI Basics'],
        },
      }),
      prisma.course.create({
        data: {
          title: 'Creative Robotics & Design',
          description: 'Combining art and technology to create expressive robots',
          longDescription: "This innovative course bridges the gap between technology and creativity. Students will learn how to design and build robots that can create art, respond to music, or express emotions. The course encourages thinking outside the box and finding unique solutions to design challenges.",
          minAge: 8,
          maxAge: 12,
          skillLevel: 'Intermediate',
          duration: '2 weeks',
          startDate: new Date('2025-07-06'),
          endDate: new Date('2025-07-17'),
          days: ['Tuesday', 'Thursday'],
          timeSlot: '9:00 AM - 12:00 PM',
          price: 349.99,
          discountedPrice: 297.49,
          capacity: 12,
          instructorId: instructors[2].id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: true,
          topics: ['Creative Design', 'Light & Sound Sensors', 'Artistic Expression', 'Interactive Robots'],
        },
      }),
      prisma.course.create({
        data: {
          title: 'Robotics for Young Inventors',
          description: 'A gentle introduction to robotics for our youngest students',
          longDescription: 'Designed specifically for younger children, this course uses simplified robotics kits and playful activities to introduce basic STEM concepts. Children will build simple machines, learn cause-and-effect relationships, and develop problem-solving skills through hands-on exploration.',
          minAge: 5,
          maxAge: 7,
          skillLevel: 'Beginner',
          duration: '1 week',
          startDate: new Date('2025-06-08'),
          endDate: new Date('2025-06-12'),
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlot: '10:00 AM - 12:00 PM',
          price: 199.99,
          discountedPrice: 169.99,
          capacity: 10,
          instructorId: instructors[2].id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: false,
          topics: ['Simple Machines', 'Basic Electronics', 'Playful Learning'],
        },
      }),
      prisma.course.create({
        data: {
          title: 'Competitive Robotics Team Prep',
          description: 'Prepare for robotics competitions with team-based challenges',
          longDescription: "This course focuses on the skills needed for successful participation in robotics competitions. Students will work in teams to design, build, and program robots for specific challenges. They'll learn about effective teamwork, time management, and problem-solving under pressure.",
          minAge: 12,
          maxAge: 16,
          skillLevel: 'Intermediate',
          duration: '4 weeks',
          startDate: new Date('2025-07-27'),
          endDate: new Date('2025-08-21'),
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlot: '1:00 PM - 4:00 PM',
          price: 599.99,
          capacity: 12,
          instructorId: instructors[1].id,
          imageUrl: 'https://via.placeholder.com/800x600',
          featured: false,
          topics: ['Competition Strategy', 'Team Collaboration', 'Challenge-Based Design', 'Efficient Programming'],
        },
      }),
    ]);
    
    console.log(`Created ${courses.length} courses successfully`);
    
    // Create discount codes
    const discountCodes = await Promise.all([
      prisma.discountCode.create({
        data: {
          code: 'EARLYBIRD25',
          description: 'Early bird registration discount',
          discountPercentage: 25.00,
          maxUses: 50,
          currentUses: 12,
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-06-01'),
          isActive: true,
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'SUMMER2025',
          description: 'Summer 2025 promotion',
          discountPercentage: 15.00,
          maxUses: 100,
          currentUses: 8,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-08-31'),
          isActive: true,
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'SIBLING10',
          description: 'Sibling discount',
          discountPercentage: 10.00,
          currentUses: 5,
          isActive: true,
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'WELCOME50',
          description: 'New customer welcome discount (EXPIRED)',
          discountPercentage: 50.00,
          maxUses: 20,
          currentUses: 20,
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-05-15'),
          isActive: false,
        },
      }),
    ]);
    
    console.log(`Created ${discountCodes.length} discount codes successfully`);
    
    // Create registrations
    const registrations = await Promise.all([
      prisma.registration.create({
        data: {
          userId: users[1].id, // Sarah Johnson
          courseId: courses[0].id, // Robotics Fundamentals
          childFirstName: 'Emma',
          childLastName: 'Johnson',
          childDateOfBirth: new Date('2016-04-15'), // 9 years old in 2025
          childGradeLevel: '4th Grade',
          childAllergies: 'None',
          emergencyContactName: 'John Johnson',
          emergencyContactRelation: 'Father',
          emergencyContactPhone: '(555) 987-6543',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00001',
          paymentStatus: 'completed',
          amountPaid: 254.99,
          discountCodeId: discountCodes[0].id, // EARLYBIRD25
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[2].id, // Michael Chen
          courseId: courses[1].id, // Advanced Robotics
          childFirstName: 'Ethan',
          childLastName: 'Chen',
          childDateOfBirth: new Date('2013-07-22'), // 12 years old in 2025
          childGradeLevel: '7th Grade',
          childSpecialNeeds: 'Child has previous experience with basic robotics kits',
          emergencyContactName: 'Lisa Chen',
          emergencyContactRelation: 'Mother',
          emergencyContactPhone: '(555) 876-5432',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00002',
          paymentStatus: 'completed',
          amountPaid: 499.99,
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[3].id, // James Wilson
          courseId: courses[2].id, // Creative Robotics
          childFirstName: 'Noah',
          childLastName: 'Wilson',
          childDateOfBirth: new Date('2015-03-10'), // 10 years old in 2025
          childGradeLevel: '5th Grade',
          emergencyContactName: 'Emily Wilson',
          emergencyContactRelation: 'Mother',
          emergencyContactPhone: '(555) 765-4321',
          agreedToTerms: true,
          photoRelease: false,
          confirmationNumber: 'RS-2025-00003',
          paymentStatus: 'completed',
          amountPaid: 297.49,
          discountCodeId: discountCodes[1].id, // SUMMER2025
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[4].id, // Amanda Rodriguez
          courseId: courses[0].id, // Robotics Fundamentals
          childFirstName: 'Olivia',
          childLastName: 'Rodriguez',
          childDateOfBirth: new Date('2017-09-05'), // 8 years old in 2025
          childGradeLevel: '3rd Grade',
          childSpecialNeeds: 'Child is shy but very interested in robots',
          emergencyContactName: 'Carlos Rodriguez',
          emergencyContactRelation: 'Father',
          emergencyContactPhone: '(555) 654-3210',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00004',
          paymentStatus: 'completed',
          amountPaid: 254.99,
          discountCodeId: discountCodes[0].id, // EARLYBIRD25
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[1].id, // Sarah Johnson
          courseId: courses[3].id, // Robotics for Young Inventors
          childFirstName: 'Liam',
          childLastName: 'Johnson',
          childDateOfBirth: new Date('2019-02-20'), // 6 years old in 2025
          childGradeLevel: '1st Grade',
          childSpecialNeeds: 'Younger brother of Emma',
          emergencyContactName: 'John Johnson',
          emergencyContactRelation: 'Father',
          emergencyContactPhone: '(555) 987-6543',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00005',
          paymentStatus: 'completed',
          amountPaid: 169.99,
          discountCodeId: discountCodes[2].id, // SIBLING10
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[5].id, // Robert Smith
          courseId: courses[4].id, // Competitive Robotics Team Prep
          childFirstName: 'Sophia',
          childLastName: 'Smith',
          childDateOfBirth: new Date('2011-11-15'), // 14 years old in 2025
          childGradeLevel: '8th Grade',
          childSpecialNeeds: 'Has participated in school robotics club',
          emergencyContactName: 'Susan Smith',
          emergencyContactRelation: 'Mother',
          emergencyContactPhone: '(555) 543-2109',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00006',
          paymentStatus: 'pending',
          amountPaid: 599.99,
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[2].id, // Michael Chen
          courseId: courses[2].id, // Creative Robotics
          childFirstName: 'Ava',
          childLastName: 'Chen',
          childDateOfBirth: new Date('2016-08-30'), // 9 years old in 2025
          childGradeLevel: '4th Grade',
          childSpecialNeeds: 'Sister of Ethan',
          emergencyContactName: 'Lisa Chen',
          emergencyContactRelation: 'Mother',
          emergencyContactPhone: '(555) 876-5432',
          agreedToTerms: true,
          photoRelease: true,
          confirmationNumber: 'RS-2025-00007',
          paymentStatus: 'pending',
          amountPaid: 297.49,
          discountCodeId: discountCodes[2].id, // SIBLING10
        },
      }),
      prisma.registration.create({
        data: {
          userId: users[5].id, // Robert Smith
          courseId: courses[0].id, // Robotics Fundamentals
          childFirstName: 'Benjamin',
          childLastName: 'Smith',
          childDateOfBirth: new Date('2018-05-25'), // 7 years old in 2025
          childGradeLevel: '2nd Grade',
          childSpecialNeeds: 'Cancelled due to schedule conflict',
          emergencyContactName: 'Susan Smith',
          emergencyContactRelation: 'Mother',
          emergencyContactPhone: '(555) 543-2109',
          agreedToTerms: true,
          photoRelease: false,
          confirmationNumber: 'RS-2025-00008',
          paymentStatus: 'refunded',
          amountPaid: 0.00,
          discountCodeId: discountCodes[1].id, // SUMMER2025
        },
      }),
    ]);
    
    console.log(`Created ${registrations.length} registrations successfully`);
    
    // Create sample contact messages
    const contactMessages = await Promise.all([
      prisma.contactMessage.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-7890',
          subject: 'Question about course schedule',
          message: 'Hello, I was wondering if there is any flexibility in the course schedule? My daughter has piano lessons on Wednesdays.',
          status: 'read',
        },
      }),
      prisma.contactMessage.create({
        data: {
          name: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          phone: '(555) 234-8901',
          subject: 'Special accommodations',
          message: 'My son has a mild peanut allergy. Is this something we should be concerned about for the robotics courses?',
          status: 'replied',
        },
      }),
      prisma.contactMessage.create({
        data: {
          name: 'David Lee',
          email: 'david.lee@example.com',
          subject: 'Private robotics lessons',
          message: 'Do you offer any private lessons or one-on-one instruction for advanced students?',
          status: 'unread',
        },
      }),
    ]);
    
    console.log(`Created ${contactMessages.length} contact messages successfully`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();