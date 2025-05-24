import { createBrowserRouter } from "react-router";

import { MainLayout } from "../components/layout/main.js";
import { CategoryPage } from "../pages/category";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "categories",
        element: <CategoryPage />,
      },
    ],
  },
]);
