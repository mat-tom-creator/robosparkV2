import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAdminCourses,
  selectAdminCourses,
  selectIsCoursesLoading,
  selectCoursesError,
  deleteCourse,
} from "./adminCoursesSlice";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import { paths } from "../../../routes/paths";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/Dialog";

export function CourseManagement() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectAdminCourses);
  const isLoading = useAppSelector(selectIsCoursesLoading);
  const error = useAppSelector(selectCoursesError);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminCourses());
  }, [dispatch]);

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course deletion
  const openDeleteDialog = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteCourse(selectedCourseId)).unwrap();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const selectedCourse = selectedCourseId
    ? courses.find((c) => c.id === selectedCourseId)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">
            Course Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, or remove courses from the catalog.
          </p>
        </div>
        <Button asChild>
          <Link to={`${paths.admin}/courses/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
        </div>
      )}

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col space-y-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Courses
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Course Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Age Range
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Dates
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
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {courses.length === 0
                      ? "No courses found. Add your first course to get started!"
                      : "No courses match your search criteria."}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={
                            course.image || "<https://via.placeholder.com/40>"
                          }
                          alt={course.title}
                          className="mr-3 h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.skillLevel}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {course.ageRange.min} - {course.ageRange.max} years
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        <span>
                          {new Date(
                            course.schedule.startDate
                          ).toLocaleDateString()}{" "}
                          -
                          {new Date(
                            course.schedule.endDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        <span>
                          {course.enrolledCount}/{course.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {course.discountedPrice ? (
                        <div>
                          <span className="text-primary">
                            ${course.discountedPrice}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${course.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary">${course.price}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {course.featured ? (
                        <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`${paths.admin}/courses/edit/${course.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(course.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredCourses.length}</span> of{" "}
                <span className="font-medium">{filteredCourses.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <Button variant="outline" size="sm" className="rounded-l-md">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="rounded-r-md">
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Course Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the course "
              {selectedCourse?.title}"? This action cannot be undone, and all
              associated registrations will be affected.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
