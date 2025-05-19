import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserRegistrations,
  fetchPaymentHistory,
  selectDashboardError,
} from "../../features/dashboard/dashboardSlice";
import { getUserProfile, selectUser } from "../../features/auth/authSlice";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { DashboardOverview } from "../../components/dashboard/DashboardOverview";
import { MyCourses } from "../../components/dashboard/MyCourses";
import { CourseDetails } from "../../components/dashboard/CourseDetails";
import { PaymentHistory } from "../../components/dashboard/PaymentHistory";
import { AccountSettings } from "../../components/dashboard/AccountSettings";

// Main Dashboard Page (Overview)
export function DashboardPage() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectDashboardError);
  const user = useAppSelector(selectUser);

  // Fetch user data on component mount
  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }

    // Fetch dashboard data
    dispatch(fetchUserRegistrations());
    dispatch(fetchPaymentHistory());
  }, [dispatch, user]);

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}

// My Courses Page
export function MyCoursesPage() {
  const dispatch = useAppDispatch();

  // Fetch course registrations on component mount
  useEffect(() => {
    dispatch(fetchUserRegistrations());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <MyCourses />
    </DashboardLayout>
  );
}

// Course Details Page
export function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Fetch course registrations if needed
  useEffect(() => {
    dispatch(fetchUserRegistrations());
  }, [dispatch]);

  // Validate the course ID
  useEffect(() => {
    if (!id) {
      navigate("/dashboard/courses");
    }
  }, [id, navigate]);

  return (
    <DashboardLayout>
      <CourseDetails />
    </DashboardLayout>
  );
}

// Payment History Page
export function PaymentHistoryPage() {
  const dispatch = useAppDispatch();

  // Fetch payment history on component mount
  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <PaymentHistory />
    </DashboardLayout>
  );
}

// Account Settings Page
export function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // Fetch user profile if needed
  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  return (
    <DashboardLayout>
      <AccountSettings />
    </DashboardLayout>
  );
}

// Export default for lazy loading
export default DashboardPage;
