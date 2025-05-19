import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

// Lazy-loaded dashboard components
const DashboardOverview = lazy(() =>
  import("@/components/dashboard/DashboardOverview").then((module) => ({
    default: module.DashboardOverview,
  }))
);
const MyCourses = lazy(() =>
  import("@/components/dashboard/MyCourses").then((module) => ({
    default: module.MyCourses,
  }))
);
const CourseDetails = lazy(() =>
  import("@/components/dashboard/CourseDetails").then((module) => ({
    default: module.CourseDetails,
  }))
);
const PaymentHistory = lazy(() =>
  import("@/components/dashboard/PaymentHistory").then((module) => ({
    default: module.PaymentHistory,
  }))
);
const AccountSettings = lazy(() =>
  import("@/components/dashboard/AccountSettings").then((module) => ({
    default: module.AccountSettings,
  }))
);

export function UserDashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/payments" element={<PaymentHistory />} />
            <Route path="/settings" element={<AccountSettings />} />

            {/* Redirect to dashboard for any unmatched routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
