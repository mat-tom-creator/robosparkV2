import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ParentInfo,
  selectParentInfo,
  updateParentInfo,
  setCurrentStep,
} from "./registrationSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function ParentInfoForm() {
  const dispatch = useAppDispatch();
  const parentInfo = useAppSelector(selectParentInfo);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ParentInfo>({
    defaultValues: parentInfo,
    mode: "onChange",
  });

  const onSubmit = (data: ParentInfo) => {
    dispatch(updateParentInfo(data));
    dispatch(setCurrentStep(3));
  };

  const goBack = () => {
    dispatch(setCurrentStep(1));
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
          Parent/Guardian Information
        </h2>
        <p className="text-gray-600">
          Please provide your contact details as the parent or guardian
          registering the child.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name*
            </label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              className={errors.firstName ? "border-red-300" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name*
            </label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
              className={errors.lastName ? "border-red-300" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address*
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={errors.email ? "border-red-300" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number*
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[\d\+\-\(\) ]{10,}$/i,
                  message: "Invalid phone number",
                },
              })}
              className={errors.phone ? "border-red-300" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Street Address*
          </label>
          <Input
            id="address"
            {...register("address", { required: "Address is required" })}
            className={errors.address ? "border-red-300" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City*
            </label>
            <Input
              id="city"
              {...register("city", { required: "City is required" })}
              className={errors.city ? "border-red-300" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State*
            </label>
            <Input
              id="state"
              {...register("state", { required: "State is required" })}
              className={errors.state ? "border-red-300" : ""}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700"
            >
              ZIP Code*
            </label>
            <Input
              id="zipCode"
              {...register("zipCode", {
                required: "ZIP code is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "Invalid ZIP code",
                },
              })}
              className={errors.zipCode ? "border-red-300" : ""}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode.message}</p>
            )}
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
