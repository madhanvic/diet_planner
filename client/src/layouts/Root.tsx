import { NavLink, Outlet, useLocation } from "react-router";
import Navbar from "../components/common/Navbar";
import Button from "../components/ui/Button";
import LogoutBtn from "../features/logout/LogoutBtn";
import AsideBar from "../components/common/AsideBar";
import { Suspense } from "react";
import Loader from "../pages/Loader";

function Root() {
  const { pathname } = useLocation();
  return (
    <main className="h-screen overflow-y-hidden flex flex-col">
      <Navbar logoTxt={"Diet Planner"}>
        <Navbar.options>
          <Navbar.option>
            <LogoutBtn>
              <Button inverse={1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </Button>
            </LogoutBtn>
          </Navbar.option>
        </Navbar.options>
      </Navbar>

      <div className="flex grow overflow-y-hidden h-[calc(100vh - 66px)]">
        <AsideBar>
          <AsideBar.options>
            <AsideBar.option>
              <NavLink
                to="/dashboard/activePlan"
                className={pathname === "/dashboard" ? "active" : ""}
              >
                Active Plans
              </NavLink>
            </AsideBar.option>
            <AsideBar.option>
              <NavLink to="/dashboard/updateMetrics">Update Metrics</NavLink>
            </AsideBar.option>
          </AsideBar.options>
        </AsideBar>

        <div className="overflow-y-auto w-full h-full relative">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default Root;
