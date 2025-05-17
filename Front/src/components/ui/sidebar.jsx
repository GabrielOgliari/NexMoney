import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaArrowCircleUp,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaClipboardList,
  FaWallet,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaBars,
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
      className={`h-screen flex flex-col justify-between transition-all duration-300 bg-sidebar text-sidebar-foreground border-r border-sidebar-border ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <span className="text-sidebar-primary text-2xl font-bold">$</span>
            {!collapsed && <h1 className="text-lg font-bold">NexMoney</h1>}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-sidebar-primary transition-colors"
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
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Rodapé */}
      <div className="p-4 border-t border-sidebar-border">
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
