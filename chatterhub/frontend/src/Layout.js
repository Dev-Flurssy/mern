import { useLocation, Outlet } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

export function Layout() {
  const location = useLocation();
  const hideLayout = ["/signin", "/signup", "/forgot-password"];
  const isHidden = hideLayout.includes(location.pathname);

  return (
    <>
      {!isHidden && <Header />}
      <Outlet />
      {!isHidden && <Footer />}
    </>
  );
}
