import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Item = styled(Paper)(({ theme }) => ({
  ...theme.components?.MuiPaper?.styleOverrides?.root,
  minHeight: 140,
  minWidth: 350, // força largura mínima
  width: "100%", // ocupa toda a largura do grid
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

export const DashboardPage = () => {
  // Buscando dados das APIs
  const { data: receivableData = [] } = useQuery({
    queryKey: ["accounts-receivable"],
    queryFn: async () => {
      const response = await api.get("/api/v1/rest/accounts-receivable");
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: payableData = [] } = useQuery({
    queryKey: ["accounts-payable"],
    queryFn: async () => {
      const response = await api.get("/api/v1/rest/accounts-payable");
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: investmentsData = {} } = useQuery({
    queryKey: ["investments-total"],
    queryFn: async () => {
      const response = await api.get("/api/v1/rest/investments-total");
      return response.data;
    },
    refetchOnMount: true,
  });

  // Cálculo dos totais
  const totalReceber = receivableData.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalPagar = payableData.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalInvestido = investmentsData?.grand_total || 0;

  // Previsão de gastos próximos 6 meses
  const meses = Array.from({ length: 6 }, (_, i) => dayjs().add(i, "month"));
  const previsaoPorMes = meses.map((mes) => {
    const inicio = mes.startOf("month");
    const fim = mes.endOf("month");
    const total = payableData
      .filter(
        (item) =>
          dayjs(item.dueDate).isSameOrAfter(inicio) &&
          dayjs(item.dueDate).isSameOrBefore(fim)
      )
      .reduce((acc, item) => acc + Number(item.amount), 0);
    return { mes: inicio.format("MMM/YYYY"), total };
  });

  // Dados para o gráfico de pizza
  const pieData = [
    { name: "A Receber", value: totalReceber },
    { name: "A Pagar", value: totalPagar },
    { name: "Investido", value: totalInvestido },
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
          {/* 4 cards, agora 2 por linha em telas md+ */}
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Contas a Receber
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {totalReceber.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {receivableData.length} pagamentos pendentes
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Contas a Pagar
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {totalPagar.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payableData.length} contas próximas
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Total Investido
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {totalInvestido.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {investmentsData?.total_investments || 0} aplicações
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Previsão de Gastos (Próximo Mês)
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {previsaoPorMes[1]?.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payableData.filter((item) =>
                    dayjs(item.dueDate).isSameOrAfter(meses[1].startOf("month")) &&
                    dayjs(item.dueDate).isSameOrBefore(meses[1].endOf("month"))
                  ).length}{" "}
                  contas previstas
                </div>
              </div>
            </Item>
          </Grid>
          {/* Gráficos sempre na linha de baixo */}
          <Grid item xs={12} md={6}>
            <Item>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="font-bold text-[16px] mb-2">
                  Distribuição Financeira
                </div>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="font-bold text-[16px] mb-2">
                  Previsão de Gastos Futuros
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={previsaoPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};