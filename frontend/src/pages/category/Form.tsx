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
import React from "react";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const classes = useStyles();
  const buttonProps: ButtonProps = {
    variant: "outlined",
    size: "medium",
    className: classes.submit,
  };
  const { register, getValues } = useForm();
  return (
    <form>
      <TextField
        inputRef={register}
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
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
      <Checkbox inputRef={register} name="is_active" />
      Ativo?
      <Box dir={"rtl"}>
        <Button
          {...buttonProps}
          onClick={() => {
            console.log(getValues());
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
