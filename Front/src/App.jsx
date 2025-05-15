import { Outlet } from "react-router-dom";

// aqui vamos a importar o css do tailwind e o css global com outlet que é o que vai renderizar as rotas
export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <Outlet />
    </main>
  );
}
