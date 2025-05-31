import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FixedIncome } from "./components/fixed_income";
import { Button } from "@mui/material";
// import { VariableIncome } from "./components/variable_income";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.components?.MuiPaper?.styleOverrides?.root,
}));

export const InvestmentsPage = () => {
  // const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(null);

  const loadInvestmentsTotalQuery = useQuery({
    queryKey: ["investiments-total"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments",
      });

      return response.data;
    },
  });
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1B2232]">
      
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          // backgroundColor: "#1B2232",
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
                  R$
                  {loadInvestmentsTotalQuery.data?.grand_total ??
                    "Carregando..."}
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
                  R${" "}
                  {loadInvestmentsTotalQuery.data?.total_fixed_income ??
                    "Carregando..."}
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
                  R$
                  {loadInvestmentsTotalQuery.data?.total_variable_income ??
                    "Carregando..."}
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
                  R$
                  {loadInvestmentsTotalQuery.data?.dividends ?? "Carregando..."}
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
                      aria-selected="true"
                    >
                      Criptomoedas
                    </button>
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm  transition-colors bg-[#1B2232]  hover:bg-[#24304A] cursor-pointer"
                      role="tab"
                      aria-selected="true"
                    >
                      Dividendos
                    </button>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden h-full w-full">
                  {activeTab === "fixed_income" && <FixedIncome />}
                  {activeTab === "variable_income" && <VariableIncome />}
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
