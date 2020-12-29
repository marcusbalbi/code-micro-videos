import {
  Box,
  Button,
  Checkbox,
  TextField,
  ButtonProps,
  makeStyles,
  Theme,
} from "@material-ui/core";
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
  return (
    <form>
      <TextField name="name" label="Nome" fullWidth variant="outlined" />
      <TextField
        name="description"
        label="Descrição"
        margin="normal"
        variant="outlined"
        fullWidth
        multiline
        rows={5}
      />
      <Checkbox name="is_active" />
      Ativo?
      <Box dir={"rtl"}>
        <Button {...buttonProps}>Salvar</Button>
        <Button {...buttonProps} type="submit">
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};

export default Form;
