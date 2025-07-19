import { createPortal } from "react-dom";
import Spinner from "./Spinner";

function OverlayLoader() {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/10">
      <div>
        <Spinner size={42} className="text-white" />
      </div>
    </div>,
    document.body
  );
}

export default OverlayLoader;
