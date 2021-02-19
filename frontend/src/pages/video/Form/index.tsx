import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo, useState } from "react";
import httpVideo from "../../../util/http/http-video";
import * as yup from "yup";
import { useYupValidationResolver } from "../../../hooks/YupValidation";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { Video, VideoFileFieldsMap } from "../../../util/dto";
import SubmitActions from "../../../components/SubmitActions";
import DefaultForm from "../../../components/DefaultForm";
import { RatingField } from "./RatingField";
import { UploadField } from "./UploadField";
import CategoryField from "./CategoryField";
import GenreField from "./GenreField";

const useStyle = makeStyles((theme) => {
  return {
    cardUpload: {
      borderRadius: "4px",
      backgroundColor: "#F5F5F5",
      margin: theme.spacing(2, 0),
    },
  };
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {
  const classes = useStyle();
  const validationSchema = useMemo(
    () =>
      yup.object({
        title: yup.string().label("Título").required().max(255),
        description: yup.string().label("Sinopse").required(),
        year_launched: yup
          .number()
          .label("Ano de Lançamento")
          .required()
          .min(1),
        duration: yup.number().label("Duração").required().min(1),
        rating: yup.string().label("Classificação").required(),
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
  } = useForm<Video>({
    resolver,
    defaultValues: {
      genres: [],
    },
  });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<Video | null>();
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    const otherFields = ["rating", "opened"].concat(fileFields);
    for (let name of otherFields) {
      register({ name });
    }
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getVideo() {
      setLoading(true);
      try {
        const { data } = await httpVideo.get<{ data: Video }>(id);
        setVideo(data.data);
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
    getVideo();
  }, [id, reset, snackbar]);

  async function onSubmit(formData: Video, event) {
    setLoading(true);
    try {
      const http = !video
        ? httpVideo.create(formData)
        : httpVideo.update(id, formData);

      const { data } = await http;
      snackbar.enqueueSnackbar("Video salvo com sucesso!", {
        variant: "success",
      });
      setTimeout(() => {
        if (!event) {
          return history.push("/videos");
        }
        if (id) {
          history.replace(`/videos/${data.data.id}/edit`);
        } else {
          history.push(`/videos/${data.data.id}/edit`);
        }
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Falha ao salvar Video", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <DefaultForm GridItemProps={{ xs: 12 }} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            name="title"
            label="Título"
            variant="outlined"
            fullWidth
            inputRef={register}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            error={errors.title !== undefined}
            helperText={errors.title && errors.title.message}
          />
          <TextField
            name="description"
            label="Sinopse"
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            fullWidth
            inputRef={register}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            error={errors.description !== undefined}
            helperText={errors.description && errors.description.message}
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="year_launched"
                label="Ano de Lançamento"
                type="number"
                margin="normal"
                variant="outlined"
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={errors.year_launched !== undefined}
                helperText={
                  errors.year_launched && errors.year_launched.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="duration"
                label="Duração"
                type="number"
                margin="normal"
                variant="outlined"
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={errors.duration !== undefined}
                helperText={errors.duration && errors.duration.message}
              />
            </Grid>
          </Grid>
          Elenco
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CategoryField />
            </Grid>
            <Grid item xs={12} md={6}>
              <GenreField
                genres={watch("genres")}
                setGenres={(value) => setValue("genres", value, { shouldValidate: true })}
              />
            </Grid>
          </Grid>
          <br />
          Categorias
        </Grid>
        <Grid item xs={12} md={6}>
          <RatingField
            value={watch("rating")}
            setValue={(value) =>
              setValue("rating", value, { shouldValidate: true })
            }
            error={errors.rating}
            disabled={loading}
            formControlProps={{
              margin: isGreaterMd ? "none" : "normal",
            }}
          />
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant={"h6"}>
                Imagens
              </Typography>
              <UploadField
                accept="image/*"
                label="Thumb"
                setValue={(value) => setValue("thumb_file", value)}
              />
              <UploadField
                accept="image/*"
                label="Banner"
                setValue={(value) => setValue("banner_file", value)}
              />
            </CardContent>
          </Card>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant={"h6"}>
                Videos
              </Typography>
              <UploadField
                accept="video/mp4"
                label="Trailer"
                setValue={(value) => setValue("trailer_file", value)}
              />
              <UploadField
                accept="video/mp4"
                label="Principal"
                setValue={(value) => setValue("video_file", value)}
              />
            </CardContent>
          </Card>
          <br />
          <FormControlLabel
            control={
              <Checkbox
                name="opened"
                color={"primary"}
                onChange={() => setValue("opened", !getValues()["opened"])}
                checked={watch("opened")}
                disabled={loading}
              />
            }
            label={
              <Typography color="primary" variant="subtitle2">
                Quero que este conteúdo apareça na seção lançamentos
              </Typography>
            }
            labelPlacement="end"
          />
        </Grid>
      </Grid>
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
