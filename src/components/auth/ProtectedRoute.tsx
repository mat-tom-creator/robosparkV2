import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectIsAuthenticated,
  selectUser,
  getUserProfile,
} from "../../features/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Check authentication status on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin route but user is not admin, redirect to dashboard
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and meets role requirements, render children
  return <>{children}</>;
}
