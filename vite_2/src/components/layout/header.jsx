import { Bell, User } from "lucide-react";

import { Link, useLocation } from "react-router";

export const Header = () => {
  const { pathname } = useLocation();

  const getPageTitle = () => {
    const path = pathname.split("/")[1];

    switch (path) {
      case "dashboard":
        return "Dashboard";
      case "bank-statement":
        return "Extrato Bancário";
      case "accounts-payable":
        return "Contas a Pagar";
      case "accounts-receivable":
        return "Contas a Receber";
      case "budget-comparison":
        return "Comparativo Orçado x Realizado";
      case "analytics":
        return "Análise Financeira";
      case "investments":
        return "Investimentos";
      case "categories":
        return "Categorias";
      case "settings":
        return "Configurações";
      case "login":
        return "Login";
      case "register":
        return "Cadastro";
      default:
        return "NexMoney";
    }
  };

  return (
    <header className="flex bg-blue-950">
      <div className="flex items-center gap-2 lg:gap-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex">
          <div>
            <button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <div className="flex gap-2">
                <span className="text-white">JD</span>
              </div>
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <div>Minha Conta</div>

            <hr />

            <Link href="/settings" className="flex gap-2 text-white">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Link>

            <Link href="/settings" className="text-white">
              Configurações
            </Link>

            <hr />
            <div>
              <Link href="/login" className="text-white">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
