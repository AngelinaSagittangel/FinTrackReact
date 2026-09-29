import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  ChartPie,
  LayoutDashboard,
  LogOut,
  User,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.svg";

function Sidebar() {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { path: "/", name: "Главная", icon: <LayoutDashboard /> },
    { path: "/activity", name: "Операции", icon: <ArrowLeftRight /> },
    { path: "/analytics", name: "Аналитика", icon: <ChartNoAxesCombined /> },
    { path: "/wallets", name: "Кошельки", icon: <WalletCards /> },
    { path: "/budgets", name: "Бюджеты", icon: <ChartPie /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="FinTrack" />
      </div>

      <nav className="sidebar__menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            end={item.path === "/"}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <div className="sidebar__profile">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `bottom-item ${isActive ? "active" : ""}`
            }
          >
            <User />
            <span>{currentUser?.name ?? "Профиль"}</span>
          </NavLink>

          <button type="button" onClick={logout} aria-label="Выйти">
            <LogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
