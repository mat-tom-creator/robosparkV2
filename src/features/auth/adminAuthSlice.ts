import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { authService } from '../../services/api';

// Define admin auth state
interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminAuthState = {
  isAuthenticated: !!localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,
};

// Admin login thunk
export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(credentials);
      // Store token in localStorage
      localStorage.setItem('adminToken', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Admin login failed');
    }
  }
);

// Admin auth slice
export const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogout: (state) => {
      localStorage.removeItem('adminToken');
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAdminAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { adminLogout, clearAdminAuthError } = adminAuthSlice.actions;

// Export selectors
export const selectIsAdminAuthenticated = (state: RootState) => state.adminAuth.isAuthenticated;
export const selectIsAdminLoading = (state: RootState) => state.adminAuth.isLoading;
export const selectAdminAuthError = (state: RootState) => state.adminAuth.error;

export default adminAuthSlice.reducer;

