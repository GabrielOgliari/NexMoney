

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';

import { Link, useLocation } from "react-router";

export const Sidebar = () => {
  const { pathname } = useLocation();

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
      label: "Importação Extrato ",
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
      label: "Settings",
      icon: SettingsOutlinedIcon,
      to: "/settings",
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r bg-background  bg-[#0F1729]">
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <span>NexMoney</span>
        </Link>
      </div>

      <div className="flex-1">
        <nav className="grid items-start px-2 py-4 text-white ">
          {routes.map((route) => (
            <div
              key={route.to}
              variant={pathname === route.to ? "default" : "ghost"}
              className="flex items-center gap-2 py-2"
            >
              <Link to={route.to} className="flex items-center gap-2 rounded hover:bg-blue-900 hover:shadow-lg transition w-full y-full">
                <route.icon className={`h-5 w-5 ${route.color || ""}`} />
                {route.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return <SidebarContent />;
};
