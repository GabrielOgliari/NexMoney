import { Outlet } from "react-router-dom";

// aqui vamos a importar o css do tailwind e o css global com outlet que é o que vai renderizar as rotas
export function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Outlet />
    </div>
  );
}
