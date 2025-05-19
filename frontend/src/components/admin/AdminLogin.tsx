import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  adminLogin,
  selectAdminAuthError,
  selectIsAdminLoading,
  clearAdminAuthError,
} from "../../features/auth/adminAuthSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { paths } from "../../routes/paths";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export function AdminLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectIsAdminLoading);
  const error = useAppSelector(selectAdminAuthError);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const resultAction = await dispatch(adminLogin(data));
      if (adminLogin.fulfilled.match(resultAction)) {
        navigate(paths.admin);
      }
    } catch (error) {
      console.error("Admin login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-6 rounded-lg bg-white p-8 shadow-md"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
              <p className="mt-2 text-gray-600">
                Sign in to access the RoboSpark admin panel
              </p>
            </div>

            {error && (
              <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                <div>{error}</div>
                <button
                  onClick={() => dispatch(clearAdminAuthError())}
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
                    placeholder="admin@robospark.com"
                    className={`pl-10 ${errors.email ? "border-red-300" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,}$/i,
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
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
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
          </motion.div>
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-primary opacity-90"></div>
        <img
          src="<https://via.placeholder.com/1920x1080>"
          alt="Admin dashboard"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">RoboSpark Admin</h2>
          <p className="mt-2 max-w-md text-center text-lg">
            Manage courses, users, and registrations for the RoboSpark Summer
            Program.
          </p>
        </div>
      </div>
    </div>
  );
}
