import { Outlet, useLocation } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

function Layout() {
  const location = useLocation();

  // List of routes where the footer should not be displayed
  const noFooterRoutes = [
    // Generate slides process
    "/slide/generate-process/input",
    "/slide/generate-process/template",
    "/slide/generate-process/outline",
    "/slide/generate-process/download",
  ];

  // Check if the current route is in the noFooterRoutes array
  const hideFooter = noFooterRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      <div
        className={`${location.pathname === "/" ? "" : "mt-16"} ${
          !hideFooter ? "mb-24" : ""
        }`}
      >
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
