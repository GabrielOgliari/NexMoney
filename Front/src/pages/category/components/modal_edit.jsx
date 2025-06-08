import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  TextField,
  MenuItem,
  FormLabel,
} from "@mui/material"; // Certifique-se de importar o Dialog aqui
import { Controller } from "react-hook-form"; // Importando Controller

export function CategoryEditModal({
  open,
  handleClose,
  onSubmit,
  initialValues,
  control, // Adicionando o 'control' aqui
}) {
  const roundedInput = {
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    "& .MuiInputBase-root": { borderRadius: "12px" },
    "& fieldset": { borderRadius: "12px" },
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex flex-col items-start">
        Editar Categoria
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="pb-4 flex flex-col items-start">
          Atualize os detalhes da categoria.
        </DialogContentText>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 mt-2 items-start"
        >
          {/* Campo Nome */}
          <div className="w-full flex flex-col gap-4 items-start">
            <FormLabel sx={{ mb: 1 }}>Nome</FormLabel>
            <Controller
              name="name"
              control={control} // Passando o 'control' aqui
              defaultValue={initialValues.name}
              render={({ field }) => (
                <TextField {...field} fullWidth sx={roundedInput} />
              )}
            />
          </div>

          {/* Campo Descrição */}
          <div className="w-full flex flex-col gap-4 items-start">
            <FormLabel sx={{ mb: 1 }}>Descrição</FormLabel>
            <Controller
              name="description"
              control={control} // Passando o 'control' aqui
              defaultValue={initialValues.description}
              render={({ field }) => (
                <TextField {...field} fullWidth sx={roundedInput} />
              )}
            />
          </div>

          {/* Campo Tipo */}
          <div className="w-full flex flex-col gap-4 items-start">
            <FormLabel sx={{ mb: 1 }}>Tipo</FormLabel>
            <Controller
              name="type"
              control={control} // Passando o 'control' aqui
              defaultValue={initialValues.type}
              render={({ field }) => (
                <TextField {...field} select fullWidth sx={roundedInput}>
                  <MenuItem value="expanse">Despesas</MenuItem>
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="investment">Investimentos</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* Botões de Ação */}
          <DialogActions className="flex justify-end mt-2 px-0 w-full">
            <Button onClick={handleClose} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
