import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const columns = [
  { field: "id", headerName: "ID", flex: 0.5 },
  {
    field: "name",
    headerName: "nome",
    flex: 2,
    editable: true,
  },
  {
    field: "value",
    headerName: "valor",
    type: "string", // pois vem como "R$ 5.000"
    flex: 1,
    editable: true,
  },
  {
    field: "interest_rate",
    headerName: "taxa de juros",
    type: "string", // pois vem como "5.2%"
    flex: 1,
    editable: true,
  },
  {
    field: "start_date",
    headerName: "data inicial",
    type: "string",
    flex: 1,
    editable: true,
  },
  {
    field: "due_date",
    headerName: "data de Vencimento",
    type: "string",
    flex: 1,
    editable: true,
  },
  {
    field: "actions",
    headerName: "Ações",
    flex: 1,
    disableReorder: true,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
    headerAlign: "center",
    renderCell: () => {
      return (
        <div className="flex gap-3 justify-center items-center h-full">
          <Button
            color="info"
            variant="outlined"
            // onClick={() => handleEdit(row.id)}
          >
            <EditOutlinedIcon></EditOutlinedIcon>
          </Button>
          <Button
            color="error"
            variant="outlined"
            // onClick={() => deleteCategoryMutation.mutate(row.id)}
          >
            <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
          </Button>
        </div>
      );
    },
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
      <div className="flex justify-end  mr-4 ">
        <Button variant="contained">Novo Lançamento</Button>
      </div>
      <Box sx={{ height: 300, width: "100%", padding: 2 }}>
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
        />
      </Box>
      <div className="mt-4 text-right">
        Total filtrado: R${" "}
        {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
