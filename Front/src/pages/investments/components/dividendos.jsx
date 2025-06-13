import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { useState, useMemo } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import { ptBR } from "@mui/x-data-grid/locales";
import { GenericFormModal } from "../../../components/ui/GenericFormModal";
import * as Yup from "yup";

import api from "../../../services/api";

//Parte logica para o os lançamentos de renda fixa de entrada

const useDividendosCategories = () => {
  const { data: categories = [] } = useQuery({
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  });

  // Monta as opções do select
  return useMemo(
    () =>
      categories
        .filter(
          (cat) =>
            cat.type === "investment" &&
            cat.investmentType === "variable_income"
        )
        .map((cat) => ({ value: cat.name, label: cat.name })),
    [categories]
  );
};

// Validação
const validationSchema = Yup.object({
  typeInvestment: Yup.string().required("Tipo obrigatório"),
  name: Yup.string().required("Nome obrigatório"),
  totalValue: Yup.number().required("Valor total obrigatório"),
  purchaseDate: Yup.string().required("Data de entrada obrigatória"),
});

export function Dividendos() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const queryClient = useQueryClient();

  // Busca lançamentos de renda fixa
  const { data: loadDividendosQuery = [], isLoading: isLoadingDividendos } =
    useQuery({
      queryKey: ["dividendos"],
      queryFn: async () => {
        const response = await api.get("/investiments-dividendos");
        return response.data;
      },
    });

  // Busca categorias para o select de nome
  const nameOptions = useDividendosCategories();

  // Campos do formulário
  const DividendosFields = [
    {
      name: "name",
      label: "Nome",
      type: "select",
      options: nameOptions,
    },
    { name: "totalValue", label: "Valor Total" },
    { name: "purchaseDate", label: "Data de Entrada", type: "date" },
  ];

  // Mutation para deletar

  const deleteDividendosMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/investiments-dividendos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dividendos"]);
    },
  });

  // Abrir modal de adição
  const handleOpenAddModal = () => {
    setEditData(null);
    setOpenAdd(true);
  };

  // Fechar modais
  const handleCloseModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setEditData(null);
  };

  // Mutation para editar (PUT)
  const updateDividendosMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/investiments-dividendos/${id}`, data);
    },
    onSuccess: () => {
      setOpenEdit(false);
      setEditData(null);
      queryClient.invalidateQueries(["dividendos"]);
    },
  });

  // Mutation para criar (POST)
  const createDividendosMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/investiments-dividendos", data);
    },
    onSuccess: () => {
      setOpenAdd(false);
      setEditData(null);
      queryClient.invalidateQueries(["dividendos"]);
    },
  });

  // Submit do formulário
  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      totalValue: Number(values),
      purchaseDate: values.purchaseDate,
    };

    if (editData && editData.id) {
      updateDividendosMutation.mutate({
        id: editData.id,
        data: formattedData,
      });
    } else {
      createDividendosMutation.mutate(formattedData);
    }
  };

  // Filtra apenas lançamentos com id definido
  const rowsDividendos = Array.isArray(loadDividendosQuery)
    ? loadDividendosQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null
      )
    : [];

  // Parte lógica para a grid de resumo de renda fixa
  // Agrupa os lançamentos por nome e resume os dados
  //
  const rowsDividendosSummary = Object.values(
    rowsDividendos.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = {
          id: curr.name,
          name: curr.name,
          amountSum: 0,
          totalValue: 0, // <-- inicializa aqui
        };
      }
      acc[curr.name].amountSum += Number(curr.amount || 0);
      acc[curr.name].totalValue += Number(
        curr.totalValue || curr.value * curr.amount || 0
      ); // <-- soma o valor total
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
  }));

  //Parte logica para o os lançamentos de renda fixa de saida

  // Função utilitária para formatar valores como moeda brasileira
  function formatCurrency(value) {
    if (value === undefined || value === null || value === "") return "";
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="flex flex-col height-screen h-full w-full overflow-hidden ">
      <div className="flex justify-end  mr-4 ">
        <Button variant="contained" onClick={handleOpenAddModal}>
          Novo Lançamento
        </Button>
      </div>

      {/* Modal de adição */}
      <GenericFormModal
        open={openAdd}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={{
          typeInvestment: "dividendos",
          name: "",
          totalValue: "",
          purchaseDate: "",
        }}
        fields={DividendosFields}
        validationSchema={validationSchema}
        title="Novo Lançamento"
        submitLabel="Adicionar"
      />

      <GenericFormModal
        open={openEdit}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={
          editData || {
            typeInvestment: "dividendos",
            name: "",
            totalValue: "",
            purchaseDate: "",
          }
        }
        fields={DividendosFields}
        validationSchema={validationSchema}
        title="Editar Lançamento"
        submitLabel="Salvar"
      />

      <div>
        <Box sx={{ height: 500, width: "100%" }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Resumo</h1>
          </div>
          {/* Grid de RESUMO (remova a coluna "Data de Entrada") */}
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsDividendosSummary}
            columns={[
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "totalValue",
                headerName: "Valor Total",
                flex: 1,
                valueFormatter: (params) =>
                  params != null
                    ? `R$ ${formatCurrency(params)}`
                    : "",
              },
            ]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            loading={isLoadingDividendos}
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Historico de lançamentos */}

      {/* Grid de lançamentos de renda fixa */}
      <div>
        <Box sx={{ height: 500, width: "100%", marginTop: 15 }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Historico</h1>
          </div>
          {/* Grid de HISTÓRICO (mantenha a coluna "Data de Entrada") */}
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsDividendos}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "purchaseDate",
                headerName: "Data de Entrada",
                type: "string",
                flex: 1,
                valueFormatter: (params) => {
                  const value = params;
                  if (!value) return "";
                  const parts = value.split("-");
                  if (parts.length !== 3) return value;
                  const [year, month, day] = parts;
                  return `${day}/${month}/${year}`;
                },
              },
              {
                field: "totalValue",
                headerName: "Valor Total",
                flex: 1,
                valueFormatter: (params) =>
                  params != null
                    ? `R$ ${formatCurrency(params)}`
                    : "",
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
                renderCell: ({ row }) => {
                  return (
                    <div className="flex gap-3 justify-center items-center h-full">
                      <Button
                        color="info"
                        variant="outlined"
                        onClick={() => {
                          setEditData(row);
                          setOpenEdit(true);
                        }}
                      >
                        <EditOutlinedIcon />
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          deleteDividendosMutation.mutate(row.id)
                        }
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            loading={isLoadingDividendos}
            disableRowSelectionOnClick
          />
        </Box>

        {/* Total filtrado
        <div className="mt-15 text-right">
          <span>
            Total filtrado: R${" "}
            {(Array.isArray(rowsDividendos)
              ? rowsDividendos.reduce((sum, row) => {
                  const valor = Number(
                    String(row.value)
                      .replace(/\./g, "") // remove separador de milhar
                      .replace(",", ".") // vírgula por ponto
                      .replace(/[^\d.-]/g, "") // remove não numéricos
                  );
                  return sum + (isNaN(valor) ? 0 : valor);
                }, 0)
              : 0
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div> */}
      </div>
    </div>
  );
}
