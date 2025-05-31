import {
  SettingsOutlined as SettingsOutlinedIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCardOutlined as CreditCardOutlinedIcon,
  LocalAtmOutlined as LocalAtmOutlinedIcon,
  HomeOutlined as HomeOutlinedIcon,
  LocalOfferOutlined as LocalOfferOutlinedIcon,
  AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon,
  CompareArrowsOutlined as CompareArrowsOutlinedIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router";
import { useState } from "react";

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false); // Estado para colapsar/expandir

  const routes = [
    {
      label: "Dashboard",
      icon: HomeOutlinedIcon,
      to: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Contas a Pagar",
      icon: CreditCardOutlinedIcon,
      to: "/accounts-payable",
      color: "text-violet-500",
    },
    {
      label: "Contas Receber",
      icon: AttachMoneyIcon,
      to: "/accounts-receivable",
      color: "text-pink-700",
    },
    {
      label: "Importação Extrato",
      icon: LocalAtmOutlinedIcon,
      to: "/bank-statement",
      color: "text-orange-500",
    },
    {
      label: "De Para",
      icon: CompareArrowsOutlinedIcon,
      to: "/budget-comparison",
      color: "text-emerald-500",
    },
    {
      label: "Categorias",
      icon: LocalOfferOutlinedIcon,
      to: "/categories",
      color: "text-green-500",
    },
    {
      label: "Investimentos",
      icon: AccountBalanceWalletOutlinedIcon,
      to: "/investments",
      color: "text-blue-500",
    },
    {
      label: "Configurações",
      icon: SettingsOutlinedIcon,
      to: "/settings",
    },
  ];

  return (
    <div
      className={`flex h-full flex-col border-r bg-[#0F1729] transition-all duration-300 ${
        collapsed ? "w-15" : "w-60"
      }`}
    >
      <div className="flex h-14 items-center border-b px-4 justify-between">
        {!collapsed && (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">N</span>
            </div>
            <span>NexMoney</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          <MenuIcon />
        </button>
      </div>

      <nav className=" grid items-start px-2 py-4 text-white">
        {routes.map((route) => (
          <Link
            key={route.to}
            to={route.to}
            className={`flex items-center gap-2 rounded hover:bg-blue-900 hover:shadow-lg transition w-full py-2 px-2 ${
              pathname === route.to ? "bg-blue-800" : ""
            }`}
          >
            <route.icon className={`h-5 w-5 ${route.color || ""}`} />
            {!collapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};
