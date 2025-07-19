import { Navigate } from "react-router";
import { getAuthSlice } from "../features/auth/authSlice";
import { useAppSelector } from "../store/hooks";
import Loader from "../pages/Loader";

interface ProtectedRouteProps {
  children: React.ReactElement | React.ReactElement[];
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized, session, isAuthorizig } = useAppSelector(getAuthSlice);

  return isAuthorizig ? (
    <Loader />
  ) : !isAuthorized && session === null ? (
    <Navigate to="/login" />
  ) : (
    children
  );
}

export default ProtectedRoute;
