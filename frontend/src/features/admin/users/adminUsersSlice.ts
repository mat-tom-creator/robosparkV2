import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { adminService } from '../../../services/api';
import { User } from '../../../types/user';

interface AdminUsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  isLoading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getUsers();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

// Fetch a single user by ID
export const fetchUserById = createAsyncThunk(
  'adminUsers/fetchById',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await adminService.getUserById(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Create a new user
export const createUser = createAsyncThunk(
  'adminUsers/create',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      return await adminService.createUser(userData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

// Update an existing user
export const updateUser = createAsyncThunk(
  'adminUsers/update',
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      return await adminService.updateUser(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'adminUsers/delete',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

export const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create a user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update a user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete a user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError } = adminUsersSlice.actions;

export const selectUsers = (state: RootState) => state.adminUsers.users;
export const selectIsUsersLoading = (state: RootState) => state.adminUsers.isLoading;
export const selectUsersError = (state: RootState) => state.adminUsers.error;

export default adminUsersSlice.reducer;
