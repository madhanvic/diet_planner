import { createContext } from "react";
import type { ToastCtxInterface } from "./Toast";

const ToastCtx = createContext<ToastCtxInterface>({
  createToast: () => {},
});

export default ToastCtx;
