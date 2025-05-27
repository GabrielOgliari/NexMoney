import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
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
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const { data: investmentsData, isLoading } = useQuery({
    queryKey: ["investiments-fixed-income"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments",
      });
      const investmentsArray = response.data.investiments ?? [];

      const filtered = investmentsArray.filter(
        (investment) => investment.type === "fixed_income"
      );

      return filtered;
    },
  });

  const filteredRows = React.useMemo(() => {
    if (!investmentsData) return [];
    if (filterModel.items.length === 0) return investmentsData;

    return investmentsData.filter((row) => {
      return filterModel.items.every((filter) => {
        if (!filter.value) return true;
        const fieldValue = row[filter.field]?.toString().toLowerCase();
        return fieldValue?.includes(filter.value.toLowerCase());
      });
    });
  }, [investmentsData, filterModel]);

  const total = filteredRows.reduce((sum, row) => {
    const valor = Number(
      String(row.value)
        .replace(/\./g, "") // remove separador de milhar
        .replace(",", ".") // vírgula por ponto
        .replace(/[^\d.-]/g, "") // remove não numéricos
    );
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return (
    <div className="flex flex-col height-screen h-full w-full overflow-hidden">
      <Box>
        <DataGrid
          rows={filteredRows ?? []}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5]}
          loading={isLoading}
          disableRowSelectionOnClick
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          sx={{
            backgroundColor: "#0F1729",
            color: "#fff",
            headerBg: "#0F1729",
            borderColor: "#1E2B45",

            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#0F1729",
              color: "#fff",
              borderColor: "#1E2B45",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0F1729 !important", 
              color: "#111",
              fontWeight: "bold",
              borderColor: "#1E2B45",
            },
            "& .MuiDataGrid-topContainer": {
              borderColor: "#1E2B45", // <-- borda do header personalizada
              backgroundColor: "#0F1729", // <-- fundo do header (opcional)
            },
            "& .MuiDataGrid-cell": {
              borderColor: "#1E2B45",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#0F1729",
              borderBlockColor: "#1E2B45",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#162032",
              boxShadow: "#24304A",
              borderBlockColor: "#1E2B45",
            },
          }}
        />
      </Box>
      <div className="mt-4 font-bold text-amber-50 text-right">
        Total filtrado: R${" "}
        {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
