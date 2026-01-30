import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  // In paths par Navbar aur Footer hidden rahenge
  const hideNavAndFooter = ["/login", "/register", "/admin"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {/* Conditional Navbar */}
      {!hideNavAndFooter && <Navbar />}

      {/* Main Content */}
      {/* Dark mode background added for auth pages */}
      <main
        className={`flex-grow ${
          hideNavAndFooter ? "bg-gray-50 dark:bg-gray-900" : ""
        }`}
      >
        <Outlet />
      </main>

      {/* Conditional Footer */}
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default Layout;
