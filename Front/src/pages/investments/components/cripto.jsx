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

const useCriptoCategories = () => {
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
          (cat) => cat.type === "investment" && cat.investmentType === "cripto"
        )
        .map((cat) => ({ value: cat.name, label: cat.name })),
    [categories]
  );
};

// Ajuste os campos do formulário para remover "value" e deixar "totalValue" manual:

export function Cripto() {
  // Busca categorias para o select de nome
  const nameOptions = useCriptoCategories();

  // Ajuste os campos do formulário para remover "value" e deixar "totalValue" manual:
  const CriptoFields = [
    {
      name: "name",
      label: "Nome",
      type: "select",
      options: nameOptions,
    },
    { name: "amount", label: "Quantidade" },
    { name: "totalValue", label: "Valor Total" },
    { name: "purchaseDate", label: "Data Compra", type: "date" },
  ];

  // Ajuste o validationSchema:
  const validationSchema = Yup.object({
    typeInvestment: Yup.string().required("Tipo obrigatório"),
    name: Yup.string().required("Nome obrigatório"),
    totalValue: Yup.number().required("Valor total obrigatório"), // só totalValue é obrigatório
    amount: Yup.number(),
    purchaseDate: Yup.string().required("Data inicial obrigatória"),
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openEditExit, setOpenEditExit] = useState(false);
  const [editExitData, setEditExitData] = useState(null);

  const queryClient = useQueryClient();

  // Busca lançamentos de renda fixa
  const { data: loadCriptoQuery = [], isLoading: isLoadingCripto } = useQuery({
    queryKey: ["cripto"],
    queryFn: async () => {
      const response = await api.get("/investiments-cripto");
      return response.data;
    },
  });

  // Mutation para deletar
  const deleteCriptoMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/investiments-cripto/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cripto"]);
    },
  });

  // Adicione esta mutation:
  const updateCriptoExitMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/investiments-cripto-exit/${id}`, data);
    },
    onSuccess: () => {
      setOpenEditExit(false);
      setEditExitData(null);
      queryClient.invalidateQueries(["cripto-exit"]);
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
  const updateCriptoMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/investiments-cripto/${id}`, data);
    },
    onSuccess: () => {
      setOpenEdit(false);
      setEditData(null);
      queryClient.invalidateQueries(["cripto"]);
    },
  });

  // Mutation para criar (POST)
  const createCriptoMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/investiments-cripto", data);
    },
    onSuccess: () => {
      setOpenAdd(false);
      setEditData(null);
      queryClient.invalidateQueries(["cripto"]);
    },
  });

  // Submit do formulário
  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      amount: Number(values.amount),
      totalValue: Number(values.totalValue), // valor informado pelo usuário
      purchaseDate: values.purchaseDate,
    };

    if (
      formattedData.amount === "" ||
      formattedData.amount === null ||
      typeof formattedData.amount === "undefined"
    ) {
      delete formattedData.amount;
    }

    if (editData && editData.id) {
      updateCriptoMutation.mutate({
        id: editData.id,
        data: formattedData,
      });
    } else {
      createCriptoMutation.mutate(formattedData);
    }
  };

  // Filtra apenas lançamentos com id definido
  const rowsCripto = Array.isArray(loadCriptoQuery)
    ? loadCriptoQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null
      )
    : [];

  // Parte lógica para a grid de resumo de renda fixa
  // Agrupa os lançamentos por nome e resume os dados
  //
  const rowsCriptoSummary = Object.values(
    rowsCripto.reduce((acc, curr) => {
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

  // Busca lançamentos de renda fixa
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [withdrawData, setWithdrawData] = useState(null);

  // Busca lançamentos de renda fixa de saída
  const { data: loadCriptoExitQuery = [] } = useQuery({
    queryKey: ["cripto-exit"],
    queryFn: async () => {
      const response = await api.get("/investiments-cripto-exit");
      return response.data;
    },
  });

  // Mutation para criar (POST) retirada de renda fixa
  const saveCriptoExitMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/investiments-cripto-exit", data);
    },
    onSuccess: () => {
      setOpenWithdraw(false);
      setWithdrawData(null);
      queryClient.invalidateQueries(["cripto-exit"]);
      queryClient.invalidateQueries(["cripto"]);
    },
  });

  const handleOpenWithdraw = (row) => {
    setWithdrawData(row);
    setOpenWithdraw(true);
  };

  const handleWithdrawSubmit = (values) => {
    const nome = withdrawData.name;
    let quantidadeRestante = Number(values.withdrawalAmount);

    const registros = rowsCripto
      .filter((row) => row.name === nome)
      .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

    registros.forEach((registro) => {
      if (quantidadeRestante <= 0) return;

      const quantidadeAtual = Number(registro.amount);
      const quantidadeParaRetirar = Math.min(
        quantidadeAtual,
        quantidadeRestante
      );

      saveCriptoExitMutation.mutate({
        name: registro.name,
        initialAmount: quantidadeAtual,
        withdrawalAmount: quantidadeParaRetirar,
        salesValue: Number(values.salesValue),
        sellDate: values.sellDate,
        purchaseDate: registro.purchaseDate,
        inclusionDate: registro.purchaseDate,
        typeInvestment: "cripto",
      });

      if (quantidadeParaRetirar === quantidadeAtual) {
        deleteCriptoMutation.mutate(registro.id);
      } else if (quantidadeParaRetirar < quantidadeAtual) {
        const novaQuantidade = quantidadeAtual - quantidadeParaRetirar;
        updateCriptoMutation.mutate({
          id: registro.id,
          data: {
            ...registro,
            amount: novaQuantidade,
          },
        });
      }

      quantidadeRestante -= quantidadeParaRetirar;
    });

    setOpenWithdraw(false);
    setWithdrawData(null);
  };

  // Mutation para deletar retirada de renda fixa
  const deleteCriptoExitMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/investiments-cripto-exit/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cripto-exit"]);
    },
  });

  const rowsCriptoExit = Array.isArray(loadCriptoExitQuery)
    ? loadCriptoExitQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null && row.sellDate
      )
    : [];

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
          typeInvestment: "cripto",
          name: "",
          amount: "",
          purchaseDate: "",
          totalValue: "", // mantenha apenas os campos necessários
        }}
        fields={CriptoFields}
        validationSchema={validationSchema}
        title="Novo Lançamento"
        submitLabel="Adicionar"
      />
      {/* Modal de edição */}
      <GenericFormModal
        open={openEdit}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={
          editData || {
            typeInvestment: "cripto",
            name: "",
            amount: "",
            purchaseDate: "",
            totalValue: "",
          }
        }
        fields={CriptoFields}
        validationSchema={validationSchema}
        title="Editar Lançamento"
        submitLabel="Salvar"
      />
      {/* Modal de retirada */}
      <GenericFormModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onSubmit={handleWithdrawSubmit}
        initialValues={{
          salesValue: "",
          withdrawalAmount: "",
          sellDate: "",
        }}
        fields={[
          {
            name: "salesValue",
            label: "Valor de Venda",
            type: "number",
          },
          {
            name: "withdrawalAmount",
            label: "Quantidade de Retirada",
            type: "number",
          },
          { name: "sellDate", label: "Data de venda", type: "date" },
        ]}
        validationSchema={Yup.object({
          salesValue: Yup.number().required("Obrigatório"),
          withdrawalAmount: Yup.number().required("Obrigatório"),
          sellDate: Yup.string().required("Obrigatório"),
        })}
        title={`Retirada de ${withdrawData?.name || ""}`}
        submitLabel="Retirar"
      />
      {/* Modal de edição de retirada */}
      <GenericFormModal
        open={openEditExit}
        onClose={() => {
          setOpenEditExit(false);
          setEditExitData(null);
        }}
        onSubmit={(values) => {
          updateCriptoExitMutation.mutate({
            id: editExitData.id,
            data: {
              ...editExitData,
              salesValue: values.salesValue,
              sellDate: values.sellDate,
            },
          });
        }}
        initialValues={
          editExitData || {
            salesValue: "",
            sellDate: "",
          }
        }
        fields={[
          {
            name: "salesValue",
            label: "Valor de Venda",
            type: "number",
          },
          { name: "sellDate", label: "Data de venda", type: "date" },
        ]}
        validationSchema={Yup.object({
          salesValue: Yup.number().required("Obrigatório"),
          sellDate: Yup.string().required("Obrigatório"),
        })}
        title="Editar Retirada"
        submitLabel="Salvar"
      />

      <div>
        <Box sx={{ height: 500, width: "100%" }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Resumo</h1>
          </div>
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsCriptoSummary}
            columns={[
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "amountSum",
                headerName: "Quantidade Total",
                flex: 1,
              },
              {
                field: "totalValue",
                headerName: "Valor Total",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              },
              {
                field: "actions",
                headerName: "Ações",
                flex: 0.5,
                disableReorder: true,
                filterable: false,
                disableColumnMenu: true,
                sortable: false,
                headerAlign: "center",
                renderCell: ({ row }) => {
                  return (
                    <div className="flex gap-3 justify-center items-center h-full">
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={() => handleOpenWithdraw(row)}
                      >
                        <PointOfSaleRoundedIcon />
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
            loading={isLoadingCripto}
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
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsCripto}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "purchaseDate",
                headerName: "Data Compra",
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
              // Removido o campo "value" (Valor Por Unidade)
              {
                field: "amount",
                headerName: "Quantidade",
                flex: 1,
              },
              {
                field: "totalValue",
                headerName: "Valor Total",
                flex: 1,
                valueFormatter: (params) =>
                  `R$ ${formatCurrency(params)}`,
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
                        onClick={() => deleteCriptoMutation.mutate(row.id)}
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
            loading={isLoadingCripto}
            disableRowSelectionOnClick
          />
        </Box>

        {/* Total filtrado
          <div className="mt-15 text-right">
            <span>
              Total filtrado: R${" "}
              {(Array.isArray(rowsCripto)
                ? rowsCripto.reduce((sum, row) => {
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
      {/* Retiradas de renda fixa */}
      <div>
        <Box sx={{ height: 500, width: "100%", marginTop: 9 }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Retiradas</h1>
          </div>

          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsCriptoExit}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              // {
              //   field: "initialValue",
              //   headerName: "Valor Unitário Inicial",
              //   flex: 1,
              //   valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              // },
              {
                field: "initialAmount",
                headerName: "Quantidade Inicial",
                flex: 1,
              },
              {
                field: "salesValue",
                headerName: "Valor de Venda",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              },
              {
                field: "withdrawalAmount",
                headerName: "Quantidade Retirada",
                flex: 1,
              },
              {
                field: "sellDate",
                headerName: "Data de venda",
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
              // Removido o campo "totalValue" do retiradas
              {
                field: "actions",
                headerName: "Ações",
                flex: 2,
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
                          setEditExitData({
                            ...row,
                            salesValue: row.salesValue,
                            sellDate: row.sellDate,
                          });
                          setOpenEditExit(true);
                        }}
                      >
                        <EditOutlinedIcon />
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => deleteCriptoExitMutation.mutate(row.id)}
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
            loading={isLoadingCripto}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
}
