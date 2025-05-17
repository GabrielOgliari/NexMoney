//Tela principal
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="card-base p-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Saldo Total
        </h2>
        <p className="text-3xl font-bold text-primary mt-2">R$ 12.345,67</p>
      </div>

      <div className="card-base p-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Contas a Pagar
        </h2>
        <p className="text-3xl font-bold text-destructive mt-2">R$ 4.200,00</p>
      </div>

      <div className="card-base p-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Contas a Receber
        </h2>
        <p className="text-3xl font-bold text-green-600 mt-2">R$ 6.800,00</p>
      </div>

      <div className="card-base p-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Investimentos
        </h2>
        <p className="text-3xl font-bold text-blue-600 mt-2">R$ 2.300,00</p>
      </div>
    </div>
  );
}
