import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout } from "../../features/auth/authSlice";
import { paths } from "../../routes/paths";
import {
  User,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: paths.dashboard, icon: Home },
  { name: "My Courses", href: `${paths.dashboard}/courses`, icon: Calendar },
  {
    name: "Payment History",
    href: `${paths.dashboard}/payments`,
    icon: CreditCard,
  },
  {
    name: "Account Settings",
    href: `${paths.dashboard}/settings`,
    icon: Settings,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(paths.home);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar overlay */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            ></motion.div>
          )}

          {/* Sidebar */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: isMobileMenuOpen ? 0 : -280 }}
            transition={{ duration: 0.2 }}
            className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5"
          >
            {/* Close button */}
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to={paths.home} className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  Robo<span className="text-accent">Spark</span>
                </span>
              </Link>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center rounded-md px-2 py-2 text-base font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`${
                        location.pathname === item.href
                          ? "text-primary"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  Sign Out
                </button>
              </nav>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow md:hidden">
        <button
          type="button"
          className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-1 items-center justify-center px-4">
          <Link to={paths.home} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              Robo<span className="text-accent">Spark</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to={paths.home} className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  Robo<span className="text-accent">Spark</span>
                </span>
              </Link>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative inline-block">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                  <User className="h-full w-full p-4 text-gray-400" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 h-5 w-5 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
