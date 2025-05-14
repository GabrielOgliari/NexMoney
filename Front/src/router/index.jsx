//# Configuração de rotas

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { App } from "../App.jsx";
import { MainLayout } from "../layouts/main_layout.jsx";

import { LoginPage } from "../pages/auth/login_page.jsx";
import { RegisterPage } from "../pages/auth/register_page.jsx";

import { DashboardPage } from "../pages/dashboard/dashboard_page.jsx";
import { IncomesPage } from "../pages/incomes/incomes_page.jsx";
import { ExpensesPage } from "../pages/expenses/expenses_page.jsx";
import { BankStatementPage } from "../pages/bank_statement/bank_statement_page.jsx";
import { BudgetVsActualPage } from "../pages/budget_vs_actual/budget_vs_actual_page.jsx";
import { InvestmentsPage } from "../pages/investments/investments_page.jsx";
import { CategoriesPage } from "../pages/categories/categories_page.jsx";
import { SettingsPage } from "../pages/settings/settings_page.jsx";

// Configuração das rotas da aplicação
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout para login/cadastro
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />, // Layout com menu lateral
    children: [
      { index: true, element: <Navigate to="dashboard" /> }, // redirecionamento padrão
      { path: "dashboard", element: <DashboardPage /> },
      { path: "incomes", element: <IncomesPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "bank_statement", element: <BankStatementPage /> },
      { path: "mapping", element: <BudgetVsActualPage /> },
      { path: "investments", element: <InvestmentsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
