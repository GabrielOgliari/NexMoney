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
import { ReactQueryProvider } from "./context/query_client.jsx";
import "./index.css"; // mantém index.css (opcional, para estilos básicos)
import "./styles/globals.css"; // importa o globals.css para ser aplicado globalmente

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);
