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
  FormHelperText,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import httpCastMember from "../../util/http/http-cast-member";
import { useYupValidationResolver } from "../../hooks/YupValidation";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { CastMember } from "../../util/dto";

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
        name: yup.string().label("Nome").required().max(255),
        type: yup.number().label("Tipo").required(),
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
  } = useForm<CastMember>({
    resolver,
    defaultValues: {},
  });
  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const buttonProps: ButtonProps = {
    variant: "contained",
    size: "medium",
    className: classes.submit,
    color: "secondary",
    disabled: loading,
  };

  useEffect(() => {
    register({ name: "type" });
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getCastMember() {
      setLoading(true);
      try {
        const { data } = await httpCastMember.get<{ data: CastMember }>(id);
        setCastMember(data.data);
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
    getCastMember();
  }, [id, reset, snackbar]);

  async function onSubmit(formData: CastMember, event) {
    setLoading(true);
    try {
      const http = !castMember
        ? httpCastMember.create(formData)
        : httpCastMember.update(id, formData);

      const { data } = await http;
      snackbar.enqueueSnackbar("Membro de Elenco salvo com sucesso!", {
        variant: "success",
      });
      setTimeout(() => {
        if (!event) {
          return history.push("/cast-members");
        }
        if (id) {
          history.replace(`/cast-members/${data.data.id}/edit`);
        } else {
          history.push(`/cast-members/${data.data.id}/edit`);
        }
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Falha ao salvar Membro de Elenco", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
        disabled={loading}
        InputLabelProps={{ shrink: true }}
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
      />
      <FormControl
        margin="normal"
        disabled={loading}
        error={errors.type !== undefined}
      >
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          onChange={(e) => {
            setValue("type", parseInt(e.target.value));
          }}
          value={watch("type") + ""}
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
        {errors.type && (
          <FormHelperText id="type-helper-text">
            {errors.type.message}
          </FormHelperText>
        )}
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
