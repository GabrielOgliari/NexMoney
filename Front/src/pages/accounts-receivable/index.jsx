// arquivo de contas a receber
import React, { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AccountsReceivableAddModal } from "./components/modal_add";
import { AccountsReceivableEditModal } from "./components/modal_edit";
import api from "../../services/api";
import dayjs from "dayjs";

export const AccountsReceivablePage = () => {
  // Estados para controlar abertura dos modais de adição e edição
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Instância do React Query para gerenciamento de cache
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const queryClient = useQueryClient();
  // Carrega as categorias do tipo "income" (Receitas)
  const { data: categoriesData = [] } = useQuery({
    queryKey: ["categories", "income"],
    queryFn: async () => {
      const response = await api.get("/categories", {
        params: { type: "income" },
      });
      return response.data;
    },
  });

  // Consulta para buscar todas as contas a receber
  const loadAccountsReceivableQuery = useQuery({
    queryKey: ["accounts-receivable"],
    queryFn: async () => {
      const response = await api.get("/accounts-receivable");
      return response.data;
    },
  });

  // Ajuste para rows seguro
  const rows =
    loadAccountsReceivableQuery.isLoading || loadAccountsReceivableQuery.isError
      ? []
      : loadAccountsReceivableQuery.data || [];

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Mutation para buscar uma conta específica para edição
  const loadOneAccountsReceivableMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.get(`/accounts-receivable/${id}`); // Usando instância api
      return response.data;
    },
  });

  // Mutation para salvar (criar ou editar) uma conta a receber
  const saveAccountsReceivableMutation = useMutation({
    mutationFn: async (params) => {
      await api({
        method: params.method,
        url: params.url,
        data: params.data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts-receivable"]);
      setOpenAdd(false);
      setOpenEdit(false);
      reset();
    },
  });

  // Mutation para deletar uma conta a receber
  const deleteAccountsReceivableMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/accounts-receivable/${id}`);
    },
    onSuccess: () => {
      // Atualiza a lista após deletar
      queryClient.invalidateQueries(["accounts-receivable"]);
    },
  });

  // React Hook Form para controle dos campos do formulário
  const { handleSubmit, control, reset, register, watch } = useForm({
    defaultValues: {
      description: "",
      amount: "",
      dueDate: null, // usar null para data
      category: "",
      categoryId: "",
      status: "pending",
      reminder: false,
      recurrence: {
        type: "monthly",
        hasEndDate: false,
        endDate: null,
      },
    },
  });

  // Efeito para preencher o formulário ao editar uma conta
  useEffect(() => {
    if (isEditing && loadOneAccountsReceivableMutation.data) {
      const data = loadOneAccountsReceivableMutation.data;
      reset({
        description: data.description || "",
        amount: data.amount || "",
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
        category: data.category || "",
        categoryId: data.categoryId || "",
        status: data.status || "pending",
        reminder: data.reminder || false,
        recurrence: {
          type: data.recurrence?.type || "monthly",
          hasEndDate: data.recurrence?.hasEndDate || false,
          endDate: data.recurrence?.endDate
            ? dayjs(data.recurrence.endDate)
            : null,
        },
      });
    }
  }, [isEditing, loadOneAccountsReceivableMutation.data, reset]);

  // Função para abrir o modal de adição
  const handleOpenAddModal = () => {
    reset({
      description: "",
      amount: "",
      dueDate: null,
      category: "",
      categoryId: "",
      status: "pending",
      reminder: false,
      recurrence: {
        type: "monthly",
        hasEndDate: false,
        endDate: null,
      },
    });
    setIsEditing(false);
    setOpenAdd(true);
  };

  // Função para fechar ambos os modais e limpar o formulário
  const handleCloseModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    reset();
  };

  // Função chamada ao enviar o formulário (adicionar ou editar)
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      amount:
        typeof data.amount === "string"
          ? parseFloat(data.amount.replace(/\./g, "").replace(",", "."))
          : data.amount,
      dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : null,
      recurrence: {
        ...data.recurrence,
        endDate:
          data.recurrence.hasEndDate && data.recurrence.endDate
            ? data.recurrence.endDate.format("YYYY-MM-DD")
            : null,
      },
    };

    // Se estiver editando, faz PUT, senão faz POST
    if (isEditing) {
      const id = loadOneAccountsReceivableMutation.data?.id;
      if (!id) return;
      saveAccountsReceivableMutation.mutate({
        data: { ...formattedData, id },
        method: "put",
        url: `/accounts-receivable/${id}`,
      });
    } else {
      saveAccountsReceivableMutation.mutate({
        data: formattedData,
        method: "post",
        url: "/accounts-receivable",
      });
    }
  };

  // Função para carregar dados de uma conta e abrir o modal de edição
  const handleEdit = async (id) => {
    try {
      const data = await loadOneAccountsReceivableMutation.mutateAsync(id);
      setIsEditing(true);
      setOpenEdit(true);
      reset({
        description: data.description || "",
        amount: data.amount || "",
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
        category: data.category || "",
        categoryId: data.categoryId || "",
        status: data.status || "pending",
        reminder: data.reminder || false,
        recurrence: {
          type: data.recurrence?.type || "monthly",
          hasEndDate: data.recurrence?.hasEndDate || false,
          endDate: data.recurrence?.endDate
            ? dayjs(data.recurrence.endDate)
            : null,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar conta para edição:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-background bg-[#1B2232] height-screen h-screen w-full overflow-hidden">
      {/* Modal de adição */}
      <AccountsReceivableAddModal
        open={openAdd}
        handleCloseModal={handleCloseModal}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        watch={watch}
        categories={categoriesData}
      />
      {/* Modal de edição */}
      <AccountsReceivableEditModal
        open={openEdit}
        handleCloseModal={handleCloseModal}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        watch={watch}
        categories={categoriesData}
      />

      {/* Área principal com botão de adicionar e tabela */}
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-end w-full">
          {/* Botão para abrir o modal de adição */}
          <Button variant="contained" onClick={handleOpenAddModal}>
            Adicionar Novo
          </Button>
        </div>

        {/* Tabela para exibir as contas a receber */}
        <TableContainer component={Paper} sx={{ backgroundColor: "#0F1729" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1E2B45" }}>
                <TableCell sx={{ color: "white" }}>Descrição</TableCell>
                <TableCell sx={{ color: "white" }}>Valor</TableCell>
                <TableCell sx={{ color: "white" }}>
                  Data de Recebimento
                </TableCell>
                <TableCell sx={{ color: "white" }}>Categoria</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Recorrência</TableCell>
                <TableCell sx={{ color: "white" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadAccountsReceivableQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ color: "white" }}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: "white" }}>
                      {row.description}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.amount)}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {row.dueDate
                        ? dayjs(row.dueDate).format("DD/MM/YYYY")
                        : ""}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {row.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: row.status === "paid" ? "#22c55e" : "#f59e42",
                      }}
                    >
                      {row.status === "paid" ? "Pago" : "Pendente"}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {row.reminder && row.recurrence
                        ? `${
                            {
                              monthly: "Mensal",
                              weekly: "Semanal",
                              annual: "Anual",
                              daily: "Diária",
                            }[row.recurrence.type] || row.recurrence.type
                          } ${
                            row.recurrence.currentOccurrence &&
                            row.recurrence.occurrences
                              ? `(${row.recurrence.currentOccurrence}/${row.recurrence.occurrences})`
                              : ""
                          }`
                        : "-"}
                    </TableCell>
                    <TableCell>
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
                          onClick={() =>
                            deleteAccountsReceivableMutation.mutate(row.id)
                          }
                        >
                          <DeleteOutlineOutlinedIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
