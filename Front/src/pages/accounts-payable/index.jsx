// arquivo de contas a pagar
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
//import { FormInputText } from "../../components/ui/form-input-text";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AccountsPayableAddModal } from "./components/modal_add";
import { AccountsPayableEditModal } from "./components/modal_edit";

// Importa DatePicker e adapter para dayjs
//import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
//import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const AccountsPayablePage = () => {
  // Estados para controlar abertura dos modais de adição e edição
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Instância do React Query para gerenciamento de cache
  const queryClient = useQueryClient();

  // Carrega as categorias do banco
  const { data: categoriesData = [] } = useQuery({
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

  // Consulta para buscar todas as contas a pagar
  const loadAccountsPayableQuery = useQuery({
    queryKey: ["accounts-payable"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/accounts-payable",
      });
      return response.data;
    },
  });

  // Mutation para buscar uma conta específica para edição
  const loadOneAccountsPayableMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: `/accounts-payable/${id}`,
      });
      return response.data;
    },
  });

  // Mutation para salvar (criar ou editar) uma conta a pagar
  const saveAccountsPayableMutation = useMutation({
    mutationFn: async (params) => {
      await axios({
        method: params.method,
        baseURL: import.meta.env.VITE_API,
        url: params.url,
        data: params.data,
      });
    },
    onSuccess: () => {
      // Atualiza a lista após salvar e fecha os modais
      queryClient.invalidateQueries(["accounts-payable"]);
      setOpenAdd(false);
      setOpenEdit(false);
      reset();
    },
  });

  // Mutation para deletar uma conta a pagar
  const deleteAccountsPayableMutation = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/accounts-payable/${id}`,
      });
    },
    onSuccess: () => {
      // Atualiza a lista após deletar
      queryClient.invalidateQueries(["accounts-payable"]);
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
    if (isEditing && loadOneAccountsPayableMutation.data) {
      const data = loadOneAccountsPayableMutation.data;
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
  }, [isEditing, loadOneAccountsPayableMutation.data, reset]);

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
    // Formata datas para string ISO antes de enviar
    const formattedData = {
      ...data,
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
      const id = loadOneAccountsPayableMutation.data?.id;
      if (!id) return;
      saveAccountsPayableMutation.mutate({
        data: { ...formattedData, id },
        method: "put",
        url: `/accounts-payable/${id}`,
      });
    } else {
      saveAccountsPayableMutation.mutate({
        data: formattedData,
        method: "post",
        url: "/accounts-payable",
      });
    }
  };

  // Função para carregar dados de uma conta e abrir o modal de edição
  const handleEdit = async (id) => {
    try {
      const data = await loadOneAccountsPayableMutation.mutateAsync(id);
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
      <AccountsPayableAddModal
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
      <AccountsPayableEditModal
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

        {/* DataGrid para exibir as contas a pagar */}
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
              backgroundColor: "#0F1729",
              color: "#111",
              fontWeight: "bold",
              borderColor: "#1E2B45",
            },
            "& .MuiDataGrid-topContainer": {
              borderColor: "#1E2B45",
              backgroundColor: "#0F1729",
            },
            "& .MuiDataGrid-cell": {
              borderColor: "#1E2B45",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#0F1729",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#162032",
            },
          }}
          columns={[
            // Coluna descrição
            { field: "description", headerName: "Descrição", flex: 1 },
            // Coluna valor, formata como moeda
            {
              field: "amount",
              headerName: "Valor",
              flex: 1,
              valueFormatter: (params) => {
                const amount = params;
                if (typeof amount !== "number") return amount;
                return new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amount);
              },
            },
            // Coluna data de vencimento, formata como dd/mm/yyyy
            {
              field: "dueDate",
              headerName: "Data de Vencimento",
              flex: 1,
              valueFormatter: (params) => {
                const dateStr = params;
                if (!dateStr) return "";
                const parts = dateStr.split("-");
                if (parts.length !== 3) return dateStr;
                const [year, month, day] = parts;
                return `${day}/${month}/${year}`;
              },
            },
            // Coluna categoria
            { field: "category", headerName: "Categoria", flex: 1 },
            // Coluna status, mostra "Pago" ou "Pendente" com cor
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              align: "center",
              renderCell: (params) => {
                const status = params.value;
                let label = "";
                let color = "";
                if (status === "paid") {
                  label = "Pago";
                  color = "#22c55e";
                } else {
                  label = "Pendente";
                  color = "#f59e42";
                }
                return (
                  <span
                    style={{
                      color: "#fff",
                      background: color,
                      padding: "4px 12px",
                      borderRadius: "15px",
                      fontWeight: "bold",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </span>
                );
              },
            },
            // Coluna recorrência (apenas mostra valor)
            { field: "reminder", headerName: "Recorrencia", flex: 1 },
            // Coluna ações (editar e deletar)
            {
              field: "actions",
              headerName: "Ações",
              width: 240,
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
                      onClick={() =>
                        deleteAccountsPayableMutation.mutate(row.id)
                      }
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          rows={loadAccountsPayableQuery.data || []}
          loading={loadAccountsPayableQuery.isLoading}
        />
      </div>
    </div>
  );
};
