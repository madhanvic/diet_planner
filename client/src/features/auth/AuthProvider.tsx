import Spinner from "../../components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearSession, getAuthSlice, setSession } from "./authSlice";

import { useEffect } from "react";

function AuthProvider({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const { isAuthorized, isAuthorizig } = useAppSelector(getAuthSlice);
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");
  const session = localStorage.getItem("session");

  const haveTokem = token !== null && token !== undefined;

  const havSession = session !== null && session !== undefined;

  useEffect(() => {
    if (!isAuthorized && haveTokem && havSession) {
      const parsedSession = JSON.parse(session);
      dispatch(setSession(parsedSession));
    } else {
      dispatch(clearSession());
    }
  }, [isAuthorized, haveTokem, havSession, dispatch, session]);

  return isAuthorizig ? (
    <main className="h-screen flex items-center justify-center">
      <Spinner size={42} />
    </main>
  ) : (
    children
  );
}

export default AuthProvider;
