// import { NavLink, Outlet } from "react-router-dom";
import { Outlet } from "react-router-dom";

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from "../components/ui/sidebar";
import { FaBars } from "react-icons/fa";
import { useSidebar } from "../context/sidebar_context";

// rotas de teste inicial
// const links = [
//   { to: "/dashboard", label: "Dashboard " },
//   { to: "/incomes", label: "Contas a Receber " },
//   { to: "/expenses", label: "Contas a Pagar " },
//   { to: "/bank_statement", label: "Importar Extrato " },
//   { to: "/mapping", label: "De Para " },
//   { to: "/investments", label: "Investimentos " },
//   { to: "/categories", label: "Categorias " },
//   { to: "/settings", label: "Configurações " },
// ];

export function MainLayout() {
  // return (
  //   <div className="flex min-h-screen text-white bg-gray-900">
  //     <aside className="w-64 bg-gray-800 p-6 space-y-4">
  //       <h2 className="text-2xl font-bold mb-6">NexMoney</h2>
  //       <nav className="space-y-2">
  //         {links.map(({ to, label, icon }) => (
  //           <NavLink
  //             key={to}
  //             to={to}
  //             className={({ isActive }) =>
  //               `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
  //                 isActive ? "bg-blue-600" : ""
  //               }`
  //             }
  //           >
  //             <span>{icon}</span>
  //             <span>{label}</span>
  //           </NavLink>
  //         ))}
  //       </nav>
  //     </aside>

  //     <main className="flex-1 p-6 overflow-y-auto">
  //       <Outlet />
  //     </main>
  //   </div>
  // );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
