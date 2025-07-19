import { cloneElement, type DOMAttributes } from "react";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../auth/authSlice";

function LogoutBtn({
  children,
}: {
  children: React.ReactElement<DOMAttributes<HTMLButtonElement>>;
}) {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return cloneElement(children, { onClick: onLogout });
}

export default LogoutBtn;
