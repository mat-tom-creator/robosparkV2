import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await authService.resetPasswordRequest(data.email);
      setSuccess(true);
    } catch (error: any) {
      setError(
        error.message ||
          "Failed to send password reset request. Please try again."
      );
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
        <h2 className="text-2xl font-bold text-secondary">Forgot Password</h2>
        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password
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
            <h3 className="text-lg font-semibold">Reset Link Sent</h3>
            <p className="mt-1 text-center">
              If an account exists with that email, we've sent a password reset
              link. Please check your inbox and follow the instructions.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
}
