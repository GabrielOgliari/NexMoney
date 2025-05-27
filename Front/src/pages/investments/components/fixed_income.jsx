import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { useState } from "react";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { ptBR } from "@mui/x-data-grid/locales";

import { FixedIncomeAddModal } from "./modal_add_fixedIncome";
import { FixedIncomeEditModal } from "./modal_edit_fixedIncome";

// const columns = [
//   { field: "id", headerName: "ID", flex: 0.5 },
//   {
//     field: "name",
//     headerName: "nome",
//     flex: 2,
//     editable: true,
//   },
//   {
//     field: "value",
//     headerName: "valor",
//     type: "string", // pois vem como "R$ 5.000"
//     flex: 1,
//     editable: true,
//   },
//   {
//     field: "interest_rate",
//     headerName: "taxa de juros",
//     type: "string", // pois vem como "5.2%"
//     flex: 1,
//     editable: true,
//   },
//   {
//     field: "start_date",
//     headerName: "data inicial",
//     type: "string",
//     flex: 1,
//     editable: true,
//   },
//   {
//     field: "due_date",
//     headerName: "data de Vencimento",
//     type: "string",
//     flex: 1,
//     editable: true,
//   },
//   {
//     field: "actions",
//     headerName: "Ações",
//     flex: 1,
//     disableReorder: true,
//     filterable: false,
//     disableColumnMenu: true,
//     sortable: false,
//     headerAlign: "center",
//     renderCell: () => {
//       return (
//         <div className="flex gap-3 justify-center items-center h-full">
//           <Button
//             color="info"
//             variant="outlined"
//             // onClick={() => handleEdit(row.id)}
//           >
//             <EditOutlinedIcon></EditOutlinedIcon>
//           </Button>
//           <Button
//             color="error"
//             variant="outlined"
//             // onClick={() => deleteCategoryMutation.mutate(row.id)}
//           >
//             <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
//           </Button>
//         </div>
//       );
//     },
//   },
// ];

