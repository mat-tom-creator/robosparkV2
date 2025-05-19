import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { AdminProtectedRoute } from "../../components/admin/AdminProtectedRoute";

// Lazy load admin components
const AdminDashboard = lazy(() =>
  import("../../features/admin/dashboard/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  }))
);
const CourseManagement = lazy(() =>
  import("../../features/admin/courses/CourseManagement").then((module) => ({
    default: module.CourseManagement,
  }))
);
const CourseForm = lazy(() =>
  import("../../features/admin/courses/CourseForm").then((module) => ({
    default: module.CourseForm,
  }))
);
const UserManagement = lazy(() =>
  import("../../features/admin/users/UserManagement").then((module) => ({
    default: module.UserManagement,
  }))
);
const UserForm = lazy(() =>
  import("../../features/admin/users/UserForm").then((module) => ({
    default: module.UserForm,
  }))
);
const ReportsPage = lazy(() =>
  import("../../features/admin/reports/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  }))
);

export function AdminRoutes() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<AdminDashboard />} />

            {/* Course Routes */}
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:courseId" element={<CourseForm />} />

            {/* User Routes */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/edit/:userId" element={<UserForm />} />

            {/* Report Routes */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportType" element={<ReportsPage />} />

            {/* Redirect to dashboard for any unmatched routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
