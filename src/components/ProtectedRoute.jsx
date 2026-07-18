import { Navigate } from "react-router-dom";
import { getStoredUser, homeForRole } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to={homeForRole(user?.role)} replace />;
  return children;
};

export default ProtectedRoute;
