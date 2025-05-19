import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  login,
  selectAuthError,
  selectIsLoading,
  clearError,
} from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Lock, Mail, AlertCircle } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Get redirect path from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(login(data));
      if (login.fulfilled.match(resultAction)) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
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
        <h2 className="text-2xl font-bold text-secondary">Welcome Back</h2>
        <p className="mt-2 text-gray-600">Sign in to your RoboSpark account</p>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account?</span>{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}
