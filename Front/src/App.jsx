import { Outlet } from "react-router-dom";

export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <Outlet />
    </main>
  );
}
