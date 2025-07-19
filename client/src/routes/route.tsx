import {
  createRoutesFromElements,
  Route,
  type RouteObject,
} from "react-router";
import Root from "../layouts/Root";
import Register from "../pages/Register";
import ActivePlan from "../pages/ActivePlan";
import Injector from "../injector/Injector";
import Login from "../pages/Login";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import UpdatePlan from "../pages/UpdatePlan";
import Error from "../pages/Error";
import NotFound from "../pages/NotFoud";

const routes: RouteObject[] = createRoutesFromElements(
  <>
    <Route path="" element={<Injector />} errorElement={<Error />}>
      <Route path="/dashboard" element={<Root />}>
        <Route
          index={true}
          element={
            <ProtectedRoute>
              <ActivePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="activePlan"
          element={
            <ProtectedRoute>
              <ActivePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateMetrics"
          element={
            <ProtectedRoute>
              <UpdatePlan />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);

export default routes;
