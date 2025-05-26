import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
// import { type } from "os";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "nome",
    width: 150,
    editable: true,
  },
  {
    field: "value",
    headerName: "valor",
    type: "string", // pois vem como "R$ 5.000"
    width: 150,
    editable: true,
  },
  {
    field: "interest_rate",
    headerName: "taxa de juros",
    type: "string", // pois vem como "5.2%"
    width: 110,
    editable: true,
  },
  {
    field: "start_date",
    headerName: "data inicial",
    type: "string",
    width: 110,
    editable: true,
  },
  {
    field: "due_date",
    headerName: "data de Vencimento",
    type: "string",
    width: 110,
    editable: true,
  },
];

export function FixedIncome() {
  const [filteredRows, setFilteredRows] = React.useState([]);

  const loadInvestmentsfixedIncomeQuery = useQuery({
    queryKey: ["investiments-total"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments",
      });

      return response.data.investiments.filter(
        (investment) => investment.type === "fixed_income"
      );
    },
  });

  const total = (Array.isArray(filteredRows) ? filteredRows : []).reduce((sum, row) => {
    const valor = Number(
      String(row.value)
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".")
    );
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={loadInvestmentsfixedIncomeQuery.data ?? []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          onStateChange={(state) => {
            // Pega as linhas filtradas pelo DataGrid
            const visibleRows = state.filter?.visibleRows?.lookup
              ? Object.values(state.filter.visibleRows.lookup)
              : [];
            setFilteredRows(visibleRows.length ? visibleRows : loadInvestmentsfixedIncomeQuery.data ?? []);
          }}
        />
      </Box>
      <div className="mt-4 font-bold text-amber-50 text-right">
        Total filtrado: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
