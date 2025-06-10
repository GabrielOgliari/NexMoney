import React, { useState, useEffect } from "react";
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

export function CategoryEditModal({
  open,
  handleClose,
  onSubmit,
  initialValues,
  control,
}) {
  const [selectedType, setSelectedType] = useState(initialValues.type || "");

  useEffect(() => {
    setSelectedType(initialValues.type || "");
  }, [initialValues.type, open]);

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
          <div className="w-full flex flex-col items-start">
            <FormLabel sx={{ mb: 1 }}>Nome</FormLabel>
            <Controller
              name="name"
              control={control}
              defaultValue={initialValues.name}
              render={({ field }) => (
                <TextField
                  {...field}
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
              defaultValue={initialValues.description}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
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
                defaultValue={initialValues.type}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    sx={roundedInput}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedType(e.target.value);
                    }}
                  >
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
                defaultValue={initialValues.planned}
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

          {/* Campo Tipo de Investimento (aparece só se for investimento) */}
          {selectedType === "investment" && (
            <div className="w-full flex flex-col items-start">
              <FormLabel sx={{ mb: 1 }}>Tipo de Investimento</FormLabel>
              <Controller
                name="investmentType"
                control={control}
                defaultValue={initialValues.investmentType}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    sx={roundedInput}
                    placeholder="Selecione o tipo de investimento"
                  >
                    <MenuItem value="fixed_income">Renda Fixa</MenuItem>
                    <MenuItem value="variable_income">Renda Variável</MenuItem>
                    <MenuItem value="cripto">Cripto</MenuItem>
                  </TextField>
                )}
              />
            </div>
          )}

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
