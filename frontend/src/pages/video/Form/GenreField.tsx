import {
  FormControl,
  FormControlProps,
  FormHelperText,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, {
  MutableRefObject,
  RefAttributes,
  useImperativeHandle,
  useRef,
} from "react";
import AsyncAutocomplete, {
  AsyncAutoCompleteComponent,
} from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useCollectionManager from "../../../hooks/useCollectionManager";
import useHttpHandler from "../../../hooks/useHttpHandler";
import httpGenre from "../../../util/http/http-genre";
import { getGenresFromCategory } from "../../../util/model-filter";

interface GenreFieldProps extends RefAttributes<GenreFieldProps> {
  genres: any[] | undefined;
  setGenres: (genres) => void;
  categories: any[] | undefined;
  setCategories: (categories) => void;
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

export interface GenreFieldComponent {
  clear: () => void;
}

const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>(
  (props, ref) => {
    const {
      genres,
      setGenres,
      error,
      disabled,
      categories,
      setCategories,
    } = props;
    const theme = useTheme();
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;
    const { addItem, removeItem } = useCollectionManager(
      genres || [],
      setGenres
    );
    const { removeItem: removeCategory } = useCollectionManager(
      categories || [],
      setCategories
    );
    const autoCompleteHttp = useHttpHandler();
    const fetchOptions = (searchText) =>
      autoCompleteHttp(
        httpGenre.list({
          queryParams: {
            search: searchText,
            withCategories: true,
            all: "",
          },
        })
      )
        .then((data) => {
          return data.data;
        })
        .catch((error) => console.log(error));

    useImperativeHandle(ref, () => {
      return {
        clear: () => {
          autocompleteRef.current.clear();
        },
      };
    });
    return (
      <>
        <AsyncAutocomplete
          fetchOptions={fetchOptions}
          AutoCompleteProps={{
            ref: autocompleteRef,
            // autoSelect: true,
            clearOnEscape: true,
            freeSolo: true,
            disabled,
            getOptionLabel: (item) => {
              return item && item.name ? item.name : "";
            },
            getOptionSelected: (item) => item.id,

            onChange: (event, value) => {
              addItem(value);
            },
          }}
          TextFieldProps={{ label: "Gêneros", error: error !== undefined }}
        />
        <FormControl
          margin="normal"
          fullWidth
          disabled={disabled === true}
          error={error !== undefined}
          {...props.formControlProps}
        >
          <FormHelperText style={{ height: theme.spacing(5) }}>
            Escolha os Gêneros do Video
          </FormHelperText>
          <GridSelected>
            {genres &&
              genres.map((genre, key) => {
                return (
                  <GridSelectedItem
                    item
                    key={key}
                    xs={12}
                    onDelete={() => {
                      if (categories) {
                        const categoriesWithOneGenre = categories.filter(
                          (category) => {
                            const genresFromCategory = getGenresFromCategory(
                              genres,
                              category
                            );
                            console.log(genresFromCategory);
                            return (
                              genresFromCategory.length === 1 &&
                              genresFromCategory[0].id === genre.id
                            );
                          }
                        );
                        console.log(categoriesWithOneGenre);
                        categoriesWithOneGenre.forEach((cat) =>
                          removeCategory(cat)
                        );
                      }
                      removeItem(genre);
                    }}
                  >
                    <Typography>{genre.name}</Typography>
                  </GridSelectedItem>
                );
              })}
          </GridSelected>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      </>
    );
  }
);

export default GenreField;
