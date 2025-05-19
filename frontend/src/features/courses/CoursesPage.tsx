import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../app/hooks";
import { addTopicFilter, setSearchFilter } from "./coursesSlice";
import { CourseList } from "./CourseList";
import { CourseFilters } from "./CourseFilters";
import { CourseSorting } from "./CourseSorting";

export function CoursesPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Handle URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const topic = params.get("topic");
    if (topic) {
      dispatch(addTopicFilter(topic));
    }

    const search = params.get("search");
    if (search) {
      dispatch(setSearchFilter(search));
    }
  }, [location.search, dispatch]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            Explore Our <span className="text-primary">Summer Courses</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Discover the perfect robotics program for your child's interests and
            skill level. All courses feature hands-on learning and expert
            instruction.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <CourseFilters />
          </aside>

          {/* Course Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <CourseSorting />
            </div>
            <CourseList />
          </div>
        </div>
      </div>
    </div>
  );
}
