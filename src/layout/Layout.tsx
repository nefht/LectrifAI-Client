import { Outlet, useLocation } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className={`${location.pathname === "/" ? "mb-24" : "mt-16 mb-24"}`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout;
