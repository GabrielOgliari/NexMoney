import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { FormInputText } from "../../../components/ui/form-input-text";

export function AccountsPayableEditModal({
  open,
  handleCloseModal,
  control,
  handleSubmit,
  onSubmit,
  register,
  watch,
}) {
  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Editar Conta a Pagar</DialogTitle>
      <DialogContent>
        <DialogContentText className="pb-4">
          Atualize os detalhes da conta a pagar.
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
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
