import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
import { useState } from "react";
import { GenericFormModal } from "../../components/ui/GenericFormModal";
import * as Yup from "yup";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { useEffect } from "react";
import api from "../../services/api";

// Campos do formulário
const categoryFields = [
  { name: "name", label: "Nome" },
  { name: "description", label: "Descrição" },
  {
    name: "type",
    label: "Tipo",
    type: "select",
    options: [
      { value: "expanse", label: "Despesas" },
      { value: "income", label: "Receita" },
      { value: "investment", label: "Investimentos" },
    ],
  },
];

// Novos campos para o modal extra de investimentos
const investmentFields = [
  {
    name: "investmentType",
    label: "Tipo de Investimento",
    type: "select",
    options: [
      { value: "fixed_income", label: "Renda Fixa" },
      { value: "variable_income", label: "Renda Variável" },
      { value: "cripto", label: "Cripto" },
    ],
  },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Nome obrigatório"),
  description: Yup.string(),
  type: Yup.string(),
});

const investmentValidation = Yup.object({
  investmentType: Yup.string().required("Selecione o tipo de investimento"),
});

export const CategoryPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openInvestment, setOpenInvestment] = useState(false);
  const [investmentData, setInvestmentData] = useState(null);

  const queryClient = useQueryClient();

  const { data: categories, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  });

  const loadOneCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.get(`/categories/${id}`); // Usando instância api
      return response.data;
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (params) => {
      await api({
        method: params.method,
        url: params.url,
        data: params.data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setOpenAdd(false);
      setOpenEdit(false);
      // reset();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  // Adicionar
  const handleOpenAddModal = () => {
    setEditData(null);
    setOpenAdd(true);
  };

  // Editar
  const handleEdit = async (id) => {
    try {
      const data = await loadOneCategoryMutation.mutateAsync(id);
      setEditData(data);
      setOpenEdit(true);
    } catch {
      setEditData(null);
      setOpenEdit(false);
    }
  };

  // Fechar modais
  const handleCloseModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setEditData(null);
  };

  // Detecta seleção de "investment" no modal principal
  function handleAddFormChange(values) {
    if (values.type === "investment" && !openInvestment) {
      setOpenInvestment(true);
    }
  }

  // Submit do modal de investimento
  function handleInvestmentSubmit(values) {
    setInvestmentData(values);
    setOpenInvestment(false);
  }

  // Adapta o submit do formulário principal para incluir dados de investimento
  const handleSubmit = (values) => {
    let dataToSend = { ...values };
    if (values.type === "investment" && investmentData) {
      dataToSend = { ...dataToSend, ...investmentData };
    }
    if (editData && editData.id) {
      saveCategoryMutation.mutate({
        data: { ...dataToSend, id: editData.id },
        method: "put",
        url: `/categories/${editData.id}`,
      });
    } else {
      const newId = Math.random().toString(36).substr(2, 8);
      saveCategoryMutation.mutate({
        data: { ...dataToSend, id: newId },
        method: "post",
        url: "/categories",
      });
    }
    setInvestmentData(null); // limpa ao salvar
  };

  // Filtra apenas categorias com id definido
  const rows = Array.isArray(categories)
    ? categories.filter((row) => row && row.id !== undefined && row.id !== null)
    : [];

  return (
    <div className="flex flex-col gap-4 bg-background bg-[#1B2232]">
      {/* Modal Adicionar */}
      <GenericFormModal
        open={openAdd}
        onClose={() => {
          handleCloseModal();
          setInvestmentData(null);
        }}
        onSubmit={handleSubmit}
        initialValues={{
          name: "",
          description: "",
          type: categoryFields.find((f) => f.name === "type").options[0].value,
        }}
        fields={categoryFields}
        validationSchema={validationSchema}
        title="Nova Categoria"
        submitLabel="Adicionar"
        onChange={handleAddFormChange}
      />
      {/* Modal extra para Investimento */}
      <GenericFormModal
        open={openInvestment}
        onClose={() => setOpenInvestment(false)}
        onSubmit={handleInvestmentSubmit}
        initialValues={{ investmentType: "" }}
        fields={investmentFields}
        validationSchema={investmentValidation}
        title="Tipo de Investimento"
        submitLabel="Selecionar"
      />
      {/* Modal Editar */}
      <GenericFormModal
        open={openEdit}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={
          editData || {
            name: "",
            description: "",
            type: categoryFields.find((f) => f.name === "type").options[0]
              .value,
          }
        }
        fields={categoryFields}
        validationSchema={validationSchema}
        title="Editar Categoria"
        submitLabel="Salvar"
      />

      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-end w-full">
          <Button variant="contained" onClick={handleOpenAddModal}>
            Nova Categoria
          </Button>
        </div>

        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          columns={[
            { field: "id", headerName: "ID", flex: 0.5 },
            { field: "name", headerName: "Nome", flex: 2 },
            { field: "description", headerName: "Descrição", flex: 2 },
            {
              field: "type",
              headerName: "Tipo",
              flex: 1,
              renderCell: (params) => {
                const type = params?.row?.type;
                const map = {
                  expanse: "Despesas",
                  income: "Receita",
                  investment: "Investimentos",
                };
                return map[type] || type || "";
              },
            },
            {
              field: "investmentType",
              headerName: "Tipo Investimento",
              flex: 1,
            },
            {
              field: "count",
              headerName: "Uso",
              flex: 0.5,
              valueGetter: (params) => params?.row?.count ?? 0,
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
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditOutlinedIcon />
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => deleteCategoryMutation.mutate(row.id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          rows={rows}
          loading={isPending}
        />
      </div>
    </div>
  );
};
