import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import "./Layout.scss";

function Layout() {
  return (
    <section className="layout">
      <Sidebar />
      <main className="layout__main">
        <Outlet />
      </main>
    </section>
  );
}

export default Layout;
