import { useContext } from "react";
import ToastCtx from "../components/ui/ToastCtx";

function useToast() {
  const ctx = useContext(ToastCtx);

  return ctx;
}

export default useToast;
