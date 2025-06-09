import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { isAuth} = useContext(AuthContext);
  const location = useLocation();

  return isAuth === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}