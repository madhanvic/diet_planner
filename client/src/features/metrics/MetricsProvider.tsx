import Modal from "../../components/ui/Modal";
import { useAppSelector } from "../../store/hooks";
import { getAuthSlice } from "../auth/authSlice";
import MetricsForm from "./MetricsForm";

function MetricsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthorized, session } = useAppSelector(getAuthSlice);

  console.log(isAuthorized);

  console.log(session);

  return (
    <>
      {children}
      {isAuthorized && session !== null && session.activePlan === null && (
        <Modal
          defaultOpen={
            isAuthorized && session !== null && session.activePlan === null
          }
        >
          <Modal.content backdropAction={false}>
            <MetricsForm />
          </Modal.content>
        </Modal>
      )}
    </>
  );
}

export default MetricsProvider;
