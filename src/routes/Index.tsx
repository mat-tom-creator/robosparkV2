import { lazy, Suspense } from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import { paths } from "./paths";

// Lazy-loaded page components
const HomePage = lazy(() =>
  import("../features/home/HomePage").then((module) => ({
    default: module.HomePage,
  }))
);
const CoursesPage = lazy(() =>
  import("../features/courses/CoursesPage").then((module) => ({
    default: module.CoursesPage,
  }))
);
const CourseDetailPage = lazy(() =>
  import("../features/courses/CourseDetailPage").then((module) => ({
    default: module.CourseDetailPage,
  }))
);
const RegistrationPage = lazy(() =>
  import("../features/registration/RegistrationPage").then((module) => ({
    default: module.RegistrationPage,
  }))
);
const ContactPage = lazy(() =>
  import("../features/contact/ContactPage").then((module) => ({
    default: module.ContactPage,
  }))
);

// Auth pages
const LoginPage = lazy(() =>
  import("../components/auth/AuthPages").then((module) => ({
    default: module.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import("../components/auth/AuthPages").then((module) => ({
    default: module.RegisterPage,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import("../components/auth/AuthPages").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
);
const ResetPasswordPage = lazy(() =>
  import("../components/auth/AuthPages").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);

// User dashboard pages
const UserDashboardRoutes = lazy(() =>
  import("../features/dashboard/UserDashboardRoutes").then((module) => ({
    default: module.UserDashboardRoutes,
  }))
);

// Admin pages
const AdminLogin = lazy(() =>
  import("../components/admin/AdminLogin").then((module) => ({
    default: module.AdminLogin,
  }))
);
const AdminRoutes = lazy(() =>
  import("../features/admin/AdminRoutes").then((module) => ({
    default: module.AdminRoutes,
  }))
);

// Placeholder component for routes that will be implemented in future phases
const PlaceholderPage = () => (
  <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-secondary sm:text-4xl">
        Coming Soon
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        This page is under construction and will be available in the next phase.
      </p>
    </div>
  </div>
);

export function Routes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <RouterRoutes>
        {/* Public Routes */}
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.courses} element={<CoursesPage />} />
        <Route
          path={`${paths.courses}/:courseId`}
          element={<CourseDetailPage />}
        />
        <Route path={paths.about} element={<PlaceholderPage />} />
        <Route path={paths.contact} element={<ContactPage />} />
        <Route path={paths.register} element={<RegistrationPage />} />

        {/* Auth Routes */}
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.signUp} element={<RegisterPage />} />
        <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
        <Route
          path={`${paths.resetPassword}/:token`}
          element={<ResetPasswordPage />}
        />

        {/* User Dashboard Routes */}
        <Route
          path={`${paths.dashboard}/*`}
          element={<UserDashboardRoutes />}
        />

        {/* Admin Routes */}
        <Route path={paths.adminLogin} element={<AdminLogin />} />
        <Route path={`${paths.admin}/*`} element={<AdminRoutes />} />

        {/* Fallback Route */}
        <Route path="*" element={<PlaceholderPage />} />
      </RouterRoutes>
    </Suspense>
  );
}
