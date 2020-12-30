import {
  Box,
  Button,
  MenuItem,
  TextField,
  ButtonProps,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import httpCategory from "../../util/http/http-category";
import httpGenre from "../../util/http/http-genre";

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
  const [categories, setCategories] = useState<any[]>([]);
  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: {
      categories_id: [],
    },
  });
  useEffect(() => {
    register({ name: "categories_id" });
  }, [register]);

  useEffect(() => {
    httpCategory.list().then((response) => {
      setCategories(response.data.data);
    });
  }, []);

  function onSubmit(formData, event) {
    httpGenre.create(formData).then(console.log);
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
      <TextField
        select
        name="categories_id"
        value={watch("categories_id")}
        label="Categorias"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          setValue("categories_id", e.target.value);
        }}
        SelectProps={{
          multiple: true,
        }}
      >
        <MenuItem value="" disabled>
          <em>Selecione categorias</em>
        </MenuItem>
        {categories.map((category, key) => {
          return (
            <MenuItem key={key} value={category.id}>
              {category.name}
            </MenuItem>
          );
        })}
      </TextField>
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
