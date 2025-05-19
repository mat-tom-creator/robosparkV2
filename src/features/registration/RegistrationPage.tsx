import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentStep, setSelectedCourseId } from "./registrationSlice";
import { RegistrationStepper } from "./RegistrationStepper";
import { CourseSelection } from "./CourseSelection";
import { ParentInfoForm } from "./ParentInfoForm";
import { ChildInfoForm } from "./ChildInfoForm";
import { ReviewAndPayment } from "./ReviewAndPayment";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { useGetCoursesQuery } from "../../services/courseApi";

export function RegistrationPage() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const [searchParams] = useSearchParams();
  const { data: courses = [] } = useGetCoursesQuery();

  // Check if a course was pre-selected from URL
  useEffect(() => {
    const courseId = searchParams.get("course");
    if (courseId && courses.some((course) => course.id === courseId)) {
      dispatch(setSelectedCourseId(courseId));
    }
  }, [courses, searchParams, dispatch]);

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
            Register for <span className="text-primary">RoboSpark</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Follow the steps below to complete your registration for our summer
            robotics program.
          </p>
        </motion.div>

        {currentStep < 5 && <RegistrationStepper />}

        <div className="mx-auto mt-8 max-w-4xl rounded-lg border bg-white p-6 shadow-sm md:p-8">
          {currentStep === 1 && <CourseSelection />}
          {currentStep === 2 && <ParentInfoForm />}
          {currentStep === 3 && <ChildInfoForm />}
          {currentStep === 4 && <ReviewAndPayment />}
          {currentStep === 5 && <RegistrationConfirmation />}
        </div>
      </div>
    </div>
  );
}
