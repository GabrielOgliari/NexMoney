import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.components?.MuiPaper?.styleOverrides?.root,
}));

const COLORS = ["#22c55e", "#ef4444"];

export const DashboardPage = () => {
  // Buscando dados das APIs
  const { data: receivableData = [] } = useQuery({
    queryKey: ["accounts-receivable"],
    queryFn: async () => {
      const response = await api.get("/api/v1/rest/accounts-receivable");
      return response.data;
    },
  });

  const { data: payableData = [] } = useQuery({
    queryKey: ["accounts-payable"],
    queryFn: async () => {
      const response = await api.get("/api/v1/rest/accounts-payable");
      return response.data;
    },
  });

  // Cálculo dos totais
  const totalReceber = receivableData.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalPagar = payableData.reduce((acc, item) => acc + Number(item.amount), 0);

  // Dados para o gráfico de pizza
  const pieData = [
    { name: "A Receber", value: totalReceber },
    { name: "A Pagar", value: totalPagar },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1B2232]">
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          borderRadius: 1,
          borderBlockColor: "#1E2B45",
          margin: 2,
          height: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Contas a Receber
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {totalReceber.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {receivableData.length} pagamentos pendentes
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Contas a Pagar
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {totalPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payableData.length} contas próximas
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="font-bold text-[16px] mb-2">Distribuição Financeira</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};