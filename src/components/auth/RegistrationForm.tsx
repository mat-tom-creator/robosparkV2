import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  register as registerUser,
  selectAuthError,
  selectIsLoading,
  clearError,
} from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Checkbox } from "../../components/ui/Checkbox";
import { User, Mail, Lock, Phone, AlertCircle } from "lucide-react";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return; // Form validation will handle this
    }

    try {
      const { confirmPassword, agreedToTerms, ...userData } = data;

      const resultAction = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary">Create Account</h2>
        <p className="mt-2 text-gray-600">
          Join RoboSpark and register for our robotics courses
        </p>
      </div>

      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
          <button
            onClick={() => dispatch(clearError())}
            className="ml-auto text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="firstName"
                placeholder="John"
                className={`pl-10 ${errors.firstName ? "border-red-300" : ""}`}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="lastName"
                placeholder="Doe"
                className={`pl-10 ${errors.lastName ? "border-red-300" : ""}`}
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className={`pl-10 ${errors.email ? "border-red-300" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className={`pl-10 ${errors.phone ? "border-red-300" : ""}`}
              {...register("phone", {
                pattern: {
                  value: /^[\d\+\-\(\) ]{10,}$/i,
                  message: "Invalid phone number",
                },
              })}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 ${errors.password ? "border-red-300" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must include uppercase, lowercase, number and special character",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 ${errors.confirmPassword ? "border-red-300" : ""}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <div className="pt-1">
            <Checkbox
              id="agreedToTerms"
              {...register("agreedToTerms", {
                required: "You must agree to the terms and conditions",
              })}
            />
          </div>
          <div>
            <Label
              htmlFor="agreedToTerms"
              className={errors.agreedToTerms ? "text-red-500" : ""}
            >
              I agree to the Terms and Conditions and Privacy Policy
            </Label>
            {errors.agreedToTerms && (
              <p className="text-sm text-red-500">
                {errors.agreedToTerms.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
