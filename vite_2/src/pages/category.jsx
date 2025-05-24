import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../components/ui/form-input-text";
import { FormInputRadio } from "../components/ui/form-input-radio";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export const CategoryPage = () => {
  const [open, setOpen] = useState(false);

  const loadCategoriesQuery = useQuery({
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
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/categories/${id}`,
      });
    },
  });

  const { handleSubmit, control } = useForm({
    values: loadOneCategoryMutation.data,
  });

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => setOpen(false);

  const onSubmit = (data) => {
    if (!data.id) {
      saveCategoryMutation.mutate({
        data,
        method: "post",
        url: "/categories",
      });

      return;
    }

    saveCategoryMutation.mutate({
      data,
      method: "put",
      url: `/categories/${data.id}`,
    });
  };

  const handleEdit = async (id) => {
    await loadOneCategoryMutation.mutateAsync(id);
    handleOpenModal();
  };

  return (
    <div className="flex flex-col gap-4 bg-background bg-[#1B2232]">
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Adicionar Nova Categoria</DialogTitle>
        <DialogContent>
          <DialogContentText className="pb-4">
            Preencha os campos abaixo para adiconar uma nova categoria.
          </DialogContentText>

          <div className="flex flex-col gap-4">
            <FormInputText label="Nome" name="name" control={control} />

            <FormInputText
              label="Descrição"
              name="description"
              control={control}
            />

            <FormInputRadio
              label="Tipo"
              name="type"
              control={control}
              options={[
                {
                  label: "Despesas",
                  value: "expanse",
                },
                {
                  label: "Receita",
                  value: "income",
                },
              ]}
            />
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
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-end w-full">
          <Button variant="contained" onClick={handleOpenModal}>
            Nova Categoria
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
              borderColor: "#1E2B45", // <-- borda do header personalizada
              backgroundColor: "#0F1729", // <-- fundo do header (opcional)
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
            { field: "name", headerName: "Nome", flex: 1 },
            { field: "description", headerName: "Descrição", flex: 1 },
            { field: "type", headerName: "Tipo", width: 100 },
            { field: "count", headerName: "Uso", width: 100 },
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
                      <EditOutlinedIcon></EditOutlinedIcon>
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => deleteCategoryMutation.mutate(row.id)}
                    >
                      <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                    </Button>
                  </div>
                );
              },
            },
          ]}
          rows={loadCategoriesQuery.data}
          loading={loadCategoriesQuery.isPending}
        />
      </div>
    </div>
  );
};
