export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'user' | 'admin';
  registrations?: any[];
  createdAt: string;
  updatedAt: string;
}
