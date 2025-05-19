import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsAdminAuthenticated } from "../../features/auth/adminAuthSlice";
import { paths } from "../../routes/paths";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAdminAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={paths.adminLogin} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}
