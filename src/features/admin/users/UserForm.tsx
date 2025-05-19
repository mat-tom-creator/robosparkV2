import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchUserById,
  createUser,
  updateUser,
  selectIsUsersLoading,
} from "./adminUsersSlice";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Checkbox } from "../../../components/ui/Checkbox";
import { paths } from "../../../routes/paths";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  role: "user" | "admin";
};

export function UserForm() {
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = !!userId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUsersLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      role: "user",
    },
  });

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode && userId) {
      dispatch(fetchUserById(userId))
        .unwrap()
        .then((user) => {
          // Reset form with user data (excluding password fields)
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            confirmPassword: "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
            role: user.role || "user",
          });

          if (user.role === "admin") {
            setIsCreatingAdmin(true);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
        });
    }
  }, [userId, dispatch, isEditMode, reset]);

  // Watch password for validation
  const watchPassword = watch("password");

  // Handle form submission
  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);

      // Transform form data
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        role: data.role,
      };

      // Add password only if provided (for new users or password changes)
      if (data.password) {
        Object.assign(userData, { password: data.password });
      }

      if (isEditMode && userId) {
        await dispatch(updateUser({ id: userId, data: userData })).unwrap();
      } else {
        await dispatch(createUser(userData)).unwrap();
      }

      // Navigate back to user management page
      navigate(paths.adminUsers);
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">
          {isEditMode ? "Edit User" : "Add New User"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update the details of an existing user."
            : "Create a new user account."}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border bg-white p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">
              Basic Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={errors.firstName ? "border-red-300" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={errors.lastName ? "border-red-300" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                {...register("phone", {
                  pattern: {
                    value: /^[\\d\\+\\-\\(\\) ]{10,}$/i,
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

          {/* Password Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">
              {isEditMode ? "Change Password" : "Password"}
            </h2>

            {isEditMode && (
              <p className="text-sm text-gray-500">
                Leave the password fields blank if you don't want to change the
                password.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditMode ? "New Password" : "Password*"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: isEditMode ? false : "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={errors.password ? "border-red-300" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {isEditMode ? "Confirm New Password" : "Confirm Password*"}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: isEditMode
                      ? false
                      : "Please confirm your password",
                    validate: (value) =>
                      !watchPassword ||
                      value === watchPassword ||
                      "Passwords do not match",
                  })}
                  className={errors.confirmPassword ? "border-red-300" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">Address</h2>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                {...register("address")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Anytown" {...register("city")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="CA" {...register("state")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="12345"
                {...register("zipCode", {
                  pattern: {
                    value: /^\\d{5}(-\\d{4})?$/,
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

          {/* Role Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-secondary">Permissions</h2>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAdmin"
                checked={isCreatingAdmin}
                onCheckedChange={(checked) => setIsCreatingAdmin(!!checked)}
                {...register("role", {
                  onChange: (e) => {
                    const isChecked = e.target.checked;
                    setIsCreatingAdmin(isChecked);
                    return isChecked ? "admin" : "user";
                  },
                })}
              />
              <Label htmlFor="isAdmin" className="cursor-pointer">
                Grant administrator privileges
              </Label>
            </div>

            {isCreatingAdmin && (
              <div className="rounded-md bg-yellow-50 p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> Administrator accounts have full
                  access to all system functions, including user management,
                  course management, and reporting. Only grant this role to
                  trusted staff members.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(paths.adminUsers)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
