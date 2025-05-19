import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Users,
  GraduationCap,
  Target,
  Tag,
  ChevronLeft,
} from "lucide-react";
import { useGetCourseByIdQuery } from "../../services/courseApi";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";
import { formatDate } from "../../lib/utils";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(courseId || "");
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center text-red-700">
          <h2 className="mb-2 text-xl font-semibold">Course Not Found</h2>
          <p className="mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate(paths.courses)}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(course.schedule.startDate);
  const endDate = new Date(course.schedule.endDate);
  const hasDiscount = course.discountedPrice !== undefined;
  const spotsLeft = course.capacity - course.enrolledCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        asChild
        className="mb-4 flex items-center text-gray-600 hover:text-primary"
      >
        <Link to={paths.courses}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to All Courses
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Course Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1"
        >
          <div className="sticky top-20 overflow-hidden rounded-lg border shadow-sm">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
              <img
                src={course.image}
                alt={course.title}
                className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
              />
              {hasDiscount && (
                <div className="absolute right-0 top-0 bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                  Save{" "}
                  {Math.round(
                    (1 - course.discountedPrice! / course.price) * 100
                  )}
                  %
                </div>
              )}
            </div>

            <div className="space-y-4 p-6">
              <div className="flex justify-between">
                {hasDiscount ? (
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      ${course.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${course.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    ${course.price}
                  </span>
                )}
              </div>

              <div className="rounded-md bg-primary/10 p-3">
                <p className="text-sm text-gray-700">
                  <strong>{spotsLeft}</strong> spots remaining out of{" "}
                  <strong>{course.capacity}</strong>
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(course.enrolledCount / course.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link to={`${paths.register}?course=${course.id}`}>
                  Register Now
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Ages {course.ageRange.min}-{course.ageRange.max}
            </span>
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
              {course.skillLevel}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground">
              {course.duration}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-secondary sm:text-4xl">
            {course.title}
          </h1>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center text-gray-700">
                <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                <span>
                  <strong>Dates:</strong> {formatDate(startDate)} -{" "}
                  {formatDate(endDate)}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <span>
                  <strong>Schedule:</strong> {course.schedule.days.join(", ")} |{" "}
                  {course.schedule.timeSlot}
                </span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center text-gray-700">
                <Users className="mr-2 h-5 w-5 text-primary" />
                <span>
                  <strong>Class Size:</strong> Max {course.capacity} students
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                <span>
                  <strong>Instructor:</strong> {course.instructor.name}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-secondary">
              Course Description
            </h2>
            <p className="text-gray-700">{course.longDescription}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-secondary">
              What You'll Learn
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.topics.map((topic, index) => (
                <div key={index} className="flex items-start">
                  <Target className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-secondary">
              Instructor
            </h2>
            <div className="flex items-start space-x-4">
              <img
                src={course.instructor.image}
                alt={course.instructor.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-secondary">
                  {course.instructor.name}
                </h3>
                <p className="text-gray-700">{course.instructor.bio}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-secondary">
              Related Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.topics.map((topic, index) => (
                <Link
                  key={index}
                  to={`${paths.courses}?topic=${encodeURIComponent(topic)}`}
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <Button size="lg" asChild>
              <Link to={`${paths.register}?course=${course.id}`}>
                Register Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to={paths.contact}>Ask a Question</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
