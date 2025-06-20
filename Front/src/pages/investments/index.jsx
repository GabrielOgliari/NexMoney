import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FixedIncome } from "./components/fixed_income";
import { Button } from "@mui/material";
import { VariableIncome } from "./components/variable_income";
import { Cripto } from "./components/cripto";
import { Dividendos } from "./components/dividendos";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.components?.MuiPaper?.styleOverrides?.root,
}));

export const InvestmentsPage = () => {
  const [activeTab, setActiveTab] = React.useState(null);

  // Carrega todos os lançamentos normais (não exits) para cada tipo e faz o sum no front
  const loadCriptoQuery = useQuery({
    queryKey: ["investiments-cripto"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments-cripto",
      });
      return response.data;
    },
  });

  const criptoTotal = React.useMemo(() => {
    if (!loadCriptoQuery.data) return 0;
    return loadCriptoQuery.data
      .filter((item) => !item.exit) // ajuste conforme sua estrutura para filtrar só os normais
      .reduce((sum, item) => sum + Number(item.totalValue || 0), 0);
  }, [loadCriptoQuery.data]);

  const loadDividendosQuery = useQuery({
    queryKey: ["investiments-dividendos"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments-dividendos",
      });
      return response.data;
    },
  });

  const dividendosTotal = React.useMemo(() => {
    if (!loadDividendosQuery.data) return 0;
    return loadDividendosQuery.data.reduce(
      (sum, item) => sum + Number(item.totalValue || 0),
      0
    );
  }, [loadDividendosQuery.data]);

  const loadFixedIncomeQuery = useQuery({
    queryKey: ["investiments-fixed-income"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments-fixed-income",
      });
      return response.data;
    },
  });

  const fixedIncomeTotal = React.useMemo(() => {
    if (!loadFixedIncomeQuery.data) return 0;
    return loadFixedIncomeQuery.data.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );
  }, [loadFixedIncomeQuery.data]);

  const loadVariableIncomeQuery = useQuery({
    queryKey: ["investiments-variable-income"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments-variable-income",
      });
      return response.data;
    },
  });

  const variableIncomeTotal = React.useMemo(() => {
    if (!loadVariableIncomeQuery.data) return 0;
    return loadVariableIncomeQuery.data.reduce(
      (sum, item) => sum + Number(item.totalValue || 0),
      0
    );
  }, [loadVariableIncomeQuery.data]);

  // Função para formatar moeda
  const formatCurrency = (value) =>
    value?.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }) ?? "R$ 0,00";

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
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background  h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Total de Investimentos
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {formatCurrency(
                    fixedIncomeTotal +
                      variableIncomeTotal +
                      criptoTotal +
                      dividendosTotal
                  )}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Renda Fixa
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {formatCurrency(fixedIncomeTotal)}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background  h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Renda Variável
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {formatCurrency(variableIncomeTotal)}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background  h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Criptomoedas
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {formatCurrency(criptoTotal)}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background  h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px]">
                  Dividendos
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px]">
                  {formatCurrency(dividendosTotal)}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={15}>
            <Item>
              <div className="flex flex-col bg-background h-full w-full border-0 text-[18px] font-bold text-start ">
                Histórico de Desempenho
                <div></div>
              </div>
            </Item>
          </Grid>
          <Grid size={15}>
            <Item>
              <div className="flex flex-col bg-background  h-full w-full border-0 text-[18px] font-bold text-start overflow-hidden ">
                Detalhes dos Investimentos
                <div
                  dir="ltr"
                  data-orientation="horizontal"
                  className="flex flex-row gap-4"
                >
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4  bg-[#1B2232]"
                    tabIndex={0}
                    data-orientation="horizontal"
                  >
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm  transition-colors bg-[#1B2232]  hover:bg-[#24304A] cursor-pointer"
                      role="tab"
                      aria-selected={activeTab === "fixed_income"}
                      onClick={() => setActiveTab("fixed_income")}
                    >
                      Renda Fixa
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm  transition-colors bg-[#1B2232]  hover:bg-[#24304A] cursor-pointer"
                      role="tab"
                      aria-selected={activeTab === "variable_income"}
                      onClick={() => setActiveTab("variable_income")}
                    >
                      Renda Variável
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm  transition-colors bg-[#1B2232]  hover:bg-[#24304A] cursor-pointer"
                      role="tab"
                      aria-selected={activeTab === "cripto"}
                      onClick={() => setActiveTab("cripto")}
                    >
                      Criptomoedas
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm  transition-colors bg-[#1B2232]  hover:bg-[#24304A] cursor-pointer"
                      role="tab"
                      aria-selected={activeTab === "dividendos"}
                      onClick={() => setActiveTab("dividendos")}
                    >
                      Dividendos
                    </button>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden h-full w-full">
                  {activeTab === "fixed_income" && <FixedIncome />}
                  {activeTab === "variable_income" && <VariableIncome />}
                  {activeTab === "cripto" && <Cripto />}
                  {activeTab === "dividendos" && <Dividendos />}
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
