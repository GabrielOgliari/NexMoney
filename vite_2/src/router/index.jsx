import { createBrowserRouter } from "react-router";

import { ExamplePage } from "../pages/example.jsx";
import { Example2Page } from "../pages/example2.jsx";
import { MainLayout } from "../components/layout/main.js";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "example",
        element: <ExamplePage />,
      },
      {
        path: "example2",
        element: <Example2Page />,
      },
    ],
  },
]);
