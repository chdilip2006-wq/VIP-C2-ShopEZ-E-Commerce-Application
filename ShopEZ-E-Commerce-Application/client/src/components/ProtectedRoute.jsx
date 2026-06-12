import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, admin = false }) {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && !user?.isAdmin) return <Navigate to="/" replace />;
  return children;
}
