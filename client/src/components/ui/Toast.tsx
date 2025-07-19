import { useCallback, useEffect, useMemo, useState } from "react";
import { createToastHandler } from "../../lib/toast";
import { nanoid } from "@reduxjs/toolkit";
import type { ChildrenProps } from "../../types";
import ToastCtx from "./ToastCtx";

import type { SetStateAction } from "react";

export interface ToastInterface {
  id?: string;
  message: string;
  type: "success" | "fail" | "info";
}

export interface ToastCtxInterface {
  createToast: (a: ToastInterface) => void;
}

export interface ToastMessageProps {
  toast: ToastInterface;
  setToastList: React.Dispatch<SetStateAction<ToastInterface[]>>;
}

export type ShowToaster = (a: ToastInterface) => void;

function ToastProvider({ children }: ChildrenProps) {
  const [toastList, setToastList] = useState<ToastInterface[]>([]);

  const createToast = useCallback(function (toast: ToastInterface) {
    setToastList((prevToast) => {
      return [
        ...prevToast,
        {
          id: nanoid(),
          ...toast,
        },
      ];
    });
  }, []);

  useEffect(() => {
    createToastHandler(createToast);
  }, [createToast]);

  const value = useMemo(() => {
    return {
      createToast: createToast,
    };
  }, [createToast]);

  return (
    <>
      <ToastCtx.Provider value={value}>{children}</ToastCtx.Provider>
      {toastList.length > 0 && (
        <ul className="fixed right-2 top-10 min-w-[300px] space-y-4">
          {toastList.map((toast) => {
            return (
              <ToastMessage
                key={toast.id}
                toast={toast}
                setToastList={setToastList}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}

function ToastMessage({ toast, setToastList }: ToastMessageProps) {
  useEffect(() => {
    const updateToastList = () => {
      setToastList((prevToasts) => {
        const filteredToast = prevToasts.filter(
          (prevToast) => prevToast.id !== toast.id
        );
        return filteredToast;
      });
    };
    const id = setTimeout(updateToastList, 2000);

    return () => {
      clearTimeout(id);
    };
  }, [setToastList, toast.id]);

  return (
    <li
      className={`${
        toast.type === "info"
          ? "bg-gray-300"
          : toast.type === "success"
          ? "bg-green-300"
          : "bg-red-300"
      } text-white text-sm px-4 py-3 rounded-md`}
    >
      {toast.message}
    </li>
  );
}

export default ToastProvider;
