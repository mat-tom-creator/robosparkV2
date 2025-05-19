import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectUser,
  selectIsLoading,
  selectAuthError,
  clearError,
  updateUserProfile,
} from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// Profile form data interface
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

// Password form data interface
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function AccountSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  // State for tab management and notifications
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "notifications"
  >("profile");
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile form setup with React Hook Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: profileIsDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
    },
  });

  // Password form setup
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  const newPassword = watchPassword("newPassword", "");

  // Notification preferences form
  const [emailNotifications, setEmailNotifications] = useState({
    courseReminders: true,
    marketingEmails: false,
    paymentReceipts: true,
    accountUpdates: true,
  });

  // Update profile handler
  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      setUpdateSuccess("Your profile has been updated successfully.");

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Change password handler
  const onChangePassword = async (data: PasswordFormData) => {
    try {
      // In a real app, you would call an API endpoint to change the password
      // For this example, we'll just show a success message
      console.log("Changing password:", data);

      resetPassword();
      setUpdateSuccess("Your password has been changed successfully.");

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = () => {
    // In a real app, you would call an API endpoint to update notification preferences
    console.log("Updating notification preferences:", emailNotifications);

    setUpdateSuccess(
      "Your notification preferences have been updated successfully."
    );
    setTimeout(() => setUpdateSuccess(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information, security settings, and notification
          preferences
        </p>
      </div>

      {/* Error message */}
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

      {/* Success message */}
      {updateSuccess && (
        <div className="flex items-center rounded-md bg-green-50 p-4 text-green-700">
          <CheckCircle className="mr-2 h-5 w-5" />
          <div>{updateSuccess}</div>
          <button
            onClick={() => setUpdateSuccess(null)}
            className="ml-auto text-green-700 hover:text-green-900"
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`pb-4 pt-2 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`pb-4 pt-2 text-sm font-medium ${
              activeTab === "password"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
          <button
            className={`pb-4 pt-2 text-sm font-medium ${
              activeTab === "notifications"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notification Preferences
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <form
            onSubmit={handleSubmitProfile(onUpdateProfile)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    className={`pl-10 ${profileErrors.firstName ? "border-red-300" : ""}`}
                    {...registerProfile("firstName", {
                      required: "First name is required",
                    })}
                  />
                </div>
                {profileErrors.firstName && (
                  <p className="text-sm text-red-500">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className={`pl-10 ${profileErrors.lastName ? "border-red-300" : ""}`}
                    {...registerProfile("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </div>
                {profileErrors.lastName && (
                  <p className="text-sm text-red-500">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`pl-10 ${profileErrors.email ? "border-red-300" : ""}`}
                    {...registerProfile("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    disabled // Email cannot be changed
                  />
                </div>
                {profileErrors.email && (
                  <p className="text-sm text-red-500">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className={`pl-10 ${profileErrors.phone ? "border-red-300" : ""}`}
                    {...registerProfile("phone", {
                      pattern: {
                        value: /^[\d\+\-\(\) ]{10,}$/i,
                        message: "Invalid phone number",
                      },
                    })}
                  />
                </div>
                {profileErrors.phone && (
                  <p className="text-sm text-red-500">
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                {...registerProfile("address")}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Anytown"
                  {...registerProfile("city")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  {...registerProfile("state")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  {...registerProfile("zipCode")}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !profileIsDirty}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <form
            onSubmit={handleSubmitPassword(onChangePassword)}
            className="space-y-6"
          >
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 ${passwordErrors.currentPassword ? "border-red-300" : ""}`}
                  {...registerPassword("currentPassword", {
                    required: "Current password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      current: !showPassword.current,
                    })
                  }
                >
                  {showPassword.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 ${passwordErrors.newPassword ? "border-red-300" : ""}`}
                  {...registerPassword("newPassword", {
                    required: "New password is required",
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setShowPassword({ ...showPassword, new: !showPassword.new })
                  }
                >
                  {showPassword.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 ${passwordErrors.confirmPassword ? "border-red-300" : ""}`}
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                >
                  {showPassword.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
              <p className="font-medium">Password requirements:</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>At least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one lowercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Email Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage how and when you receive email notifications from
                RoboSpark
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="courseReminders"
                  checked={emailNotifications.courseReminders}
                  onChange={() =>
                    setEmailNotifications({
                      ...emailNotifications,
                      courseReminders: !emailNotifications.courseReminders,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <Label
                    htmlFor="courseReminders"
                    className="font-medium text-gray-900"
                  >
                    Course Reminders
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about upcoming classes, schedule
                    changes, and course information
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="marketingEmails"
                  checked={emailNotifications.marketingEmails}
                  onChange={() =>
                    setEmailNotifications({
                      ...emailNotifications,
                      marketingEmails: !emailNotifications.marketingEmails,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <Label
                    htmlFor="marketingEmails"
                    className="font-medium text-gray-900"
                  >
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive promotional offers, new course announcements, and
                    newsletter updates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="paymentReceipts"
                  checked={emailNotifications.paymentReceipts}
                  onChange={() =>
                    setEmailNotifications({
                      ...emailNotifications,
                      paymentReceipts: !emailNotifications.paymentReceipts,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <Label
                    htmlFor="paymentReceipts"
                    className="font-medium text-gray-900"
                  >
                    Payment Receipts
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive email receipts for payments, refunds, and billing
                    information
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="accountUpdates"
                  checked={emailNotifications.accountUpdates}
                  onChange={() =>
                    setEmailNotifications({
                      ...emailNotifications,
                      accountUpdates: !emailNotifications.accountUpdates,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <Label
                    htmlFor="accountUpdates"
                    className="font-medium text-gray-900"
                  >
                    Account Updates
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about account security, password
                    changes, and profile updates
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Button
                onClick={updateNotificationPreferences}
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
