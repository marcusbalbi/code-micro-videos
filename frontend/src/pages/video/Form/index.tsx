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
import React, {
  createRef,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import CategoryField, { CategoryFieldComponent } from "./CategoryField";
import GenreField, { GenreFieldComponent } from "./GenreField";
import CastMemberField, { CastMemberFieldComponent } from "./CastMemberField";
import { omit, zipObject } from "lodash";
import { InputFileComponent } from "../../../components/InputFile";
import useSnackbarFromError from "../../../hooks/useSnackbarFromError";
import LoadingContext from "../../../components/loading/LoadingContext";
import SnackbarUpload from "../../../components/SnackbarUpload";
import { useDispatch } from "react-redux";
import { Creators } from "../../../store/uploads";
import { FileInfo } from "../../../store/uploads/types";

const useStyle = makeStyles((theme) => {
  return {
    cardOpened: {
      borderRadius: "4px",
      backgroundColor: "#f5f5f5",
    },
    cardContentOpened: {
      paddingBottom: theme.spacing(2, 0) + "px !important",
    },
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
        cast_members: yup.array().min(1, "Elenco é Obrigatório"),
        genres: yup
          .array()
          .min(1, "Gêneros é Obrigatório")
          .test({
            message:
              "Cada Gênero escolhido precisa ter pelo menos uma categoria selecionada",
            test: (value, ctx) => {
              if (!value) {
                return false;
              }
              return value.every(
                (v) =>
                  v.categories.filter((cat) => {
                    const categories = ctx.parent.categories;
                    return (
                      categories && categories.map((c) => c.id).includes(cat.id)
                    );
                  }).length !== 0
              );
            },
          }),
        categories: yup.array().min(1, "Categorias é Obrigatório"),
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
    formState,
  } = useForm<Video>({
    resolver,
    defaultValues: {
      rating: undefined,
      genres: [],
      categories: [],
      cast_members: [],
      opened: false,
    },
  });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const loading = useContext(LoadingContext);
  const [video, setVideo] = useState<Video | null>();
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up("md"));
  const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
  const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
  const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
  const uploadsRef = useRef(
    zipObject(
      fileFields,
      fileFields.map(() => createRef())
    )
  ) as MutableRefObject<{
    [key: string]: MutableRefObject<InputFileComponent>;
  }>;
  useSnackbarFromError(formState.submitCount, errors);

  const dispatch = useDispatch();

  useEffect(() => {
    const otherFields = [
      "rating",
      "opened",
      "genres",
      "categories",
      "cast_members",
    ].concat(fileFields);
    for (let name of otherFields) {
      register({ name });
    }
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getVideo() {
      try {
        const { data } = await httpVideo.get<{ data: Video }>(id);
        Object.keys(data.data).forEach((key) => {
          if (key.endsWith("_file")) {
            delete data.data[key];
          }
        });
        setVideo(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      }
    }
    getVideo();
  }, [id, reset, snackbar]);

  async function onSubmit(formData: Video, event) {
    const sendData = omit(formData, [
      "genres",
      "categories",
      "cast_members",
      ...fileFields,
    ]);
    sendData["cast_members_id"] =
      formData &&
      formData.cast_members &&
      formData.cast_members.map((castMember) => castMember.id);

    sendData["categories_id"] =
      formData &&
      formData.categories &&
      formData.categories.map((category) => category.id);

    sendData["genres_id"] =
      formData && formData.genres && formData.genres.map((genre) => genre.id);

    try {
      const http = !video
        ? httpVideo.create(sendData)
        : httpVideo.update(video.id, sendData);

      const { data } = await http;
      snackbar.enqueueSnackbar("Video salvo com sucesso!", {
        variant: "success",
      });
      uploadFiles(data.data);
      id && resetForm(video);
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
    }
  }
  function resetForm(data) {
    Object.keys(uploadsRef.current).forEach((field) => {
      uploadsRef.current[field].current.clear();
    });
    castMemberRef && castMemberRef.current && castMemberRef.current.clear();
    genreRef && genreRef.current && genreRef.current.clear();
    categoryRef && categoryRef.current && categoryRef.current.clear();
    reset(data);
  }
  function uploadFiles(video) {
    const files: FileInfo[] = fileFields
      .filter((fileField) => getValues()[fileField])
      .map((fileField) => {
        return {
          fileField,
          file: getValues()[fileField],
        };
      });
    if (!files.length) {
      return;
    }
    dispatch(Creators.addUpload({ video, files }));
    snackbar.enqueueSnackbar("", {
      persist: true,
      key: "snackbar-upload",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      content: (key, message) => {
        return <SnackbarUpload id={key} />;
      },
    });
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
          <CastMemberField
            error={errors.cast_members}
            disabled={loading}
            castMembers={watch("cast_members")}
            setCastMembers={(value) =>
              setValue("cast_members", value, { shouldValidate: true })
            }
          />
          <br />
          <Grid container spacing={2}>
            
            <Grid item xs={12} md={6}>
              <GenreField
                categories={watch("categories")}
                setCategories={(value) =>
                  setValue("categories", value, { shouldValidate: true })
                }
                genres={watch("genres")}
                error={errors.genres}
                disabled={loading}
                setGenres={(value) =>
                  setValue("genres", value, { shouldValidate: true })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CategoryField
                genres={watch("genres")}
                error={errors.categories}
                disabled={loading}
                categories={watch("categories")}
                setCategories={(value) =>
                  setValue("categories", value, { shouldValidate: true })
                }
              />
            </Grid>
          </Grid>
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
                ref={uploadsRef.current["thumb_file"]}
                accept="image/*"
                label="Thumb"
                setValue={(value) => setValue("thumb_file", value)}
              />
              <UploadField
                ref={uploadsRef.current["banner_file"]}
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
                ref={uploadsRef.current["trailer_file"]}
                accept="video/mp4"
                label="Trailer"
                setValue={(value) => setValue("trailer_file", value)}
              />
              <UploadField
                ref={uploadsRef.current["video_file"]}
                accept="video/mp4"
                label="Principal"
                setValue={(value) => setValue("video_file", value)}
              />
            </CardContent>
          </Card>
          <br />
          <Card className={classes.cardOpened}>
            <CardContent className={classes.cardContentOpened}>
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
            </CardContent>
          </Card>
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
