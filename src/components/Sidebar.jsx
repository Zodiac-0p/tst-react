import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const items = [
    { name: "Home", path: "/", icon: "bi-house" },
    { name: "Movies", path: "/movies", icon: "bi-film" },
    { name: "History", path: "/watch-history", icon: "bi-clock-history" },
    { name: "Plans", path: "/plans", icon: "bi-stars" },
  ];

  return (
    <aside className="sidebar">
      {/* ✅ Logo */}
      <div className="sidebar-logo">
        <span className="logo-short">F</span>
        <span className="logo-full">Flickify</span>
      </div>

      {/* ✅ Menu */}
      <div className="menu">
        {items.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
