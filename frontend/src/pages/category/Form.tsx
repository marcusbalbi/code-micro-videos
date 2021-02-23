import { Checkbox, TextField, FormControlLabel } from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useContext, useEffect, useMemo, useState } from "react";
import httpCategory from "../../util/http/http-category";
import * as yup from "yup";
import { useYupValidationResolver } from "../../hooks/YupValidation";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { Category } from "../../util/dto";
import SubmitActions from "../../components/SubmitActions";
import DefaultForm from "../../components/DefaultForm";
import LoadingContext from "../../components/loading/LoadingContext";

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
    trigger,
  } = useForm<Category>({
    resolver,
    defaultValues: {
      is_active: true,
    },
  });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const loading = useContext(LoadingContext);
  const [category, setCategory] = useState<Category | null>();

  useEffect(() => {
    register("is_active");
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getCategory() {
      try {
        const { data } = await httpCategory.get<{ data: Category }>(id);
        setCategory(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      }
    }
    getCategory();
  }, [id, reset, snackbar]);

  async function onSubmit(formData: Category, event) {
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
    }
  }
  return (
    <DefaultForm onSubmit={handleSubmit(onSubmit)}>
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
      <SubmitActions
        disableButtons={loading}
        handleSave={() => {
          return trigger().then((isValid) => {
            isValid && onSubmit(getValues(), null);
          });
        }}
      />
    </DefaultForm>
  );
};

export default Form;
