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
    // Image to slide
    "/slide/image-to-slide",
    // Lecture video generator
    "/lecture/generate-video",
    "/lecture/generate-video-process",
    "/lecture/generate-video-process/input",
    "/lecture/generate-video-process/review",
    "/lecture/generate-video-process/download",
    // Instant lecture presenter
    "/lecture/instant-presenter",
  ];

  const noHeaderPaddingRoutes = [
    // Home page
    "/",
    // Lecture video generator
    "/lecture/generate-video",
  ]

  // Check if the current route is in the noFooterRoutes array
  const hideFooter = noFooterRoutes.includes(location.pathname);

  // Check if the current route is in the noHeaderPaddingRoutes array
  const hideHeaderPadding = noHeaderPaddingRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      <div
        className={`${hideHeaderPadding ? "" : "mt-16"} ${
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
