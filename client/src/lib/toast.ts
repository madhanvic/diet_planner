import type { ShowToaster, ToastInterface } from "../components/ui/Toast";

let toastCreator: ShowToaster;

export function createToastHandler(cb: ShowToaster) {
  toastCreator = cb;
}

export function showToast({ message, type }: ToastInterface) {
  toastCreator({ message, type });
}
