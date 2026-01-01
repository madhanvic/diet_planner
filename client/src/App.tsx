import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes/route";

export default function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}


