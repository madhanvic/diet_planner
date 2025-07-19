import {
  createRoutesFromElements,
  Route,
  type RouteObject,
} from "react-router";
import Root from "../layouts/Root";

const routes: RouteObject[] = createRoutesFromElements(
  <>
    <Route path="/" element={<Root />}></Route>
  </>
);

export default routes;
