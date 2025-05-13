//# Configuração de rotas

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "../App.jsx";
import { LoginPage } from "../pages/auth/login_page.jsx";
import { RegisterPage } from "../pages/auth/register_page.jsx";
import { DashboardPage } from "../pages/dashboard/dashboard_page.jsx";

// Configuração das rotas da aplicação
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "dashboard", element: <DashboardPage /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
