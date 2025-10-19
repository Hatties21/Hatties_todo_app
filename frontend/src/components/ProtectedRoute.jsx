import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return null; // có thể thêm spinner
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
