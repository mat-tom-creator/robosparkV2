import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();
  const password = watch("password", "");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await authService.resetPassword({
        token,
        password: data.password,
      });

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-2xl font-bold text-secondary">Reset Password</h2>
        <p className="mt-2 text-gray-600">
          Create a new password for your account
        </p>
      </div>

      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      {success ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-md bg-green-50 p-6 text-green-700">
            <CheckCircle className="mb-2 h-10 w-10" />
            <h3 className="text-lg font-semibold">Password Reset Successful</h3>
            <p className="mt-1 text-center">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="password">New Password</Label>
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
