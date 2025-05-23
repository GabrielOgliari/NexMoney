import {
  ArrowDownUp,
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  PieChart,
  Receipt,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router";

export const Sidebar = () => {
  const { pathname } = useLocation();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Accounts Payable",
      icon: CreditCard,
      to: "/accounts-payable",
      color: "text-violet-500",
    },
    {
      label: "Accounts Receivable",
      icon: DollarSign,
      to: "/accounts-receivable",
      color: "text-pink-700",
    },
    {
      label: "Bank Statement",
      icon: Receipt,
      to: "/bank-statement",
      color: "text-orange-500",
    },
    {
      label: "Budget Comparison",
      icon: BarChart3,
      to: "/budget-comparison",
      color: "text-emerald-500",
    },
    {
      label: "Categories",
      icon: Tags,
      to: "/categories",
      color: "text-green-500",
    },
    {
      label: "Investments",
      icon: Wallet,
      to: "/investments",
      color: "text-blue-500",
    },
    {
      label: "Analytics",
      icon: PieChart,
      to: "/analytics",
      color: "text-yellow-500",
    },
    {
      label: "Cash Flow",
      icon: ArrowDownUp,
      to: "/cash-flow",
      color: "text-red-500",
    },
    {
      label: "Financial Reports",
      icon: LineChart,
      to: "/financial-reports",
      color: "text-purple-500",
    },
    {
      label: "Settings",
      icon: Settings,
      to: "/settings",
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <span>NexMoney</span>
        </Link>
      </div>

      <div className="flex-1">
        <nav className="grid items-start px-2 py-4">
          {routes.map((route) => (
            <div
              key={route.to}
              variant={pathname === route.to ? "default" : "ghost"}
            >
              <Link to={route.to}>{route.label}</Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return <SidebarContent />;
};
