import {
  Box,
  Button,
  Checkbox,
  TextField,
  ButtonProps,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useMemo } from "react";
import httpCategory from "../../util/http/http-category";
import * as yup from "yup";
import { useYupValidationResolver } from "../../hooks/YupValidation";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const classes = useStyles();
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().label("Nome").required(),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const buttonProps: ButtonProps = {
    variant: "contained",
    size: "medium",
    className: classes.submit,
    color: "secondary",
  };
  const { register, handleSubmit, getValues, errors } = useForm<any>({
    resolver,
    defaultValues: {
      is_active: true,
    },
  });

  function onSubmit(formData, event) {
    httpCategory.create(formData).then(console.log);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputRef={register}
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
      />
      <TextField
        inputRef={register}
        name="description"
        label="Descrição"
        margin="normal"
        variant="outlined"
        fullWidth
        multiline
        rows={5}
      />
      <Checkbox
        color={"primary"}
        inputRef={register}
        name="is_active"
        defaultChecked={true}
      />
      Ativo?
      <Box dir={"rtl"}>
        <Button
          {...buttonProps}
          onClick={() => {
            onSubmit(getValues(), null);
          }}
        >
          Salvar
        </Button>
        <Button {...buttonProps} type="submit">
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};

export default Form;
