import {
  Box,
  Button,
  TextField,
  ButtonProps,
  makeStyles,
  Theme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import httpCastMember from "../../util/http/http-cast-member";

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
    variant: "contained",
    size: "medium",
    className: classes.submit,
    color: "secondary",
  };
  const { register, handleSubmit, getValues, setValue } = useForm();

  useEffect(() => {
    register({ name: "type" });
  }, [register]);

  function onSubmit(formData, event) {
    httpCastMember.create(formData).then(console.log);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputRef={register}
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
      />
      <FormControl margin="normal">
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          onChange={(e) => {
            setValue("type", parseInt(e.target.value));
          }}
        >
          <FormControlLabel
            control={<Radio color={"primary"} />}
            label="Diretor"
            value="1"
          />
          <FormControlLabel
            control={<Radio color={"primary"} />}
            label="Ator"
            value="2"
          />
        </RadioGroup>
      </FormControl>

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
