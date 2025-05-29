import {
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { GenericFormModal } from "../../components/ui/GenericFormModal";
import * as Yup from "yup";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


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

// Validação
const validationSchema = Yup.object({
  name: Yup.string().required("Nome obrigatório"),
  description: Yup.string(),
  type: Yup.string(),
});

export const CategoryPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const queryClient = useQueryClient();

  const { data: categories, isPending } = useQuery({
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

  const loadOneCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: `/categories/${id}`,
      });
      return response.data;
    },
  });

  const saveCategoryMutation = useMutation({
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
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/categories/${id}`,
      });
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

  // Submit
  const handleSubmit = (values) => {
    if (editData && editData.id) {
      saveCategoryMutation.mutate({
        data: { ...values, id: editData.id },
        method: "put",
        url: `/categories/${editData.id}`,
      });
    } else {
      saveCategoryMutation.mutate({
        data: { ...values },
        method: "post",
        url: "/categories",
      });
    }
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
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={{ name: "", description: "", type: "" }}
        fields={categoryFields}
        validationSchema={validationSchema}
        title="Nova Categoria"
        submitLabel="Adicionar"
      />
      {/* Modal Editar */}
      <GenericFormModal
        open={openEdit}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={editData || { name: "", description: "", type: "" }}
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
            { field: "type", headerName: "Tipo", flex: 1 },
            { field: "count", headerName: "Uso", flex: 0.5, valueGetter: (params) => params?.row?.count ?? "" },
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