import {
  cloneElement,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type DOMAttributes,
  type SetStateAction,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface ModalContext {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}

const initialState: ModalContext = {
  showModal: false,
  setShowModal: () => {},
};

const ModalCtx = createContext<ModalContext>(initialState);

interface ModalProps {
  children: React.ReactElement | React.ReactElement[];
  onClose?: () => void;
  defaultOpen?: boolean;
}

function Modal({ children, onClose, defaultOpen = false }: ModalProps) {
  const [showModal, setShowModal] = useState(defaultOpen);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, onClose]);

  const value = useMemo(() => ({ showModal, setShowModal }), [showModal]);

  return <ModalCtx.Provider value={value}>{children}</ModalCtx.Provider>;
}

function ModalContent({
  children,
  className = "",
  ariaLabel = "Modal dialog",
  backdropAction = true,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  backdropAction?: boolean;
}) {
  const { showModal } = useContext(ModalCtx);
  return (
    showModal && (
      <>
        <Backdrop backdropAction={backdropAction} />
        {createPortal(
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-h-[90vh] overflow-y-auto shadow-lg z-50 ${className}`}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            {children}
          </div>,
          document.body
        )}
      </>
    )
  );
}

function ModalOpenBtn({
  children,
}: {
  children: React.ReactElement<DOMAttributes<HTMLButtonElement>>;
}) {
  const { setShowModal } = useContext(ModalCtx);
  const onModalOpen = () => {
    setShowModal(true);
  };
  return cloneElement(children, { onClick: onModalOpen });
}

function ModalCloseBtn({
  children,
}: {
  children: React.ReactElement<DOMAttributes<HTMLButtonElement>>;
}) {
  const { setShowModal } = useContext(ModalCtx);
  const onModalClose = () => {
    setShowModal(false);
  };
  return cloneElement(children, { onClick: onModalClose });
}

function Backdrop({
  className = "",
  backdropAction,
}: {
  className?: string;
  backdropAction?: boolean;
}) {
  const { setShowModal } = useContext(ModalCtx);
  return createPortal(
    <div
      onClick={() => {
        if (!backdropAction) return;
        setShowModal(false);
      }}
      className={`left-0 top-0 fixed w-screen h-screen bg-[#1e1e1e]/40 z-40 ${className}`}
      aria-label="Close modal"
      tabIndex={-1}
    ></div>,
    document.body
  );
}

Modal.openBtn = ModalOpenBtn;
Modal.closeBtn = ModalCloseBtn;
Modal.content = ModalContent;
export default Modal;
