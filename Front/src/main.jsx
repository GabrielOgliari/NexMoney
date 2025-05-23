import ReactDOM from "react-dom/client";
import { SidebarProvider } from "./context/sidebar_context.jsx";
import { AppRoutes } from "./router";
import { ReactQueryProvider } from "./context/query_client.jsx";
import "./styles/globals.css";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactQueryProvider>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </ReactQueryProvider>
  </StrictMode>
);
