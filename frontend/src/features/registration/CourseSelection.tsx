import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSelectedCourseId,
  setSelectedCourseId,
  setCurrentStep,
} from "./registrationSlice";
import { useGetCoursesQuery } from "../../services/courseApi";
import { Button } from "../../components/ui/Button";
import { CheckCircle } from "lucide-react";

export function CourseSelection() {
  const dispatch = useAppDispatch();
  const selectedCourseId = useAppSelector(selectSelectedCourseId);
  const { data: courses = [], isLoading } = useGetCoursesQuery();
  const [searchParams] = useSearchParams();

  // Check if a course was pre-selected from URL
  useEffect(() => {
    const courseId = searchParams.get("course");
    if (courseId && courses.some((course) => course.id === courseId)) {
      dispatch(setSelectedCourseId(courseId));
    }
  }, [courses, searchParams, dispatch]);

  const handleCourseSelection = (courseId: string) => {
    dispatch(setSelectedCourseId(courseId));
  };

  const handleContinue = () => {
    dispatch(setCurrentStep(2));
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-secondary">
          Select a Course
        </h2>
        <p className="text-gray-600">
          Choose the robotics course you'd like to register for. You'll provide
          participant details in the next steps.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative cursor-pointer overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md ${
              selectedCourseId === course.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => handleCourseSelection(course.id)}
          >
            {selectedCourseId === course.id && (
              <div className="absolute right-2 top-2">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <img
                src={course.image}
                alt={course.title}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-secondary">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  Ages {course.ageRange.min}-{course.ageRange.max} •{" "}
                  {course.skillLevel}
                </p>
                <p className="text-sm text-gray-600">
                  {course.schedule.days.join(", ")} | {course.schedule.timeSlot}
                </p>
                <p className="mt-1 font-medium text-primary">
                  ${course.discountedPrice ?? course.price}
                  {course.discountedPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${course.price}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} disabled={!selectedCourseId}>
          Continue
        </Button>
      </div>
    </div>
  );
}
