import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { adminService } from '../../../services/api';

// Types
interface EnrollmentData {
  courseName: string;
  count: number;
}

interface RevenueData {
  month: string;
  amount: number;
}

interface Registration {
  id: string;
  date: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface DashboardStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalCourses: number;
  activeCourses: number;
  totalRegistrations: number;
  newRegistrationsThisWeek: number;
  totalRevenue: number;
  revenueThisMonth: number;
  enrollmentsByCourseName: EnrollmentData[];
  revenueByMonth: RevenueData[];
  recentRegistrations: Registration[];
}

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    newUsersThisWeek: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalRegistrations: 0,
    newRegistrationsThisWeek: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    enrollmentsByCourseName: [],
    revenueByMonth: [],
    recentRegistrations: [],
  },
  isLoading: false,
  error: null,
};

// Thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'adminDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Slice
export const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectDashboardStats = (state: RootState) => state.adminDashboard.stats;
export const selectIsDashboardLoading = (state: RootState) => state.adminDashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.adminDashboard.error;

export default adminDashboardSlice.reducer;

