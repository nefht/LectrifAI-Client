import { Outlet, useLocation, useParams } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

function Layout() {
  const location = useLocation();
  const { id } = useParams();

  // List of routes where the footer should not be displayed
  const noFooterRoutes = [
    // Generate slides process
    "/slide/generate-process/input",
    "/slide/generate-process/template",
    `/slide/generate-process/outline/${id}`,
    `/slide/generate-process/download/${id}`,
    // Image to slide
    "/slide/image-to-slide",
    // Lecture video generator
    "/lecture/generate-video",
    "/lecture/generate-video-process",
    "/lecture/generate-video-process/input",
    `/lecture/generate-video-process/review/${id}`,
    `/lecture/generate-video-process/download/${id}`,
    // Instant lecture presenter
    "/lecture/instant-presenter",
    `/lecture/instant-presenter/${id}`,
    // Lecture detail
    `/lecture/detail/${id}`,
    // Storage
    "/storage",
    // Quiz maker
    "/quiz-maker",
    `/quiz/${id}`,
    // Classroom
    `/classroom/detail/${id}`,
    `/classroom/doing-quiz/${id}`,
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
