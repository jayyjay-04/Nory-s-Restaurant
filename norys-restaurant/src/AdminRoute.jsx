import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.email !== "jayrlopez367@gmail.com") {
    // Not logged in or not the admin
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default AdminRoute;
