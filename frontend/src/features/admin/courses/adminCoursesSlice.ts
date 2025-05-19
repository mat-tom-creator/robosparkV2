import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { adminService } from '../../../services/api';
import { Course } from '../../../types/course';

interface AdminCoursesState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminCoursesState = {
  courses: [],
  isLoading: false,
  error: null,
};

// Fetch all courses (admin view)
export const fetchAdminCourses = createAsyncThunk(
  'adminCourses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getCourses();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

// Fetch a single course by ID (admin view)
export const fetchAdminCourseById = createAsyncThunk(
  'adminCourses/fetchById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await adminService.getCourseById(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course');
    }
  }
);

// Create a new course
export const createCourse = createAsyncThunk(
  'adminCourses/create',
  async (courseData: Partial<Course>, { rejectWithValue }) => {
    try {
      return await adminService.createCourse(courseData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create course');
    }
  }
);

// Update an existing course
export const updateCourse = createAsyncThunk(
  'adminCourses/update',
  async ({ id, data }: { id: string; data: Partial<Course> }, { rejectWithValue }) => {
    try {
      return await adminService.updateCourse(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update course');
    }
  }
);

// Delete a course
export const deleteCourse = createAsyncThunk(
  'adminCourses/delete',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await adminService.deleteCourse(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete course');
    }
  }
);

export const adminCoursesSlice = createSlice({
  name: 'adminCourses',
  initialState,
  reducers: {
    clearCoursesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchAdminCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create a course
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update a course
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete a course
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCoursesError } = adminCoursesSlice.actions;

export const selectAdminCourses = (state: RootState) => state.adminCourses.courses;
export const selectIsCoursesLoading = (state: RootState) => state.adminCourses.isLoading;
export const selectCoursesError = (state: RootState) => state.adminCourses.error;

export default adminCoursesSlice.reducer;

