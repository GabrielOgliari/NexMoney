import { Outlet } from "react-router";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div
        className="flex-1 flex flex-col w-full h-full"
        style={{ backgroundColor: "hsl(var(--content-background))" }}
      >
        <Header />

        <main className="flex-1 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
