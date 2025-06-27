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

  // Nova query para previsão de investimentos do backend
  const { data: investmentForecastData } = useQuery({
    queryKey: ["investment-forecast"],
    queryFn: async () => {
      const response = await api.get(
        "/api/v1/rest/investment-forecast?months=6"
      );
      return response.data.data;
    },
    refetchOnMount: true,
  });

  // Carrega dados de investimentos
  const { data: criptoData = [] } = useQuery({
    queryKey: ["investiments-cripto"],
    queryFn: async () => {
      const response = await api.get("/investiments-cripto");
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: dividendosData = [] } = useQuery({
    queryKey: ["investiments-dividendos"],
    queryFn: async () => {
      const response = await api.get("/investiments-dividendos");
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: fixedIncomeData = [] } = useQuery({
    queryKey: ["investiments-fixed-income"],
    queryFn: async () => {
      const response = await api.get("/investiments-fixed-income");
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: variableIncomeData = [] } = useQuery({
    queryKey: ["investiments-variable-income"],
    queryFn: async () => {
      const response = await api.get("/investiments-variable-income");
      return response.data;
    },
    refetchOnMount: true,
  });

  // Cálculo dos totais
  const totalReceber = receivableData.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );
  const totalPagar = payableData.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  // Cálculo dos totais de investimentos seguindo a mesma lógica da página de investments
  const criptoTotal = React.useMemo(() => {
    if (!criptoData) return 0;
    return criptoData
      .filter((item) => !item.exit) // filtra só os normais (não exits)
      .reduce((sum, item) => sum + Number(item.totalValue || 0), 0);
  }, [criptoData]);

  const dividendosTotal = React.useMemo(() => {
    if (!dividendosData) return 0;
    return dividendosData.reduce(
      (sum, item) => sum + Number(item.totalValue || 0),
      0
    );
  }, [dividendosData]);

  const fixedIncomeTotal = React.useMemo(() => {
    if (!fixedIncomeData) return 0;
    return fixedIncomeData.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );
  }, [fixedIncomeData]);

  const variableIncomeTotal = React.useMemo(() => {
    if (!variableIncomeData) return 0;
    return variableIncomeData.reduce(
      (sum, item) => sum + Number(item.totalValue || 0),
      0
    );
  }, [variableIncomeData]);

  const totalInvestido =
    fixedIncomeTotal + variableIncomeTotal + criptoTotal + dividendosTotal;
  const totalInvestments =
    criptoData.length +
    dividendosData.length +
    fixedIncomeData.length +
    variableIncomeData.length;

  // Usar dados de previsão do backend ou fallback para cálculo local
  const previsaoInvestimentos = React.useMemo(() => {
    if (investmentForecastData?.forecast) {
      console.log("Usando dados do backend:", investmentForecastData.forecast);
      return investmentForecastData.forecast.map((item) => ({
        mes: item.monthLabel,
        total: item.total,
        vencimentos: item.maturity,
        aportes: item.projectedInvestments,
      }));
    }

    console.log("Usando cálculo local (fallback)");
    // Fallback: cálculo local (código anterior)
    const meses = Array.from({ length: 6 }, (_, i) => dayjs().add(i, "month"));

    const investmentHistory = [
      ...criptoData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
      ...dividendosData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
      ...fixedIncomeData.map((item) => ({
        date: item.startDate,
        value: Number(item.value || 0),
      })),
      ...variableIncomeData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
    ];

    const lastSixMonths = investmentHistory.filter((item) =>
      dayjs(item.date).isAfter(dayjs().subtract(6, "month"))
    );

    const averageMonthlyInvestment =
      lastSixMonths.length > 0
        ? lastSixMonths.reduce((sum, item) => sum + item.value, 0) / 6
        : 0;

    return meses.map((mes) => {
      const inicio = mes.startOf("month");
      const fim = mes.endOf("month");

      const vencimentosRendaFixa = fixedIncomeData
        .filter(
          (item) =>
            dayjs(item.dueDate).isSameOrAfter(inicio) &&
            dayjs(item.dueDate).isSameOrBefore(fim)
        )
        .reduce((acc, item) => acc + Number(item.value || 0), 0);

      const projecaoAportes = mes.isAfter(dayjs())
        ? averageMonthlyInvestment
        : 0;
      const total = vencimentosRendaFixa + projecaoAportes;

      return {
        mes: inicio.format("MMM/YYYY"),
        total,
        vencimentos: vencimentosRendaFixa,
        aportes: projecaoAportes,
      };
    });
  }, [
    investmentForecastData,
    criptoData,
    dividendosData,
    fixedIncomeData,
    variableIncomeData,
  ]);

  // Estatísticas do backend ou cálculo local
  const averageMonthlyInvestment = React.useMemo(() => {
    if (investmentForecastData?.statistics?.averageMonthlyInvestment) {
      return investmentForecastData.statistics.averageMonthlyInvestment;
    }

    // Fallback: calcular localmente
    const investmentHistory = [
      ...criptoData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
      ...dividendosData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
      ...fixedIncomeData.map((item) => ({
        date: item.startDate,
        value: Number(item.value || 0),
      })),
      ...variableIncomeData.map((item) => ({
        date: item.purchaseDate,
        value: Number(item.totalValue || 0),
      })),
    ];

    const lastSixMonths = investmentHistory.filter((item) =>
      dayjs(item.date).isAfter(dayjs().subtract(6, "month"))
    );

    return lastSixMonths.length > 0
      ? lastSixMonths.reduce((sum, item) => sum + item.value, 0) / 6
      : 0;
  }, [
    investmentForecastData,
    criptoData,
    dividendosData,
    fixedIncomeData,
    variableIncomeData,
  ]);

  const investmentHistoryCount =
    investmentForecastData?.statistics?.recentInvestmentsCount ??
    criptoData.length +
      dividendosData.length +
      fixedIncomeData.length +
      variableIncomeData.length;

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
          {/* 5 cards - primeira linha com 3 cards principais */}
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
                  {totalInvestments} aplicações
                </div>
              </div>
            </Item>
          </Grid>

          {/* Segunda linha com 2 cards de previsão */}
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Previsão de Investimentos (Próximo Mês)
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {previsaoInvestimentos[1]?.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Vencimentos:{" "}
                  {previsaoInvestimentos[1]?.vencimentos.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}{" "}
                  | Aportes:{" "}
                  {previsaoInvestimentos[1]?.aportes.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Média Mensal de Investimentos
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {averageMonthlyInvestment.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Baseado nos últimos 6 meses ({investmentHistoryCount}{" "}
                  investimentos)
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
                  Previsão de Investimentos Futuros
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={previsaoInvestimentos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }),
                        name === "vencimentos"
                          ? "Vencimentos"
                          : name === "aportes"
                          ? "Aportes Projetados"
                          : "Total",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="vencimentos"
                      fill="#22c55e"
                      name="Vencimentos"
                    />
                    <Bar
                      dataKey="aportes"
                      fill="#3b82f6"
                      name="Aportes Projetados"
                    />
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
