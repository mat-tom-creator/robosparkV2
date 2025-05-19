import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { courseApi } from '../services/courseApi';
import coursesReducer from '../features/courses/coursesSlice';
import registrationReducer from '../features/registration/registrationSlice';
import discountReducer from '../features/registration/discountSlice';
import authReducer from '../features/auth/authSlice';
import adminAuthReducer from '../features/auth/adminAuthSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import adminDashboardReducer from '../features/admin/dashboard/adminDashboardSlice';
import adminCoursesReducer from '../features/admin/courses/adminCoursesSlice';
import adminUsersReducer from '../features/admin/users/adminUsersSlice';

export const store = configureStore({
  reducer: {
    [courseApi.reducerPath]: courseApi.reducer,
    courses: coursesReducer,
    registration: registrationReducer,
    discount: discountReducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
    dashboard: dashboardReducer,
    adminDashboard: adminDashboardReducer,
    adminCourses: adminCoursesReducer,
    adminUsers: adminUsersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      courseApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
