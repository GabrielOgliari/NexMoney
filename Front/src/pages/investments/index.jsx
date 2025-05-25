import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#0F1729",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  borderRadius: 3,
  border: "#1E2B45 solid 0.1px",

  
}));

export const InvestmentsPage = () => {
  const [open, setOpen] = React.useState(false);

  const loadInvestmentsTotalQuery = useQuery({
    queryKey: ["investiments-total"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments",
      });

      return response.data.total;
    },
  });
  return (
    <div className="flex gap-4 flex-col bg-background bg-[#1B2232] height-screen">
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          backgroundColor: "#1B2232",
          borderRadius: 1,
          borderBlockColor:"#1E2B45",
          margin: 2,
          height: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background bg-[#0F1729] h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px] text-amber-50">
                  Total de Investimentos
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px] text-amber-50">
                  R$ 
                  {loadInvestmentsTotalQuery.data?.grand_total ?? "Carregando..."}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background bg-[#0F1729] h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px] text-amber-50">
                  Renda Fixa
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px] text-amber-50">
                  R$ 
                  {loadInvestmentsTotalQuery.data?.total_fixed_income ?? "Carregando..."}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
            <Item>
              <div className="flex flex-col bg-background bg-[#0F1729] h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px] text-amber-50">
                  Renda Variável
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px] text-amber-50">
                  R$ 
                  {loadInvestmentsTotalQuery.data?.total_variable_income ?? "Carregando..."}
                </div>
              </div>
            </Item>
          </Grid>
          <Grid size={3}>
          <Item>
            <div className="flex flex-col bg-background bg-[#0F1729] h-full w-full border-0">
                <div className="flex flex-col gap-2 font-bold text-[14px] text-amber-50">
                  Dividendos
                </div>
                <div className="flex flex-col gap-2 font-bold text-[20px] text-amber-50">
                  R$ 
                  {loadInvestmentsTotalQuery.data?.dividends ?? "Carregando..."}
                </div>
              </div>
          </Item>
          </Grid>
          <Grid size={15}>
            <Item>
              <div className="flex flex-col bg-background bg-[#0F1729] h-full w-full border-0 text-amber-50 text-[18px] font-bold text-start ">
                Histórico de Desempenho
                <div>
                  
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
