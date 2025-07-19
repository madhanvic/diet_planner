import { Provider } from "react-redux";
import { Outlet } from "react-router";
import store from "../store/store";
import ToastProvider from "../components/ui/Toast";
import AuthProvider from "../features/auth/AuthProvider";
import MetricsProvider from "../features/metrics/MetricsProvider";

function Injector() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <MetricsProvider>
            <Outlet />
          </MetricsProvider>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}

export default Injector;
