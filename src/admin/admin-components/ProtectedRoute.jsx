import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const usertype = useSelector((state)=> state.auth["user_type"]);

  if (usertype !== "admin") {
    return <Navigate to="/" replace />; // Redirect non-admin users to home page
  }

  return children; // No authentication check, allows everything
};

export default ProtectedRoute;
