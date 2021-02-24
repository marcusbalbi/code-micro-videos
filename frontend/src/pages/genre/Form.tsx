import { MenuItem, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useContext, useEffect, useMemo, useState } from "react";
import httpCategory from "../../util/http/http-category";
import httpGenre from "../../util/http/http-genre";
import * as yup from "yup";
import { useYupValidationResolver } from "../../hooks/YupValidation";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router";
import { Genre } from "../../util/dto";
import SubmitActions from "../../components/SubmitActions";
import DefaultForm from "../../components/DefaultForm";
import LoadingContext from "../../components/loading/LoadingContext";

export const Form = () => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().label("Nome").required().max(255),
        categories_id: yup.array().label("Categorias").required(),
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
  } = useForm<any>({
    resolver,
    defaultValues: {
      categories_id: [],
    },
  });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const loading = useContext(LoadingContext);
  const [genre, setGenre] = useState<Genre | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    register({ name: "categories_id" });
  }, [register]);

  useEffect(() => {
    let canLoad = true;
    (async () => {
      if (!canLoad) {
        return;
      }
      const promises = [httpCategory.list({ queryParams: { all: "" } })];
      if (id) {
        promises.push(httpGenre.get(id, { with: "categories" }));
      }
      try {
        const [categoryResponse, genreResponse] = await Promise.all(promises);
        setCategories(categoryResponse.data.data);
        if (id) {
          setGenre(genreResponse.data.data);
          const categories_id = genreResponse.data.data.categories.map(
            (category) => category.id
          );
          reset({
            ...genreResponse.data.data,
            categories_id,
          });
        }
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      }
    })();
    return () => {
      canLoad = false;
    };
  }, [id, reset, snackbar]);

  async function onSubmit(formData, event) {
    try {
      const http = !genre
        ? httpGenre.create(formData)
        : httpGenre.update(id, formData);

      const { data } = await http;
      snackbar.enqueueSnackbar("Gênero salvo com sucesso!", {
        variant: "success",
      });
      setTimeout(() => {
        if (!event) {
          return history.push("/genres");
        }
        if (id) {
          history.replace(`/genres/${data.data.id}/edit`);
        } else {
          history.push(`/genres/${data.data.id}/edit`);
        }
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Falha ao salvar Gênero", {
        variant: "error",
      });
    }
  }
  return (
    <DefaultForm onSubmit={handleSubmit(onSubmit, console.log)}>
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
        disabled={loading}
        InputLabelProps={{ shrink: true }}
        error={errors.categories_id !== undefined}
        helperText={errors.categories_id && errors.categories_id.message}
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
