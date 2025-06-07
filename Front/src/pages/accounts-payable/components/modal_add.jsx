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

export function AccountsPayableAddModal({
  open,
  handleCloseModal,
  control,
  handleSubmit,
  onSubmit,
  watch,
  categories = [],
}) {
  const roundedInput = {
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    "& .MuiInputBase-root": { borderRadius: "12px" },
    "& fieldset": { borderRadius: "12px" },
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle className="flex flex-col items-start">
        Adicionar Nova Conta a Pagar
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="pb-4 flex flex-col items-start">
          Digite os detalhes da nova conta a pagar.
        </DialogContentText>
        <form
          className="flex flex-col gap-4 mt-2 items-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Descrição */}
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
                />
              )}
            />
          </div>

          {/* Valor e Data */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2 flex flex-col items-start">
              <FormLabel sx={{ mb: 1 }}>Valor</FormLabel>
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
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
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
                      format="DD/MM/YYYY" // Define o formato de data como "dd/mm/aaaa"
                      enableAccessibleFieldDOMStructure={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          placeholder: "dd/mm/aaaa", // Consistência no placeholder
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px", // Consistência no arredondamento
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "10px", // Consistência no arredondamento
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
              <FormLabel sx={{ mb: 1 }}>Categoria</FormLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth sx={roundedInput}>
                    <MenuItem value="">Selecione</MenuItem>
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
              <FormLabel sx={{ mb: 1 }}>Status</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>Frequência da Recorrência</FormLabel>
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
                    />
                  }
                  label="Ativar até data específica"
                />
              )}
            />
          </div>

          {/* Data Final da Recorrência */}
          {watch("recurrence.hasEndDate") && (
            <div className="w-1/2 flex flex-col items-start">
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
                      format="DD/MM/YYYY" // Define o formato de data como "dd/mm/aaaa"
                      enableAccessibleFieldDOMStructure={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          placeholder: "dd/mm/aaaa", // Mantém o placeholder consistente
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px", // Consistência no arredondamento
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "10px", // Consistência no arredondamento
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          )}

          {/* Lembrete */}
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
                    />
                  }
                  label="Definir lembrete para data de vencimento"
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
