import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { GenericFormModal } from "../../components/ui/GenericFormModal";
import * as Yup from "yup";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { useEffect } from "react";

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
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // React Hook Form para gerenciamento de formulários
  const { control, handleSubmit, reset } = useForm();

  // Carrega todas as categorias da API
  const { data: categoriesData = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  });

  // Carrega uma categoria específica para edição
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

  // Salva ou atualiza a categoria
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
      setEditData(null);
      queryClient.invalidateQueries(["categories"]);
    },
  });

  // Deleta uma categoria
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  // Função para abrir o modal de adição
  const handleOpenAddModal = () => {
    reset(); // Limpa o formulário de adição
    setEditData(null);
    setOpenAdd(true);
  };

  // Função para abrir o modal de edição
  const handleEdit = async (id) => {
    const data = await loadOneCategoryMutation.mutateAsync(id);
    setEditData(data);
    setOpenEdit(true);
  };

  // Função para fechar ambos os modais e limpar o formulário
  const handleCloseModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setEditData(null);
    reset(); // Limpa o formulário ao fechar o modal
  };

  // Função chamada ao enviar o formulário (adicionar ou editar)
  const onSubmit = (data, e) => {
    e.preventDefault();

    const formattedData = {
      ...data,
      amount:
        typeof data.amount === "string"
          ? parseFloat(data.amount.replace(/\./g, "").replace(",", "."))
          : data.amount,
      planned:
        typeof data.planned === "string"
          ? parseFloat(data.planned.replace(/\./g, "").replace(",", "."))
          : data.planned,
    };

    if (editData) {
      saveCategoryMutation.mutate({
        data: { ...formattedData, id: editData.id },
        method: "put",
        url: `/categories/${editData.id}`,
      });
    } else {
      saveCategoryMutation.mutate({
        data: formattedData,
        method: "post",
        url: "/categories",
      });
    }
  };

  // Paginação das categorias
  const rows = categoriesData.filter(
    (row) => row && row.id !== undefined && row.id !== null
  );

  return (
    <div className="flex flex-col gap-4 bg-background bg-[#1B2232] height-screen h-screen w-full overflow-hidden">
      {/* Modal de Adição */}
      <CategoryAddModal
        open={openAdd}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)} // Passando handleSubmit
        control={control} // Passando o controle
        categories={categoriesData}
      />
      {/* Modal de Edição */}
      <CategoryEditModal
        open={openEdit}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)} // Passando handleSubmit
        control={control} // Passando o controle
        initialValues={editData || {}}
        categories={categoriesData}
      />

      {/* Área principal com botão de adicionar e tabela */}
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-end w-full">
          {/* Botão para abrir o modal de adição */}
          <Button variant="contained" onClick={handleOpenAddModal}>
            Adicionar Nova Categoria
          </Button>
        </div>

        <TableContainer component={Paper} sx={{ backgroundColor: "#0F1729" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1E2B45" }}>
                <TableCell sx={{ color: "white" }}>Nome</TableCell>
                <TableCell sx={{ color: "white" }}>Descrição</TableCell>
                <TableCell sx={{ color: "white" }}>Tipo</TableCell>
                <TableCell sx={{ color: "white" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: "white" }}>{row.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.description}
                  </TableCell>

                  {/* Alteração de Cor de Tipo */}
                  <TableCell sx={{ color: "white" }}>
                    {row.type === "expanse" && (
                      <span style={{ color: "red" }}>Despesa</span>
                    )}
                    {row.type === "income" && (
                      <span style={{ color: "green" }}>Receita</span>
                    )}
                    {row.type === "investment" && (
                      <span style={{ color: "yellow" }}>Investimento</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3 justify-center items-center">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[7, 10, 25]}
            labelRowsPerPage="Linhas por página"
            sx={{ color: "white" }}
          />
        </TableContainer>
      </div>
    </div>
  );
};
