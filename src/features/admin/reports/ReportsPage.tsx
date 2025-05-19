import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Mail,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { paths } from "../../../routes/paths";

type ReportType = "enrollment" | "revenue" | "demographics" | "registrations";

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("enrollment");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View data visualizations and generate reports for analysis.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Report Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-secondary">
              Report Types
            </h2>

            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveReport("enrollment")}
                className={`flex items-center rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeReport === "enrollment"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart className="mr-2 h-5 w-5" />
                Enrollment Reports
              </button>

              <button
                onClick={() => setActiveReport("revenue")}
                className={`flex items-center rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeReport === "revenue"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LineChart className="mr-2 h-5 w-5" />
                Revenue Reports
              </button>

              <button
                onClick={() => setActiveReport("demographics")}
                className={`flex items-center rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeReport === "demographics"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <PieChart className="mr-2 h-5 w-5" />
                Demographics
              </button>

              <button
                onClick={() => setActiveReport("registrations")}
                className={`flex items-center rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeReport === "registrations"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Registration Data
              </button>
            </nav>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Current Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Schedule Report Email
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Content */}
        <motion.div
          key={activeReport}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          {activeReport === "enrollment" && <EnrollmentReport />}
          {activeReport === "revenue" && <RevenueReport />}
          {activeReport === "demographics" && <DemographicsReport />}
          {activeReport === "registrations" && <RegistrationsReport />}
        </motion.div>
      </div>
    </div>
  );
}

function EnrollmentReport() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Enrollment by Course
        </h2>
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Enrollment chart will be displayed here
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Enrollment Trends
        </h2>
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Enrollment trends chart will be displayed here
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Course Capacity Utilization
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Capacity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Enrolled
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* Sample data */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Robotics Fundamentals for Beginners
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">15</td>
                <td className="px-6 py-4 text-sm text-gray-500">12</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      80%
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Advanced Robotics Engineering
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">12</td>
                <td className="px-6 py-4 text-sm text-gray-500">5</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      42%
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Creative Robotics & Design
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">12</td>
                <td className="px-6 py-4 text-sm text-gray-500">10</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: "83%" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      83%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Table
          </Button>
        </div>
      </div>
    </div>
  );
}

function RevenueReport() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Revenue Overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-primary/5 p-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="mt-1 text-3xl font-bold text-primary">$42,580</p>
            <p className="mt-1 text-sm text-gray-500">All time</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <p className="mt-1 text-3xl font-bold text-green-600">$12,750</p>
            <p className="mt-1 text-sm text-green-600">+18% from last month</p>
          </div>
          <div className="rounded-lg bg-accent/5 p-4">
            <p className="text-sm font-medium text-gray-500">
              Average Per Course
            </p>
            <p className="mt-1 text-3xl font-bold text-accent-foreground">
              $5,323
            </p>
            <p className="mt-1 text-sm text-gray-500">Across all courses</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Monthly Revenue (2025)
        </h2>
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Monthly revenue chart will be displayed here
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Revenue by Course
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Enrollments
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Robotics Fundamentals for Beginners
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">12</td>
                <td className="px-6 py-4 text-sm text-gray-500">$254</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  $3,048
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Advanced Robotics Engineering
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">5</td>
                <td className="px-6 py-4 text-sm text-gray-500">$499</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  $2,495
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Creative Robotics & Design
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">10</td>
                <td className="px-6 py-4 text-sm text-gray-500">$297</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  $2,970
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Table
          </Button>
        </div>
      </div>
    </div>
  );
}

function DemographicsReport() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Age Distribution
        </h2>
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Age distribution chart will be displayed here
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-secondary">
            Gender Distribution
          </h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">
              Gender distribution chart will be displayed here
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Chart
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-secondary">
            Geographic Distribution
          </h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">
              Geographic distribution chart will be displayed here
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Chart
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Demographics Summary
        </h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">Age Groups</h3>
            <p className="mt-1 text-sm text-gray-600">
              The majority of our students are in the 10-12 age range (42%),
              followed by 7-9 (38%) and 13-16 (20%).
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">
              Gender Balance
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              We currently have a gender distribution of 65% male and 35% female
              students. Our outreach programs aim to achieve a more balanced
              gender ratio.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">
              Geographic Reach
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Most students come from within a 15-mile radius of our facility,
              with the highest concentration from Techville (65%) and
              surrounding communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistrationsReport() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Registration Timeline
        </h2>
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Registration timeline chart will be displayed here
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-secondary">
          Registration Status
        </h2>
        <div className="grid gap-6 sm:grid-cols-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-xl font-bold text-green-600">42</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Completed</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center">
            <p className="text-xl font-bold text-yellow-600">8</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Pending</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-xl font-bold text-red-600">3</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Cancelled</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-xl font-bold text-blue-600">53</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Total</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-secondary">
            Recent Registrations
          </h2>
          <Link
            to={`${paths.admin}/registrations`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Parent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500">05/15/2025</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Emma Johnson
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Robotics Fundamentals
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500">05/14/2025</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Ethan Chen
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Michael Chen
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Advanced Robotics
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500">05/13/2025</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Olivia Smith
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">James Smith</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Creative Robotics
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Table
          </Button>
        </div>
      </div>
    </div>
  );
}
