import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectIsDashboardLoading,
} from "./adminDashboardSlice";
import { Button } from "../../../components/ui/Button";
import {
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { paths } from "../../../routes/paths";
import { EnrollmentChart } from "./EnrollmentChart";
import { RevenueChart } from "./RevenueChart";
import { RecentRegistrationsTable } from "./RecentRegistrationsTable";

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const isLoading = useAppSelector(selectIsDashboardLoading);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of RoboSpark's key metrics and recent activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="font-medium text-green-500">
              +{stats.newUsersThisWeek}
            </span>
            <span className="ml-1">this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Courses
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeCourses}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-1">of</span>
            <span className="font-medium text-gray-600">
              {stats.totalCourses}
            </span>
            <span className="ml-1">total courses</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalRegistrations}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="font-medium text-green-500">
              +{stats.newRegistrationsThisWeek}
            </span>
            <span className="ml-1">this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="font-medium text-green-500">
              ${stats.revenueThisMonth.toLocaleString()}
            </span>
            <span className="ml-1">this month</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-secondary">
            Enrollments by Course
          </h2>
          <div className="h-80">
            <EnrollmentChart data={stats.enrollmentsByCourseName} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-secondary">
            Revenue (Last 6 Months)
          </h2>
          <div className="h-80">
            <RevenueChart data={stats.revenueByMonth} />
          </div>
        </motion.div>
      </div>

      {/* Recent Registrations & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 rounded-lg border bg-white shadow-sm"
        >
          <div className="border-b p-4 sm:px-6">
            <h2 className="text-lg font-semibold text-secondary">
              Recent Registrations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <RecentRegistrationsTable
              registrations={stats.recentRegistrations}
            />
          </div>
          <div className="border-t p-4 text-right sm:px-6">
            <Link
              to={`${paths.admin}/reports/registrations`}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all registrations →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-secondary">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link to={`${paths.admin}/courses/new`}>
                <BookOpen className="mr-2 h-5 w-5" />
                Add New Course
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`${paths.admin}/users/new`}>
                <UserPlus className="mr-2 h-5 w-5" />
                Add New User
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`${paths.admin}/reports/generate`}>
                <TrendingUp className="mr-2 h-5 w-5" />
                Generate Reports
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg bg-primary/5 p-4">
            <h3 className="font-medium text-primary">System Status</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-green-600"></span>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Services</span>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-green-600"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-green-600"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
