import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { registrationService, paymentService } from '../../services/api';

interface Registration {
  id: string;
  courseId: string;
  childName: string;
  courseName: string;
  startDate: string;
  endDate: string;
  confirmationNumber: string;
  status: 'active' | 'completed' | 'canceled';
  amountPaid: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
}

interface DashboardState {
  registrations: Registration[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  registrations: [],
  payments: [],
  isLoading: false,
  error: null,
};

// Fetch user registrations
export const fetchUserRegistrations = createAsyncThunk(
  'dashboard/fetchUserRegistrations',
  async (_, { rejectWithValue }) => {
    try {
      return await registrationService.getUserRegistrations();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch registrations');
    }
  }
);

// Fetch payment history
export const fetchPaymentHistory = createAsyncThunk(
  'dashboard/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPaymentHistory();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch payment history');
    }
  }
);

// Cancel registration
export const cancelRegistration = createAsyncThunk(
  'dashboard/cancelRegistration',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      return await registrationService.cancelRegistration(id, reason);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel registration');
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch registrations
      .addCase(fetchUserRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrations = action.payload;
      })
      .addCase(fetchUserRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payment history
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel registration
      .addCase(cancelRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the registration in the state
        const { id, status } = action.payload;
        const index = state.registrations.findIndex(reg => reg.id === id);
        if (index !== -1) {
          state.registrations[index].status = status;
        }
      })
      .addCase(cancelRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardErrors } = dashboardSlice.actions;

export const selectRegistrations = (state: RootState) => state.dashboard.registrations;
export const selectPayments = (state: RootState) => state.dashboard.payments;
export const selectIsLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;