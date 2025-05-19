import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSelectedCourseId, resetRegistration } from "./registrationSlice";
import { resetDiscount } from "./discountSlice";
import { useGetCourseByIdQuery } from "../../services/courseApi";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";
import { CheckCircle, Calendar, Download, Mail } from "lucide-react";

export function RegistrationConfirmation() {
  const dispatch = useAppDispatch();
  const selectedCourseId = useAppSelector(selectSelectedCourseId);
  const { data: course } = useGetCourseByIdQuery(selectedCourseId || "");

  // Generate a random confirmation number
  const confirmationNumber = `RB${Math.floor(100000 + Math.random() * 900000)}`;

  // Reset registration state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetRegistration());
      dispatch(resetDiscount());
    };
  }, [dispatch]);

  if (!course) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl space-y-6 text-center"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-secondary">
          Registration Complete!
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Thank you for registering for RoboSpark Summer Sessions.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">
            Confirmation Number
          </p>
          <p className="text-xl font-bold text-primary">{confirmationNumber}</p>
        </div>

        <div className="mb-4 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-500">Course</p>
          <p className="font-semibold text-secondary">{course.title}</p>
        </div>

        <div className="flex items-center justify-center space-x-6 border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="font-semibold text-secondary">
              {new Date(course.schedule.startDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Schedule</p>
            <p className="font-semibold text-secondary">
              {course.schedule.days.join(", ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p className="font-semibold text-secondary">
              {course.schedule.timeSlot}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-center">
        <p className="text-gray-600">
          A confirmation email has been sent with all the details of your
          registration. Please check your inbox.
        </p>

        <div className="inline-flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Details
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4 rounded-lg bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-secondary">What's Next?</h3>

        <ol className="text-left">
          <li className="mb-2">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              1
            </span>
            <span className="text-gray-700">
              Check your email for detailed information.
            </span>
          </li>
          <li className="mb-2">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              2
            </span>
            <span className="text-gray-700">
              Complete the pre-course questionnaire (sent via email).
            </span>
          </li>
          <li>
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              3
            </span>
            <span className="text-gray-700">
              Mark your calendar and prepare for an exciting summer of robotics!
            </span>
          </li>
        </ol>
      </div>

      <div className="pt-4">
        <Button asChild>
          <Link to={paths.home}>Return to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
