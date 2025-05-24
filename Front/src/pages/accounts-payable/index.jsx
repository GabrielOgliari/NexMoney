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
import { FormInputText } from "../../components/ui/form-input-text";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// Importa DatePicker e adapter para dayjs
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const AccountsPayablePage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries(["accounts-payable"]);
      setOpen(false);
      reset();
    },
  });

  const deleteAccountsPayableMutation = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/accounts-payable/${id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts-payable"]);
    },
  });

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

  const handleOpenModal = () => {
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
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    // Formatar datas para string ISO antes de enviar
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

  const handleEdit = async (id) => {
    try {
      const data = await loadOneAccountsPayableMutation.mutateAsync(id);
      setIsEditing(true);
      setOpen(true);
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
    <div className="flex flex-col gap-4 bg-background bg-[#1B2232]">
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? "Editar Conta a Pagar" : "Adicionar Nova Conta a Pagar"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText className="pb-4">
            {isEditing
              ? "Atualize os detalhes da conta a pagar."
              : "Digite os detalhes da nova conta a pagar."}
          </DialogContentText>

          <div className="flex flex-col gap-4">
            <FormInputText
              label="Descrição"
              name="description"
              control={control}
            />

            <div className="row flex gap-4">
              <FormInputText
                className="col-6 flex-1"
                label="Valor"
                name="amount"
                control={control}
                type="number"
                step="0.01"
                inputMode="decimal"
              />

              {/* DatePicker do MUI integrado ao react-hook-form */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Data de Vencimento"
                      inputFormat="DD/MM/YYYY"
                      onChange={(date) => field.onChange(date)}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            <div className="row flex gap-4">
              <FormInputText
                className="col-6 flex-1"
                label="Categoria"
                name="category"
                control={control}
              />
              <FormInputText
                className="col-6 flex-1"
                label="Status"
                name="status"
                control={control}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Frequência da Recorrência</label>
              <select
                {...register("recurrence.type")}
                defaultValue="monthly"
                className="border rounded px-2 py-1"
              >
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
                <option value="annual">Anual</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("recurrence.hasEndDate")}
                id="hasEndDate"
                className="form-checkbox"
              />
              <label htmlFor="hasEndDate">Ativar até data específica</label>
            </div>

            {watch("recurrence.hasEndDate") && (
              <Controller
                name="recurrence.endDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Data Final da Recorrência"
                      inputFormat="DD/MM/YYYY"
                      onChange={(date) => field.onChange(date)}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("reminder")}
                id="reminder"
                className="form-checkbox"
              />
              <label htmlFor="reminder">
                Definir lembrete para data de vencimento
              </label>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-end w-full">
          <Button variant="contained" onClick={handleOpenModal}>
            Adicionar Novo
          </Button>
        </div>

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
            { field: "description", headerName: "Descrição", flex: 1 },
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
            { field: "category", headerName: "Categoria", flex: 1 },
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
            { field: "reminder", headerName: "Recorrencia", flex: 1 },
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
