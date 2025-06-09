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

const useFixedIncomeCategories = () => {
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
            cat.type === "investment" && cat.investmentType === "fixed_income"
        )
        .map((cat) => ({ value: cat.name, label: cat.name })),
    [categories]
  );
};

const validationSchema = Yup.object({
  typeInvestment: Yup.string().required("Tipo obrigatório"),
  name: Yup.string().required("Nome obrigatório"),
  value: Yup.number().required("Valor obrigatório"),
  interestRate: Yup.number(),
  startDate: Yup.string().required("Data inicial obrigatória"),
  dueDate: Yup.string().required("Data de vencimento obrigatória"),
});

export function FixedIncome() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openEditExit, setOpenEditExit] = useState(false);
  const [editExitData, setEditExitData] = useState(null);

  const queryClient = useQueryClient();

  // Busca lançamentos de renda fixa
  const { data: loadFixedIncomeQuery = [], isLoading: isLoadingFixedIncome } =
    useQuery({
      queryKey: ["fixed_income"],
      queryFn: async () => {
        const response = await api.get("/investiments-fixed-income");
        return response.data;
      },
    });

  // Busca categorias para o select de nome
  const nameOptions = useFixedIncomeCategories();

  // Campos do formulário
  const fixedIncomeFields = [
    {
      name: "name",
      label: "Nome",
      type: "select",
      options: nameOptions,
    },
    { name: "value", label: "Valor" },
    { name: "interestRate", label: "Taxa de Juros (%)" },
    { name: "startDate", label: "Data Inicial", type: "date" },
    { name: "dueDate", label: "Data de Vencimento", type: "date" },
  ];

  // Mutation para deletar

  const deleteFixedIncomeMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/investiments-fixed-income/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  // Adicione esta mutation:
  const updateFixedIncomeExitMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/investiments-fixed-income-exit/${id}`, data);
    },
    onSuccess: () => {
      setOpenEditExit(false);
      setEditExitData(null);
      queryClient.invalidateQueries(["fixed-income-exit"]);
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
  const updateFixedIncomeMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/investiments-fixed-income/${id}`, data);
    },
    onSuccess: () => {
      setOpenEdit(false);
      setEditData(null);
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  // Mutation para criar (POST)
  const createFixedIncomeMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/investiments-fixed-income", data);
    },
    onSuccess: () => {
      setOpenAdd(false);
      setEditData(null);
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  // Submit do formulário
  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      value: Number(values.value), // Garante que value é número
      startDate: values.startDate,
      dueDate: values.dueDate,
    };

    // Remove interestRate se estiver vazio, nulo ou undefined
    if (
      formattedData.interestRate === "" ||
      formattedData.interestRate === null ||
      typeof formattedData.interestRate === "undefined"
    ) {
      delete formattedData.interestRate;
    }

    if (editData && editData.id) {
      updateFixedIncomeMutation.mutate({
        id: editData.id,
        data: formattedData,
      });
    } else {
      createFixedIncomeMutation.mutate(formattedData);
    }
  };

  // Filtra apenas lançamentos com id definido
  const rowsFixedIncome = Array.isArray(loadFixedIncomeQuery)
    ? loadFixedIncomeQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null
      )
    : [];

  // Parte lógica para a grid de resumo de renda fixa
  // Agrupa os lançamentos por nome e resume os dados
  //
  const rowsFixedIncomeSummary = Object.values(
    rowsFixedIncome.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = {
          id: curr.name, // pode usar o nome como id do resumo
          name: curr.name,
          value: 0,
          interestRateSum: 0,
          interestRateCount: 0,
          startDate: curr.startDate,
          dueDate: curr.dueDate,
        };
      }
      acc[curr.name].value += Number(curr.value || 0);
      acc[curr.name].interestRateSum += Number(curr.interestRate || 0);
      acc[curr.name].interestRateCount += 1;
      // Se quiser mostrar a menor data inicial e maior data final:
      if (
        acc[curr.name].startDate > curr.startDate ||
        !acc[curr.name].startDate
      ) {
        acc[curr.name].startDate = curr.startDate;
      }
      if (acc[curr.name].dueDate < curr.dueDate || !acc[curr.name].dueDate) {
        acc[curr.name].dueDate = curr.dueDate;
      }
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    interestRate:
      item.interestRateCount > 0
        ? (item.interestRateSum / item.interestRateCount).toFixed(2)
        : "0.00",
  }));

  //Parte logica para o os lançamentos de renda fixa de saida

  // Busca lançamentos de renda fixa
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [withdrawData, setWithdrawData] = useState(null);

  // Busca lançamentos de renda fixa de saída
  const { data: loadFixedIncomeExitQuery = [] } = useQuery({
    queryKey: ["fixed-income-exit"],
    queryFn: async () => {
      const response = await api.get("/investiments-fixed-income-exit");
      return response.data;
    },
  });

  // Mutation para criar (POST) retirada de renda fixa
  const saveFixedIncomeExitMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/investiments-fixed-income-exit", data);
    },
    onSuccess: () => {
      setOpenWithdraw(false);
      setWithdrawData(null);
      queryClient.invalidateQueries(["fixed-income-exit"]);
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  const handleOpenWithdraw = (row) => {
    setWithdrawData(row);
    setOpenWithdraw(true);
  };

  const handleWithdrawSubmit = (values) => {
    const nome = withdrawData.name;
    let valorRestante = Number(values.withdrawalAmount);

    // Filtra e ordena os lançamentos daquele nome por data (mais antigos primeiro)
    const registros = rowsFixedIncome
      .filter((row) => row.name === nome)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    registros.forEach((registro) => {
      if (valorRestante <= 0) return;

      const valorAtual = Number(registro.value);
      const valorParaRetirar = Math.min(valorAtual, valorRestante);

      // Salva a retirada (POST)
      saveFixedIncomeExitMutation.mutate({
        name: registro.name,
        initialValue: valorAtual,
        withdrawalAmount: valorParaRetirar,
        sellDate: values.sellDate,
        startDate: registro.startDate,
        dueDate: registro.dueDate,
        interestRate: registro.interestRate,
        inclusionDate: registro.startDate,
        typeInvestment: "fixed_income",
      });

      if (valorParaRetirar === valorAtual) {
        // Remove o lançamento se retirou tudo (DELETE)
        deleteFixedIncomeMutation.mutate(registro.id);
      } else if (valorParaRetirar < valorAtual) {
        // Atualiza o valor do lançamento se retirou parcialmente (PUT)
        updateFixedIncomeMutation.mutate({
          id: registro.id,
          data: {
            ...registro,
            value: valorAtual - valorParaRetirar,
          },
        });
      }

      valorRestante -= valorParaRetirar;
    });

    setOpenWithdraw(false);
    setWithdrawData(null);
  };

  // Mutation para deletar retirada de renda fixa
  const deleteFixedIncomeExitMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/investiments-fixed-income-exit/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fixed-income-exit"]);
    },
  });

  const rowsFixedIncomeExit = Array.isArray(loadFixedIncomeExitQuery)
    ? loadFixedIncomeExitQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null && row.sellDate
      )
    : [];

  // Função utilitária para formatar valores como moeda brasileira
  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") return "";
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
          typeInvestment: "fixed_income", // valor padrão aqui
          name: "",
          value: "",
          interestRate: "",
          startDate: "",
          dueDate: "",
        }}
        fields={fixedIncomeFields}
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
            typeInvestment: "fixed_income",
            name: "",
            value: "",
            interestRate: "",
            startDate: "",
            dueDate: "",
          }
        }
        fields={fixedIncomeFields}
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
          withdrawalAmount: "",
          sellDate: "",
        }}
        fields={[
          {
            name: "withdrawalAmount",
            label: "Valor de Retirada",
            type: "number",
          },
          { name: "sellDate", label: "Data de venda", type: "date" },
        ]}
        validationSchema={Yup.object({
          withdrawalAmount: Yup.number()
            .required("Obrigatório")
            .min(0.01, "Valor mínimo 0.01")
            .max(
              Number(withdrawData?.value || 0),
              "Não pode ser maior que o valor total"
            ),
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
          updateFixedIncomeExitMutation.mutate({
            id: editExitData.id,
            data: {
              ...editExitData,
              withdrawalAmount: values.withdrawalAmount,
              sellDate: values.sellDate,
            },
          });
        }}
        initialValues={
          editExitData || {
            withdrawalAmount: "",
            sellDate: "",
          }
        }
        fields={[
          {
            name: "withdrawalAmount",
            label: "Valor de Retirada",
            type: "number",
          },
          { name: "sellDate", label: "Data de venda", type: "date" },
        ]}
        validationSchema={Yup.object({
          withdrawalAmount: Yup.number()
            .required("Obrigatório")
            .min(0.01, "Valor mínimo 0.01"),
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
            rows={rowsFixedIncomeSummary}
            columns={[
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "value",
                headerName: "Valor Total",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              },
              {
                field: "interestRate",
                headerName: "Média Taxa de Juros (%)",
                flex: 1,
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
            loading={isLoadingFixedIncome}
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
            rows={rowsFixedIncome}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "value",
                headerName: "Valor",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              },
              {
                field: "interestRate",
                headerName: "Taxa de Juros (%)",
                flex: 1,
              },
              {
                field: "startDate",
                headerName: "Data Inicial",
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
                field: "dueDate",
                headerName: "Data de Vencimento",
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
                        onClick={() => deleteFixedIncomeMutation.mutate(row.id)}
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
            loading={isLoadingFixedIncome}
            disableRowSelectionOnClick
          />
        </Box>

        {/* Total filtrado
        <div className="mt-15 text-right">
          <span>
            Total filtrado: R${" "}
            {(Array.isArray(rowsFixedIncome)
              ? rowsFixedIncome.reduce((sum, row) => {
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
            rows={rowsFixedIncomeExit}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              {
                field: "initialValue",
                headerName: "Valor Inicial",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
              },
              {
                field: "withdrawalAmount",
                headerName: "Valor de Retirada",
                flex: 1,
                valueFormatter: (params) => `R$ ${formatCurrency(params)}`,
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
                            withdrawalAmount: row.withdrawalAmount,
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
                        onClick={() =>
                          deleteFixedIncomeExitMutation.mutate(row.id)
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
            loading={isLoadingFixedIncome}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
}
