import axios from 'axios';
import { Course } from '@/types/course';
import { User } from '@/types/user';

// Define the API base URL
const API_URL = import.meta.env.VITE_API_URL || '<http://localhost:5000/api>';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      // Redirect to appropriate login page based on the requested URL
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/admin/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Reset password request
  resetPasswordRequest: async (email: string) => {
    const response = await apiClient.post('/auth/reset-password-request', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData: { token: string; password: string }) => {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  },
};

// Admin service
export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  },

  // Course management
  getCourses: async () => {
    const response = await apiClient.get('/admin/courses');
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await apiClient.get(`/admin/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: Partial<Course>) => {
    const response = await apiClient.post('/admin/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: Partial<Course>) => {
    const response = await apiClient.put(`/admin/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await apiClient.delete(`/admin/courses/${id}`);
    return response.data;
  },

  // User management
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Reporting
  getReport: async (reportType: string, params: any = {}) => {
    const response = await apiClient.get(`/admin/reports/${reportType}`, { params });
    return response.data;
  },

  exportReport: async (reportType: string, format: 'csv' | 'pdf', params: any = {}) => {
    const response = await apiClient.get(`/admin/reports/${reportType}/export`, {
      params: { ...params, format },
      responseType: 'blob'
    });
    return response.data;
  },
};

// API service for courses
export const courseService = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
};

// API service for discount codes
export const discountService = {
  // Validate a discount code
  validateDiscountCode: async (code: string) => {
    try {
      const response = await apiClient.post('/discounts/validate', { code });
      return response.data;
    } catch (error: any) {
      // Return the error message from the API or a default message
      const errorMessage = error.response?.data?.message || 'Invalid discount code';
      throw new Error(errorMessage);
    }
  },
};

// API service for registrations
export const registrationService = {
  // Create a new registration
  registerForCourse: async (registrationData: any) => {
    try {
      const response = await apiClient.post('/registrations', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  },

  // Get user registrations
  getUserRegistrations: async () => {
    try {
      const response = await apiClient.get('/registrations/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      throw error;
    }
  },

  // Get registration details
  getRegistrationById: async (id: string) => {
    try {
      const response = await apiClient.get(`/registrations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registration ${id}:`, error);
      throw error;
    }
  },

  // Cancel registration
  cancelRegistration: async (id: string, reason: string) => {
    try {
      const response = await apiClient.post(`/registrations/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error canceling registration ${id}:`, error);
      throw error;
    }
  },
};

// API service for contact messages
export const contactService = {
  // Submit a contact message
  submitMessage: async (contactData: any) => {
    try {
      const response = await apiClient.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }
  },
};

// Payment service
export const paymentService = {
  // Process payment
  processPayment: async (paymentData: {
    amount: number;
    currency: string;
    description: string;
    paymentMethod: string;
    cardDetails?: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    };
  }) => {
    try {
      const response = await apiClient.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/payments/methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await apiClient.get('/payments/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },
};
