import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { adminLogout } from "../../features/auth/adminAuthSlice";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { paths } from "../../routes/paths";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: paths.admin, icon: LayoutDashboard },
  { name: "Courses", href: `${paths.admin}/courses`, icon: BookOpen },
  { name: "Users", href: `${paths.admin}/users`, icon: Users },
  { name: "Reports", href: `${paths.admin}/reports`, icon: BarChart },
  { name: "Settings", href: `${paths.admin}/settings`, icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate(paths.adminLogin);
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
            className="relative flex w-full max-w-xs flex-1 flex-col bg-secondary pt-5"
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
              <Link to={paths.admin} className="flex items-center">
                <span className="text-2xl font-bold text-white">
                  Robo<span className="text-accent">Spark</span>
                </span>
                <span className="ml-2 rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-white">
                  Admin
                </span>
              </Link>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto pb-4">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "bg-secondary-dark text-white"
                        : "text-secondary-foreground hover:bg-secondary-dark/50 hover:text-white"
                    } group flex items-center rounded-md px-2 py-2 text-base font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`${
                        location.pathname === item.href
                          ? "text-white"
                          : "text-secondary-foreground group-hover:text-white"
                      } mr-4 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary-dark/50 hover:text-white"
                >
                  <LogOut className="mr-4 h-6 w-6 flex-shrink-0 text-secondary-foreground group-hover:text-white" />
                  Logout
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
        <div className="flex flex-1 items-center justify-between px-4">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary">
              Robo<span className="text-accent">Spark</span>
              <span className="ml-2 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Admin
              </span>
            </span>
          </div>
          <div>
            <button className="relative p-1 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-secondary">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to={paths.admin} className="flex items-center">
                <span className="text-2xl font-bold text-white">
                  Robo<span className="text-accent">Spark</span>
                </span>
                <span className="ml-2 rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-white">
                  Admin
                </span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? "bg-secondary-dark text-white"
                      : "text-secondary-foreground hover:bg-secondary-dark/50 hover:text-white"
                  } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href
                        ? "text-white"
                        : "text-secondary-foreground group-hover:text-white"
                    } mr-3 h-5 w-5 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary-dark/50 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-secondary-foreground group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Desktop header */}
        <div className="sticky top-0 z-10 hidden bg-white pl-1 pt-1 shadow md:flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-2xl font-semibold text-secondary">
                Admin Dashboard
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="relative p-1 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

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
