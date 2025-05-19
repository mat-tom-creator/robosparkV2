import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectIsAuthenticated,
  selectUser,
  logout,
} from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the document click handler
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(paths.home);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={paths.home} className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl font-bold text-primary">
              Robo<span className="text-accent">Spark</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link to={paths.home} className="text-secondary hover:text-primary">
            Home
          </Link>
          <Link
            to={paths.courses}
            className="text-secondary hover:text-primary"
          >
            Courses
          </Link>
          <Link to={paths.about} className="text-secondary hover:text-primary">
            About
          </Link>
          <Link
            to={paths.contact}
            className="text-secondary hover:text-primary"
          >
            Contact
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-secondary hover:bg-gray-50"
                onClick={toggleUserMenu}
              >
                <span>{user?.firstName}</span>
                <User className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <Link
                    to={paths.dashboard}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`${paths.dashboard}/courses`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                  <Link
                    to={`${paths.dashboard}/payments`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Payment History
                  </Link>
                  <Link
                    to={`${paths.dashboard}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to={paths.login}>Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={paths.courseRegister}>Register for Course</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="p-2 text-secondary md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 md:hidden"
        >
          <div className="container mx-auto flex flex-col space-y-3 px-4 py-3">
            <Link
              to={paths.home}
              className="py-2 text-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={paths.courses}
              className="py-2 text-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to={paths.about}
              className="py-2 text-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={paths.contact}
              className="py-2 text-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-sm font-medium text-gray-500">
                    Welcome, {user?.firstName}
                  </p>
                </div>
                <Link
                  to={paths.dashboard}
                  className="py-2 text-secondary hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={`${paths.dashboard}/courses`}
                  className="py-2 text-secondary hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Courses
                </Link>
                <Link
                  to={`${paths.dashboard}/payments`}
                  className="py-2 text-secondary hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Payment History
                </Link>
                <Link
                  to={`${paths.dashboard}/settings`}
                  className="py-2 text-secondary hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  className="flex items-center py-2 text-red-600 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to={paths.login}>Sign In</Link>
                </Button>
                <Button onClick={() => setIsMenuOpen(false)} asChild>
                  <Link to={paths.courseRegister}>Register for Course</Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
