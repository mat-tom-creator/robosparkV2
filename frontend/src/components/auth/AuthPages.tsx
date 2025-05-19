import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegistrationForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginForm />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <img
          src="https://via.placeholder.com/1920x1080"
          alt="Children learning robotics"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Welcome to RoboSpark</h2>
          <p className="mt-2 max-w-md text-center text-lg">
            Sign in to manage your registrations, track progress, and explore
            our exciting robotics courses.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <RegisterForm />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <img
          src="https://via.placeholder.com/1920x1080"
          alt="Children learning robotics"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Join RoboSpark</h2>
          <p className="mt-2 max-w-md text-center text-lg">
            Create an account to register for our robotics courses and unlock a
            world of learning and innovation for your child.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <ForgotPasswordForm />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <img
          src="https://via.placeholder.com/1920x1080"
          alt="Children learning robotics"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Reset Your Password</h2>
          <p className="mt-2 max-w-md text-center text-lg">
            We'll help you get back into your account with a secure password
            reset process.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <ResetPasswordForm />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <img
          src="https://via.placeholder.com/1920x1080"
          alt="Children learning robotics"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Create a New Password</h2>
          <p className="mt-2 max-w-md text-center text-lg">
            Set a secure password to protect your RoboSpark account and access
            all your account features.
          </p>
        </div>
      </div>
    </div>
  );
}
