import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  FormLabel,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export function AccountsPayableEditModal({
  open,
  handleCloseModal,
  control,
  handleSubmit,
  onSubmit,
  watch,
  categories = [], //Recebe a lista de categorias do DB JSON
}) {
  const roundedInput = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
    "& .MuiInputBase-root": {
      borderRadius: "12px",
    },
    "& fieldset": {
      borderRadius: "12px",
    },
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle className="flex flex-col items-start">
        Editar Conta a Pagar
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="pb-4 flex flex-col items-start">
          Atualize os detalhes da conta a pagar.
        </DialogContentText>
        <form
          className="flex flex-col gap-4 mt-2 items-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Descrição */}
          <div className="w-full flex flex-col items-start">
            <FormLabel sx={{ mb: 1, color: "text.primary" }}>
              Descrição
            </FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Digite a descrição"
                  fullWidth
                  sx={roundedInput}
                />
              )}
            />
          </div>

          {/* Valor e Data */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1, color: "text.primary" }}>Valor</FormLabel>
              <Controller
                name="amount"
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    // Envia o valor numérico puro para o backend
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? 0);
                    }}
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1, color: "text.primary" }}>
                Data de Vencimento
              </FormLabel>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      value={field.value}
                      enableAccessibleFieldDOMStructure={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          placeholder: "dd/mm/aaaa",
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "10px",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>

          {/* Categoria e Status */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1, color: "text.primary" }}>
                Categoria
              </FormLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth sx={roundedInput}>
                    <MenuItem value="">Selecione</MenuItem>
                    {/* Mapear as categorias recebidas dinamicamente */}
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1, color: "text.primary" }}>
                Status
              </FormLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth sx={roundedInput}>
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="pending">Pendente</MenuItem>
                    <MenuItem value="paid">Pago</MenuItem>
                  </TextField>
                )}
              />
            </div>
          </div>

          <Divider sx={{ my: 1 }} />

          {/* Frequência da Recorrência */}
          <div className="w-full flex flex-col items-start">
            <FormLabel sx={{ mb: 1, color: "text.primary" }}>
              Frequência da Recorrência
            </FormLabel>
            <Controller
              name="recurrence.type"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth sx={roundedInput}>
                  <MenuItem value="daily">Diária</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="biweekly">Quinzenal</MenuItem>
                  <MenuItem value="monthly">Mensal</MenuItem>
                  <MenuItem value="annual">Anual</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* Checkbox: Ativar até data específica */}
          <div className="w-full flex flex-col items-start">
            <Controller
              name="recurrence.hasEndDate"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Ativar até data específica"
                  sx={{ ml: 0 }}
                />
              )}
            />
          </div>

          {/* Data Final da Recorrência */}
          {watch("recurrence.hasEndDate") && (
            <div className="w-full flex flex-col items-start">
              <FormLabel sx={{ mb: 1, color: "text.primary" }}>
                Data Final da Recorrência
              </FormLabel>
              <Controller
                name="recurrence.endDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="dd/mm/aaaa"
                          sx={roundedInput}
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          )}

          {/* Checkbox: Lembrete */}
          <div className="w-full flex flex-col items-start">
            <Controller
              name="reminder"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Definir lembrete para data de vencimento"
                  sx={{ ml: 0 }}
                />
              )}
            />
          </div>

          {/* Botões */}
          <DialogActions className="flex justify-end mt-2 px-0 w-full">
            <Button onClick={handleCloseModal} color="inherit">
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
