import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { useEffect, useRef } from "react";

export function GenericFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  fields,
  validationSchema,
  title = "Formulário",
  submitLabel = "Salvar",
  onChange,
}) {
  // Ref para armazenar o último valor enviado
  const lastValues = useRef(initialValues);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          // useEffect fora do retorno JSX!
          useEffect(() => {
            if (
              typeof onChange === "function" &&
              JSON.stringify(values) !== JSON.stringify(lastValues.current)
            ) {
              onChange(values);
              lastValues.current = values;
            }
          }, [values, onChange]);

          return (
            <Form onSubmit={handleSubmit}>
              <DialogContent>
                <div className="flex flex-col gap-4">
                  {fields.map((field) =>
                    field.type === "select" ? (
                      <Field name={field.name} key={field.name}>
                        {({ field: formikField }) => (
                          <TextField
                            {...formikField}
                            label={field.label}
                            select
                            fullWidth
                            error={!!errors[field.name] && touched[field.name]}
                            helperText={
                              touched[field.name] && errors[field.name]
                            }
                            value={values[field.name]}
                            onChange={(e) => {
                              setFieldValue(field.name, e.target.value);
                            }}
                          >
                            {field.options &&
                              field.options.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </MenuItem>
                              ))}
                          </TextField>
                        )}
                      </Field>
                    ) : (
                      <Field name={field.name} key={field.name}>
                        {({ field: formikField }) => (
                          <TextField
                            {...formikField}
                            label={field.label}
                            type={field.type || "text"}
                            fullWidth
                            error={!!errors[field.name] && touched[field.name]}
                            helperText={
                              touched[field.name] && errors[field.name]
                            }
                            value={values[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        )}
                      </Field>
                    )
                  )}
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
          );
        }}
      </Formik>
    </Dialog>
  );
}
