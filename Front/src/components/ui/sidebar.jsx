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
    {
      label: "Importar Extrato",
      icon: <FaExchangeAlt />,
      to: "/bank_statement",
    },
    { label: "De Para", icon: <FaClipboardList />, to: "/mapping" },
    { label: "Investimentos", icon: <FaWallet />, to: "/investments" },
    { label: "Categorias", icon: <FaTags />, to: "/categories" },
    { label: "Configurações", icon: <FaCog />, to: "/settings" },
  ];

  return (
    <aside
      className={`flex flex-col justify-between h-screen bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] transition-width duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      aria-label="Sidebar navigation"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2 select-none cursor-default">
            <span className="text-indigo-500 text-3xl font-extrabold">$</span>
            {!collapsed && (
              <h1 className="text-xl font-semibold tracking-wide">NexMoney</h1>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-gray-200 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-1 transition-colors"
          >
            <FaBars size={20} />
          </button>
        </div>

        {!collapsed && (
          <p className="text-sm text-gray-400 px-4 pt-2 select-none">
            A nova geração de controle financeiro
          </p>
        )}

        {/* Nav links */}
        <nav className="mt-5 flex flex-col gap-1" role="menu">
          {navItems.map(({ label, icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] shadow-md"
                    : "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] text-[hsl(var(--sidebar-foreground))]"
                }`
              }
              role="menuitem"
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-[hsl(var(--sidebar-border))]">
        <NavLink
          to="/sair"
          className="flex items-center gap-4 text-red-500 hover:text-red-600 transition-colors rounded-md p-2 cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span>Sair</span>}
        </NavLink>
      </footer>
    </aside>
  );
};
