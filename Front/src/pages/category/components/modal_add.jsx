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
} from "@mui/material";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export function CategoryAddModal({ open, handleClose, onSubmit, control }) {
  const roundedInput = {
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    "& .MuiInputBase-root": { borderRadius: "12px" },
    "& fieldset": { borderRadius: "12px" },
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex flex-col items-start">
        Adicionar Nova Categoria
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="pb-4 flex flex-col items-start">
          Digite os detalhes da nova categoria.
        </DialogContentText>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 mt-2 items-start"
        >
          {/* Campo Nome */}
          <div className="w-full flex flex-col items-start">
            <FormLabel sx={{ mb: 1 }}>Nome</FormLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Digite o nome da categoria"
                  fullWidth
                  sx={roundedInput}
                  inputProps={{ maxLength: 50 }}
                />
              )}
            />
          </div>

          {/* Campo Descrição */}
          <div className="w-full flex flex-col items-start">
            <FormLabel sx={{ mb: 1 }}>Descrição</FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Digite a descrição"
                  fullWidth
                  autoFocus
                  sx={roundedInput}
                  inputProps={{ maxLength: 100 }}
                />
              )}
            />
          </div>

          {/* Flexbox para os campos de Valor Planejado e Tipo */}
          <div className="flex gap-4 w-full">
            {/* Campo Tipo */}
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1 }}>Tipo</FormLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth sx={roundedInput}>
                    <MenuItem value="expanse">Despesas</MenuItem>
                    <MenuItem value="income">Receita</MenuItem>
                    <MenuItem value="investment">Investimentos</MenuItem>
                  </TextField>
                )}
              />
            </div>

            {/* Campo Valor Planejado */}
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1 }}>Valor Planejado</FormLabel>
              <Controller
                name="planned"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    placeholder="0,00"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    fullWidth
                    sx={roundedInput}
                    onValueChange={(values) =>
                      field.onChange(values.floatValue ?? 0)
                    }
                    value={field.value || ""}
                  />
                )}
              />
            </div>
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
