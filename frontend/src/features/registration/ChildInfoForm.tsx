import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ChildInfo,
  EmergencyContact,
  selectChildInfo,
  selectEmergencyContact,
  updateChildInfo,
  updateEmergencyContact,
  setCurrentStep,
} from "./registrationSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function ChildInfoForm() {
  const dispatch = useAppDispatch();
  const childInfo = useAppSelector(selectChildInfo);
  const emergencyContact = useAppSelector(selectEmergencyContact);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{
    childInfo: ChildInfo;
    emergencyContact: EmergencyContact;
  }>({
    defaultValues: {
      childInfo,
      emergencyContact,
    },
    mode: "onChange",
  });

  const onSubmit = (data: {
    childInfo: ChildInfo;
    emergencyContact: EmergencyContact;
  }) => {
    dispatch(updateChildInfo(data.childInfo));
    dispatch(updateEmergencyContact(data.emergencyContact));
    dispatch(setCurrentStep(4));
  };

  const goBack = () => {
    dispatch(setCurrentStep(2));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-secondary">
          Participant Information
        </h2>
        <p className="text-gray-600">
          Please provide information about the child who will be attending the
          robotics course.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Child Information Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-secondary">
            Child Details
          </h3>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="childFirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name*
                </label>
                <Input
                  id="childFirstName"
                  {...register("childInfo.firstName", {
                    required: "First name is required",
                  })}
                  className={
                    errors.childInfo?.firstName ? "border-red-300" : ""
                  }
                />
                {errors.childInfo?.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.childInfo.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="childLastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name*
                </label>
                <Input
                  id="childLastName"
                  {...register("childInfo.lastName", {
                    required: "Last name is required",
                  })}
                  className={errors.childInfo?.lastName ? "border-red-300" : ""}
                />
                {errors.childInfo?.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.childInfo.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth*
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("childInfo.dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                  className={
                    errors.childInfo?.dateOfBirth ? "border-red-300" : ""
                  }
                />
                {errors.childInfo?.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {errors.childInfo.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gradeLevel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grade Level*
                </label>
                <select
                  id="gradeLevel"
                  {...register("childInfo.gradeLevel", {
                    required: "Grade level is required",
                  })}
                  className={`w-full rounded-md border ${
                    errors.childInfo?.gradeLevel
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Select Grade Level</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
                {errors.childInfo?.gradeLevel && (
                  <p className="text-sm text-red-500">
                    {errors.childInfo.gradeLevel.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700"
              >
                Allergies or Medical Conditions
              </label>
              <Input
                id="allergies"
                placeholder="List any allergies or medical conditions, or type 'None' if none exist"
                {...register("childInfo.allergies")}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="specialNeeds"
                className="block text-sm font-medium text-gray-700"
              >
                Special Needs or Accommodations
              </label>
              <textarea
                id="specialNeeds"
                rows={3}
                placeholder="Please describe any special needs or accommodations required, or type 'None' if none needed"
                {...register("childInfo.specialNeeds")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-secondary">
            Emergency Contact
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="emergencyName"
                className="block text-sm font-medium text-gray-700"
              >
                Emergency Contact Name*
              </label>
              <Input
                id="emergencyName"
                {...register("emergencyContact.name", {
                  required: "Emergency contact name is required",
                })}
                className={
                  errors.emergencyContact?.name ? "border-red-300" : ""
                }
              />
              {errors.emergencyContact?.name && (
                <p className="text-sm text-red-500">
                  {errors.emergencyContact.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="emergencyRelationship"
                  className="block text-sm font-medium text-gray-700"
                >
                  Relationship to Child*
                </label>
                <Input
                  id="emergencyRelationship"
                  {...register("emergencyContact.relationship", {
                    required: "Relationship is required",
                  })}
                  className={
                    errors.emergencyContact?.relationship
                      ? "border-red-300"
                      : ""
                  }
                />
                {errors.emergencyContact?.relationship && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContact.relationship.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="emergencyPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergency Phone Number*
                </label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  {...register("emergencyContact.phone", {
                    required: "Emergency phone number is required",
                    pattern: {
                      value: /^[\d\+\-\(\) ]{10,}$/i,
                      message: "Invalid phone number",
                    },
                  })}
                  className={
                    errors.emergencyContact?.phone ? "border-red-300" : ""
                  }
                />
                {errors.emergencyContact?.phone && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContact.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={goBack}>
            Back
          </Button>
          <Button type="submit" disabled={!isValid}>
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
