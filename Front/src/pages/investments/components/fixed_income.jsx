import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { useState, useMemo } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import { ptBR } from "@mui/x-data-grid/locales";
import { GenericFormModal } from "../../../components/ui/GenericFormModal";
import * as Yup from "yup";

//Parte logica para o os lançamentos de renda fixa de entrada

// Busca as categorias para montar o select de nome
const useFixedIncomeCategories = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/categories",
      });
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
  typInvestiment: Yup.string().required("Tipo obrigatório"),
  name: Yup.string().required("Nome obrigatório"),
  value: Yup.number().required("Valor obrigatório"),
  interest_rate: Yup.number().required("Taxa obrigatória"),
  start_date: Yup.string().required("Data inicial obrigatória"),
  due_date: Yup.string().required("Data de vencimento obrigatória"),
});

export function FixedIncome() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const queryClient = useQueryClient();

  // Busca lançamentos de renda fixa
  const { data: loadFixedIncomeQuery = [], isLoading: isLoadingFixedIncome } =
    useQuery({
      queryKey: ["fixed_income"],
      queryFn: async () => {
        const response = await axios({
          method: "get",
          baseURL: import.meta.env.VITE_API,
          url: "/investiments_fixed_income",
        });
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
    { name: "interest_rate", label: "Taxa de Juros (%)" },
    { name: "start_date", label: "Data Inicial", type: "date" },
    { name: "due_date", label: "Data de Vencimento", type: "date" },
  ];

  // Mutation para buscar um lançamento específico
  const loadOneFixedIncomeMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: `/investiments_fixed_income/${id}`,
      });
      return response.data;
    },
  });

  // Mutation para salvar (criar ou editar)
  const saveFixedIncomeMutation = useMutation({
    mutationFn: async (params) => {
      await axios({
        method: params.method,
        baseURL: import.meta.env.VITE_API,
        url: params.url,
        data: params.data,
      });
    },
    onSuccess: () => {
      setOpenAdd(false);
      setOpenEdit(false);
      setEditData(null);
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  // Mutation para deletar
  const deleteFixedIncomeMutation = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/investiments_fixed_income/${id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  // Abrir modal de adição
  const handleOpenAddModal = () => {
    setEditData(null);
    setOpenAdd(true);
  };

  // Abrir modal de edição
  const handleEdit = async (id) => {
    try {
      const data = await loadOneFixedIncomeMutation.mutateAsync(id);
      setEditData({
        ...data,
        start_date: data.start_date ? data.start_date : "",
        due_date: data.due_date ? data.due_date : "",
      });
      setOpenEdit(true);
    } catch (error) {
      console.error("Erro ao carregar lançamento para edição:", error);
    }
  };

  // Fechar modais
  const handleCloseModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setEditData(null);
  };

  // Submit do formulário
  const handleSubmit = (values) => {
    // Formata datas para string ISO antes de enviar
    const formattedData = {
      ...values,
      start_date: values.start_date,
      due_date: values.due_date,
    };

    if (editData && editData.id) {
      saveFixedIncomeMutation.mutate({
        data: { ...formattedData, id: editData.id },
        method: "put",
        url: `/investiments_fixed_income/${editData.id}`,
      });
    } else {
      // Gera um id string único (caso o backend não gere)
      const newId = Math.random().toString(36).substr(2, 8);
      saveFixedIncomeMutation.mutate({
        data: { ...formattedData, id: newId },
        method: "post",
        url: "/investiments_fixed_income",
      });
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
  const rowsFixedIncomeSummary = Object.values(
    rowsFixedIncome.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = {
          id: curr.name, // pode usar o nome como id do resumo
          name: curr.name,
          value: 0,
          interest_rate_sum: 0,
          interest_rate_count: 0,
          start_date: curr.start_date,
          due_date: curr.due_date,
        };
      }
      acc[curr.name].value += Number(curr.value || 0);
      acc[curr.name].interest_rate_sum += Number(curr.interest_rate || 0);
      acc[curr.name].interest_rate_count += 1;
      // Se quiser mostrar a menor data inicial e maior data final:
      if (
        acc[curr.name].start_date > curr.start_date ||
        !acc[curr.name].start_date
      ) {
        acc[curr.name].start_date = curr.start_date;
      }
      if (acc[curr.name].due_date < curr.due_date || !acc[curr.name].due_date) {
        acc[curr.name].due_date = curr.due_date;
      }
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    interest_rate:
      item.interest_rate_count > 0
        ? (item.interest_rate_sum / item.interest_rate_count).toFixed(2)
        : "0.00",
  }));

  //Parte logica para o os lançamentos de renda fixa de saida

  // Busca lançamentos de renda fixa
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [withdrawData, setWithdrawData] = useState(null);

  const { data: loadFixedIncomeExitQuery = [] } = useQuery({
    queryKey: ["fixed_income_exit"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments_fixed_income_exit",
      });
      return response.data;
    },
  });

  const saveFixedIncomeExitMutation = useMutation({
    mutationFn: async (data) => {
      await axios({
        method: "post",
        baseURL: import.meta.env.VITE_API,
        url: "/investiments_fixed_income_exit",
        data,
      });
    },
    onSuccess: () => {
      setOpenWithdraw(false);
      setWithdrawData(null);
      queryClient.invalidateQueries(["fixed_income_exit"]);
      queryClient.invalidateQueries(["fixed_income"]);
    },
  });

  const withdrawFields = [
    { name: "initial_value", label: "Valor Inicial", type: "number" },
    { name: "withdrawal_amount", label: "Valor de Retirada", type: "number" },
    { name: "sell_date", label: "Data de venda", type: "date" },
  ];

  const handleOpenWithdraw = (row) => {
    setWithdrawData(row);
    setOpenWithdraw(true);
  };

  const handleWithdrawSubmit = (values) => {
    const valorAtual = Number(withdrawData.value);
    const valorRetirada = Number(values.withdrawal_amount);

    // Garante que o valor inicial salvo é o valor antes da retirada
    saveFixedIncomeExitMutation.mutate({
      id: Math.random().toString(36).substr(2, 8),
      name: withdrawData.name,
      initial_value: valorAtual,
      withdrawal_amount: valorRetirada,
      sell_date: values.sell_date,
    });

    // Se retirou tudo ou mais, exclui o lançamento
    if (valorRetirada >= valorAtual) {
      deleteFixedIncomeMutation.mutate(withdrawData.id);
    } else {
      // Se retirada parcial, atualiza valor
      saveFixedIncomeMutation.mutate({
        data: {
          ...withdrawData,
          value: valorAtual - valorRetirada,
        },
        method: "put",
        url: `/investiments_fixed_income/${withdrawData.id}`,
      });
    }
  };

  const rowsFixedIncomeExit = Array.isArray(loadFixedIncomeExitQuery)
    ? loadFixedIncomeExitQuery.filter(
        (row) => row && row.id !== undefined && row.id !== null && row.sell_date
      )
    : [];

  return (
    <div className="flex flex-col height-screen h-full w-full overflow-hidden ">
      {/* Modal de adição */}
      <GenericFormModal
        open={openAdd}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={{
          typInvestiment: "fixed_income", // valor padrão aqui
          name: "",
          value: "",
          interest_rate: "",
          start_date: "",
          due_date: "",
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
            typInvestiment: "fixed_income",
            name: "",
            value: "",
            interest_rate: "",
            start_date: "",
            due_date: "",
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
          withdrawal_amount: "",
          sell_date: "",
        }}
        fields={[
          {
            name: "withdrawal_amount",
            label: "Valor de Retirada",
            type: "number",
          },
          { name: "sell_date", label: "Data de venda", type: "date" },
        ]}
        validationSchema={Yup.object({
          withdrawal_amount: Yup.number()
            .required("Obrigatório")
            .min(0.01, "Valor mínimo 0.01"),
          sell_date: Yup.string().required("Obrigatório"),
        })}
        title={`Retirada de ${withdrawData?.name || ""}`}
        submitLabel="Retirar"
      />

      <div className="flex justify-end  mr-4 ">
        <Button variant="contained" onClick={handleOpenAddModal}>
          Novo Lançamento
        </Button>
      </div>
      <Box sx={{ height: 500, width: "100%", padding: 2 }}>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rowsFixedIncome}
          columns={[
            { field: "id", headerName: "ID", flex: 0.5 },
            { field: "name", headerName: "Nome", flex: 2 },
            { field: "value", headerName: "Valor", flex: 1 },
            {
              field: "interest_rate",
              headerName: "Taxa de Juros (%)",
              flex: 1,
            },
            {
              field: "start_date",
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
              field: "due_date",
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
                      onClick={() => handleEdit(row.id)}
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
      <div className="mt-4 text-right">
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
      </div>
      <div>
        <Box sx={{ height: 500, width: "100%", padding: 2 }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Resumo</h1>
          </div>
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsFixedIncomeSummary}
            columns={[
              { field: "name", headerName: "Nome", flex: 2 },
              { field: "value", headerName: "Valor Total", flex: 1 },
              {
                field: "interest_rate",
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
      <div>
        <Box sx={{ height: 500, width: "100%", padding: 2, marginTop: 2 }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Retiradas</h1>
          </div>

          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rowsFixedIncomeExit}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "name", headerName: "Nome", flex: 2 },
              { field: "initial_value", headerName: "Valor Inicial", flex: 1 },
              {
                field: "withdrawal_amount",
                headerName: "Valor de Retirada",
                flex: 1,
              },
              {
                field: "sell_date",
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
                        onClick={() => handleEdit(row.id)}
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
      </div>
    </div>
  );
}
