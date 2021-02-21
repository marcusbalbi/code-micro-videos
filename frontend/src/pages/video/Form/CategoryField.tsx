import {
  FormControl,
  FormHelperText,
  Typography,
  FormControlProps,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { MutableRefObject, RefAttributes, useImperativeHandle, useRef } from "react";
import AsyncAutocomplete, { AsyncAutoCompleteComponent } from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useCollectionManager from "../../../hooks/useCollectionManager";
import useHttpHandler from "../../../hooks/useHttpHandler";
import { Genre } from "../../../util/dto";
import httpCategory from "../../../util/http/http-category";
import { getGenresFromCategory } from "../../../util/model-filter";

interface CategoryFieldProps extends RefAttributes<CategoryFieldProps> {
  categories: any[] | undefined;
  setCategories: any;
  genres: Genre[] | undefined;
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

export interface CategoryFieldComponent {
  clear: () => void;
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    genresSubtitle: {
      color: grey[800],
      fontSize: "0.8rem",
    },
  };
});

const CategoryField = React.forwardRef<
  CategoryFieldComponent,
  CategoryFieldProps
>((props, ref) => {
  const { categories, setCategories, genres, disabled, error } = props;
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;
  const classes = useStyles();
  const { addItem, removeItem } = useCollectionManager(
    categories || [],
    setCategories
  );
  const autoCompleteHttp = useHttpHandler();
  const fetchOptions = (searchText) => {
    if (!genres) {
      return Promise.resolve();
    }
    return autoCompleteHttp(
      httpCategory.list({
        queryParams: {
          genres: genres.map((genre) => genre.id).join(","),
          all: "",
        },
      })
    )
      .then((data) => {
        return data.data;
      })
      .catch((error) => console.log(error));
  };
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
          disabled: disabled === true || !genres || genres.length <= 0,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,
          onChange: (event, value) => {
            addItem(value);
          },
        }}
        TextFieldProps={{ label: "Categorias", error: error !== undefined }}
      />
      <FormControl
        margin="normal"
        fullWidth
        disabled={disabled === true}
        error={error !== undefined}
        {...props.formControlProps}
      >
        <GridSelected>
          {categories &&
            categories.map((category, key) => {
              return (
                <GridSelectedItem
                  item
                  key={key}
                  xs={12}
                  onDelete={() => {
                    removeItem(category);
                  }}
                >
                  <Typography noWrap={true}>{category.name}</Typography>
                  {genres && (
                    <Typography className={classes.genresSubtitle}>
                      Gêneros:{" "}
                      {getGenresFromCategory(genres, category)
                        .map((gen) => gen.name)
                        .join(",")}
                    </Typography>
                  )}
                </GridSelectedItem>
              );
            })}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
});

export default CategoryField;
