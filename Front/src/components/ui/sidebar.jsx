// src/components/ui/sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaChartPie, FaArrowCircleUp, FaMoneyBillWave,
  FaExchangeAlt, FaClipboardList, FaWallet,
  FaTags, FaCog, FaSignOutAlt, FaBars
} from "react-icons/fa";
import { useSidebar } from "../../context/sidebar_context";

export const Sidebar = () => {
  const { collapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { label: "Dashboard", icon: <FaChartPie />, to: "/dashboard" },
    { label: "Contas a Receber", icon: <FaArrowCircleUp />, to: "/incomes" },
    { label: "Contas a Pagar", icon: <FaMoneyBillWave />, to: "/expenses" },
    { label: "Importar Extrato", icon: <FaExchangeAlt />, to: "/bank_statement" },
    { label: "De Para", icon: <FaClipboardList />, to: "/mapping" },
    { label: "Investimentos", icon: <FaWallet />, to: "/investments" },
    { label: "Categorias", icon: <FaTags />, to: "/categories" },
    { label: "Configurações", icon: <FaCog />, to: "/settings" },
  ];

  return (
    <aside
      className={`h-screen flex flex-col justify-between transition-all duration-300
        bg-card text-card-foreground border-r border-border
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl font-bold">$</span>
            {!collapsed && <h1 className="text-lg font-bold whitespace-nowrap">NexMoney</h1>}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaBars />
          </button>
        </div>

        {!collapsed && (
          <p className="text-sm text-muted-foreground px-4 pt-2">
            A nova geração de controle financeiro
          </p>
        )}

        {/* Navegação */}
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map(({ label, icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <NavLink
          to="/sair"
          className="flex items-center gap-3 text-destructive hover:text-destructive-foreground transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="text-sm">Sair</span>}
        </NavLink>
      </div>
    </aside>
  );
};
