import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user === null) return <div className="text-center py-5">Checking session...</div>;
  if (user === false) return <Navigate to="/login" replace />;

  return children;
}
