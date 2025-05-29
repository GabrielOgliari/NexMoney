// GenericFormModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";

export function GenericFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  fields,
  validationSchema,
  title = "Formulário",
  submitLabel = "Salvar"
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent>
              <div className="flex flex-col gap-4">
                {fields.map((field) => (
                  <Field
                    key={field.name}
                    name={field.name}
                    as={TextField}
                    label={field.label}
                    type={field.type || "text"}
                    select={field.type === "select"}
                    fullWidth
                    error={!!errors[field.name] && touched[field.name]}
                    helperText={touched[field.name] && errors[field.name]}
                    {...(field.options ? { SelectProps: { native: true } } : {})}
                  >
                    {field.options &&
                      field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </Field>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {submitLabel}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}