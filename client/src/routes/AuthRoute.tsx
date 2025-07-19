import { Navigate } from "react-router";
import { getAuthSlice } from "../features/auth/authSlice";
import { useAppSelector } from "../store/hooks";
import Loader from "../pages/Loader";

function AuthRoute({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const { isAuthorized, isAuthorizig } = useAppSelector(getAuthSlice);

  return isAuthorizig ? (
    <Loader />
  ) : isAuthorized ? (
    <Navigate to={`/dashboard/activePlan`} />
  ) : (
    children
  );
}

export default AuthRoute;
