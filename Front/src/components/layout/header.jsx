

import { Link, useLocation } from "react-router";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';


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
    <header className="flex bg-[#1E2B45]">
      {/* <div className="flex items-center gap-2 lg:gap-4">
        <h1 className="text-xl font-semibold  text-white">{getPageTitle()}</h1>
      </div> */}

      <div className="flex items-center gap-2 ml-auto">
        <button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Notifications"
        >
          <NotificationsNoneIcon className="h-5 w-5  text-white" />
        </button>

        <div className="flex">

          <div className="flex gap-2 items-center  text-white">

            <Link href="/settings" className="flex gap-2 text-white">
              <AccountCircleIcon className="mr-2 h-4 w-4" />
            </Link>

            <SettingsOutlinedIcon href="/settings" className="text-white"/>


            <hr />
            <div>
              <LogoutIcon href="/login" className="text-white"/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
