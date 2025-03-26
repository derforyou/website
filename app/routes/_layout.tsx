import Footer from "#/components/base/Footer";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="bg-bg">
      <div className="overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
