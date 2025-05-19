import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentStep } from "./registrationSlice";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Course Selection" },
  { id: 2, name: "Parent Information" },
  { id: 3, name: "Child Information" },
  { id: 4, name: "Review & Payment" },
  { id: 5, name: "Confirmation" },
];

export function RegistrationStepper() {
  const currentStep = useAppSelector(selectCurrentStep);

  return (
    <div className="py-4">
      <nav className="flex justify-center" aria-label="Progress">
        <ol className="flex w-full max-w-3xl items-center">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`flex-1 ${index === steps.length - 1 ? "" : "md:pr-8"}`}
            >
              <div className="flex flex-col items-center md:flex-row">
                <div className="flex items-center">
                  {step.id < currentStep ? (
                    // Completed step
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                    >
                      <Check className="h-5 w-5 text-white" />
                    </motion.div>
                  ) : step.id === currentStep ? (
                    // Current step
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-semibold text-primary"
                    >
                      {step.id}
                    </motion.div>
                  ) : (
                    // Upcoming step
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-sm font-medium text-gray-500">
                      {step.id}
                    </div>
                  )}
                </div>

                {/* Step name */}
                <div
                  className={`mt-2 text-center text-sm md:ml-2 md:mt-0 md:text-left
                  ${
                    step.id < currentStep
                      ? "font-medium text-primary"
                      : step.id === currentStep
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-500"
                  }`}
                >
                  {step.name}
                </div>

                {/* Connector line between steps (hidden for last step) */}
                {index < steps.length - 1 && (
                  <div className="invisible h-0 flex-1 border-t border-gray-300 md:visible md:ml-3 md:h-auto"></div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
