import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { useGetCoursesQuery } from "../../services/courseApi";
import { Course } from "@/types/course";
import { selectCourseFilters, selectCourseSortBy } from "./coursesSlice";
import { CourseCard } from "./CourseCard";
import { Filter } from "lucide-react";

export function CourseList() {
  const { data: courses = [], isLoading, error } = useGetCoursesQuery();
  const filters = useAppSelector(selectCourseFilters);
  const sortBy = useAppSelector(selectCourseSortBy);

  const filteredAndSortedCourses = useMemo(() => {
    // Filter courses
    let result = [...courses];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply age group filter
    if (filters.ageGroup !== "All") {
      const [minAgeStr, maxAgeStr] = filters.ageGroup.split("-");
      const minAge = parseInt(minAgeStr, 10);
      const maxAge = parseInt(maxAgeStr, 10);

      result = result.filter((course) => {
        return course.ageRange.min <= maxAge && course.ageRange.max >= minAge;
      });
    }

    // Apply skill level filter
    if (filters.skillLevel !== "All") {
      result = result.filter(
        (course) => course.skillLevel === filters.skillLevel
      );
    }

    // Apply topic filters
    if (filters.topics.length > 0) {
      result = result.filter((course) =>
        filters.topics.some((topic) => course.topics.includes(topic))
      );
    }

    // Sort courses
    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => {
          const priceA = a.discountedPrice ?? a.price;
          const priceB = b.discountedPrice ?? b.price;
          return priceA - priceB;
        });
      case "price-high":
        return result.sort((a, b) => {
          const priceA = a.discountedPrice ?? a.price;
          const priceB = b.discountedPrice ?? b.price;
          return priceB - priceA;
        });
      case "date":
        return result.sort((a, b) => {
          return (
            new Date(a.schedule.startDate).getTime() -
            new Date(b.schedule.startDate).getTime()
          );
        });
      default: // 'default' - featured first
        return result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [courses, filters, sortBy]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
        <p>Error loading courses. Please try again later.</p>
      </div>
    );
  }

  if (filteredAndSortedCourses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-secondary">
          No courses found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredAndSortedCourses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
}
