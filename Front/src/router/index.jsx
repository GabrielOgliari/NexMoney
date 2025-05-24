import { createBrowserRouter } from "react-router";

import { MainLayout } from "../components/layout/main.js";
import { CategoryPage } from "../pages/category";
import { DashboardPage } from "../pages/dashboard";
import { BankStatementPage } from "../pages/bank-statement";
import { AccountsPayablePage } from "../pages/accounts-payable";
import { AccountsReceivablePage } from "../pages/accounts-receivable";
import { BudgetComparisonPage } from "../pages/budget-comparison";
import { InvestmentsPage } from "../pages/investments";
import { SettingsPage } from "../pages/settings";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "bank-statement",
        element: <BankStatementPage />,
      },
      {
        path: "accounts-payable",
        element: <AccountsPayablePage />,
      },
      {
        path: "accounts-receivable",
        element: <AccountsReceivablePage />,
      },
      {
        path: "budget-comparison",
        element: <BudgetComparisonPage />,
      },
      {
        path: "investments",
        element: <InvestmentsPage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
