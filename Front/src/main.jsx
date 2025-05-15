// import React from "react";
// import ReactDOM from "react-dom/client";
// import { AppRoutes } from "./router/index.jsx";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppRoutes />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { SidebarProvider } from "./context/sidebar_context.jsx";
import { AppRoutes } from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SidebarProvider>
      <AppRoutes />
    </SidebarProvider>
  </React.StrictMode>
);