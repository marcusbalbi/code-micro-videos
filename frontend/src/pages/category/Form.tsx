import {
  Box,
  Button,
  Checkbox,
  TextField,
  ButtonProps,
  makeStyles,
  Theme,
  FormControlLabel,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo, useState } from "react";
import httpCategory from "../../util/http/http-category";
import * as yup from "yup";
import { useYupValidationResolver } from "../../hooks/YupValidation";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { Category } from "../../util/dto";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().label("Nome").required(),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    reset,
    watch,
    setValue,
  } = useForm<Category>({
    resolver,
    defaultValues: {
      is_active: true,
    },
  });
  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>();
  const buttonProps: ButtonProps = {
    variant: "contained",
    size: "medium",
    className: classes.submit,
    color: "secondary",
    disabled: loading,
  };

  useEffect(() => {
    register("is_active");
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getCategory() {
      setLoading(true);
      try {
        const { data } = await httpCategory.get<{ data: Category }>(id);
        setCategory(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    getCategory();
  }, [id, reset, snackbar]);

  async function onSubmit(formData: Category, event) {
    setLoading(true);
    try {
      const http = !category
        ? httpCategory.create(formData)
        : httpCategory.update(id, formData);

      const { data } = await http;
      snackbar.enqueueSnackbar("Categoria salva com sucesso!", {
        variant: "success",
      });
      setTimeout(() => {
        if (!event) {
          return history.push("/categories");
        }
        if (id) {
          history.replace(`/categories/${data.data.id}/edit`);
        } else {
          history.push(`/categories/${data.data.id}/edit`);
        }
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Falha ao salvar Categoria", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputRef={register}
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        disabled={loading}
        InputLabelProps={{ shrink: true }}
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
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />
      <FormControlLabel
        disabled={loading}
        label={"Ativo?"}
        labelPlacement="end"
        control={
          <Checkbox
            color={"primary"}
            name="is_active"
            onChange={() => setValue("is_active", !getValues().is_active)}
            checked={watch("is_active")}
          />
        }
      />
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
