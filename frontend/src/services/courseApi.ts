import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/types/course';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => '/courses',
    }),
    getCourseById: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = courseApi;