export function FixedIncome() {
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  // Estados para controlar abertura dos modais de adição e edição
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // const { data: investmentsData, isLoading } = useQuery({
  //   queryKey: ["investiments-fixed-income"],
  //   queryFn: async () => {
  //     const response = await axios({
  //       method: "get",
  //       baseURL: import.meta.env.VITE_API,
  //       url: "/investiments",
  //     });
  //     const investmentsArray = response.data.investiments ?? [];

  //     const filtered = investmentsArray.filter(
  //       (investment) => investment.type === "fixed_income"
  //     );

  //     return filtered;
  //   },
  // });

  // const filteredRows = React.useMemo(() => {
  //   if (!investmentsData) return [];
  //   if (filterModel.items.length === 0) return investmentsData;

  //   return investmentsData.filter((row) => {
  //     return filterModel.items.every((filter) => {
  //       if (!filter.value) return true;
  //       const fieldValue = row[filter.field]?.toString().toLowerCase();
  //       return fieldValue?.includes(filter.value.toLowerCase());
  //     });
  //   });
  // }, [investmentsData, filterModel]);

  // const total = filteredRows.reduce((sum, row) => {
  //   const valor = Number(
  //     String(row.value)
  //       .replace(/\./g, "") // remove separador de milhar
  //       .replace(",", ".") // vírgula por ponto
  //       .replace(/[^\d.-]/g, "") // remove não numéricos
  //   );
  //   return sum + (isNaN(valor) ? 0 : valor);
  // }, 0);

  // Consulta para buscar todos os lançamentos em Renda Fixa (fixed income)
  const { data: loadFixedIncomeQuery, isLoading: isLoadingFixedIncome } =
    useQuery({
      queryKey: ["fixed_income"],
      queryFn: async () => {
        const response = await axios({
          method: "get",
          baseURL: import.meta.env.VITE_API,
          // url: "/investiments/fixed_income",
          url: "/investiments_fixed_income",
        });
        return response.data;
      },
    });

  // Mutation para buscar uma conta específica para edição na tela de edição vai redenrizar os dados
  const {
    data: loadOneFixedIncomeMutation,
    isLoading: isLoadingOneFixedIncome,
  } = useMutation({
    mutationFn: async (id) => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: `/investiments_fixed_income/${id}`,
      });
      return response.data;
    },
  });

  // Mutation para salvar (criar ou editar) uma conta a pagar
  const { data: saveFixedIncomeMutation, isLoading: isLoadingsaveFixedIncome } =
    useMutation({
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
        // queryClient.invalidateQueries(["accounts-payable"]);
        setOpenAdd(false);
        setOpenEdit(false);
        reset();
      },
    });
  // Mutation para deletar uma conta a pagar
  const {
    data: deleteFixedIncomeMutation,
    isLoading: isLoadingFixedIncomeMutation,
  } = useMutation({
    mutationFn: async (id) => {
      await axios({
        method: "delete",
        baseURL: import.meta.env.VITE_API,
        url: `/investiments_fixed_income/${id}`,
      });
    },
  });

  // React Hook Form para controle dos campos do formulário
  const { handleSubmit, control, reset, register, watch } = useForm({
    defaultValues: {
      typInvestiment: "",
      name: "",
      value: "",
      interest_rate: "",
      start_date: "",
      due_date: "",
    },
  });

  // Efeito para preencher o formulário ao editar uma conta
  useEffect(() => {
    if (isEditing && loadOneFixedIncomeMutation) {
      const data = loadOneFixedIncomeMutation;
      reset({
        description: data.typInvestiment || "",
        name: data.name || "",
        value: data.value || "",
        interest_rate: data.interest_rate || "",
        start_date: data.start_date ? dayjs(data.start_date) : null,
        dueDate: data.due_date ? dayjs(data.due_date) : null,
      });
    }
  }, [isEditing, loadOneFixedIncomeMutation, reset]);

  // Função para abrir o modal de adição
  const handleOpenAddModal = () => {
    reset({
      typInvestiment: "",
      name: "",
      value: "",
      interest_rate: "",
      start_date: null,
      due_date: null,
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
      start_date: data.start_date ? data.start_date.format("YYYY-MM-DD") : null,
      dueDate: data.due_date ? data.due_date.format("YYYY-MM-DD") : null,
    };

    // Se estiver editando, faz PUT, senão faz POST
    if (isEditing) {
      const id = loadOneFixedIncomeMutation?.id;
      if (!id) return;
      saveFixedIncomeMutation.mutate({
        data: { ...formattedData, id },
        method: "put",
        url: `/investiments_fixed_incomee/${id}`,
      });
    } else {
      saveFixedIncomeMutation.mutate({
        data: formattedData,
        method: "post",
        url: "/investiments_fixed_income",
      });
    }
  };

  // Função para carregar dados de uma conta e abrir o modal de edição
  const handleEdit = async (id) => {
    try {
      const data = await loadOneFixedIncomeMutation.mutateAsync(id);
      setIsEditing(true);
      setOpenEdit(true);
      reset({
        description: data.typInvestiment || "",
        name: data.name || "",
        value: data.value || "",
        interest_rate: data.interest_rate || "",
        start_date: data.start_date ? dayjs(data.start_date) : null,
        dueDate: data.due_date ? dayjs(data.due_date) : null,
      });
    } catch (error) {
      console.error("Erro ao carregar conta para edição:", error);
    }
  };

  return (
    <div className="flex flex-col height-screen h-full w-full overflow-hidden">
      {/* Modal de adição */}
      <FixedIncomeAddModal
        open={openAdd}
        handleCloseModal={handleCloseModal}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        watch={watch}
      />
      {/* Modal de edição */}
      <FixedIncomeEditModal
        open={openEdit}
        handleCloseModal={handleCloseModal}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        watch={watch}
      />

      <div className="flex justify-end  mr-4 ">
        <Button variant="contained" onClick={handleOpenAddModal}>
          Novo Lançamento
        </Button>
      </div>
      <Box sx={{ height: 300, width: "100%", padding: 2 }}>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={loadFixedIncomeQuery ?? []}
          columns={[
            { field: "id", headerName: "ID", flex: 0.5 },
            {
              field: "name",
              headerName: "nome",
              flex: 2,
            },
            {
              field: "value",
              headerName: "valor",
              type: "string", // pois vem como "R$ 5.000"
              flex: 1,
              valueFormatter: (params) => {
                const value = params;
                if (typeof value !== "number") return value;
                return new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value);
              },
            },
            {
              field: "interest_rate",
              headerName: "taxa de juros",
              type: "string", // pois vem como "5.2%"
              flex: 1,
              valueFormatter: (params) => {
                // Aceita valores como "5.2" ou "5.2%"
                let interest_rate = params.interest_rate;
                if (typeof value === "number") {
                  return `${interest_rate.toFixed(2)}%`;
                }
                if (typeof value === "string") {
                  // Remove qualquer símbolo de % e converte para número
                  const num = Number(interest_rate.replace("%", "").replace(",", "."));
                  if (isNaN(num)) return interest_rate;
                  return `${num.toFixed(2)}%`;
                }
                return interest_rate;
              },
            },
            {
              field: "start_date",
              headerName: "data inicial",
              type: "string",
              flex: 1,
              valueFormatter: (params) => {
                const start_date = params.start_date;
                if (!start_date) return "";
                const parts = start_date.split("-");
                if (parts.length !== 3) return start_date;
                const [year, month, day] = parts;
                return `${day}/${month}/${year}`;
              },
            },
            {
              field: "due_date",
              headerName: "data de Vencimento",
              type: "string",
              flex: 1,
              valueFormatter: (params) => {
                const due_date = params.due_date;
                if (!due_date) return "";
                const parts = due_date.split("-");
                if (parts.length !== 3) return due_date;
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
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditOutlinedIcon></EditOutlinedIcon>
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => deleteFixedIncomeMutation.mutate(row.id)}
                    >
                      <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
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
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
        />
      </Box>
      <div className="mt-4 text-right">
        Total filtrado: R${" "}
        {(Array.isArray(loadFixedIncomeQuery)
          ? loadFixedIncomeQuery.reduce((sum, row) => {
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
      </div>
    </div>
  );
}
