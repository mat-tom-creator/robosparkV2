export const paths = {
  // Public pages
  home: '/',
  courses: '/courses',
  courseDetail: (id: string) => `/courses/${id}`,
  about: '/about',
  contact: '/contact',
  
  // Registration and authentication
  courseRegister: '/register', // Detailed course registration
  userRegister: '/register-account', // User account registration
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: (token: string) => `/reset-password/${token}`,
  
  // User dashboard
  dashboard: '/dashboard',
  dashboardCourses: '/dashboard/courses',
  dashboardCourseDetail: (id: string) => `/dashboard/courses/${id}`,
  dashboardPayments: '/dashboard/payments',
  dashboardSettings: '/dashboard/settings',
  
  // Admin section
  admin: '/admin',
  adminCourses: '/admin/courses',
  adminUsers: '/admin/users',
  adminRegistrations: '/admin/registrations',
  adminDiscounts: '/admin/discounts',
};