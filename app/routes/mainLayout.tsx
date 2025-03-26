import { Outlet } from "react-router";
import Aside from "../components/base/Aside";

export default function Index() {
  return (
    <div className="flex">
      <Aside />
      <div className="flex-1 p-4 h-svh overflow-hidden">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
