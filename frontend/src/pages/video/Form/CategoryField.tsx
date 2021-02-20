import {
  FormControl,
  FormHelperText,
  Typography,
  FormControlProps,
} from "@material-ui/core";
import React from "react";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useCollectionManager from "../../../hooks/useCollectionManager";
import useHttpHandler from "../../../hooks/useHttpHandler";
import { Genre } from "../../../util/dto";
import httpCategory from "../../../util/http/http-category";

interface CategoryFieldProps {
  categories: any[] | undefined;
  setCategories: (caregories) => void;
  genres: Genre[] | undefined;
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
  const { categories, setCategories, genres, disabled, error } = props;
  const { addItem, removeItem } = useCollectionManager(
    categories || [],
    setCategories
  );
  const autoCompleteHttp = useHttpHandler();
  const fetchOptions = (searchText) => {
    if (!genres) {
      return Promise.resolve()
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
  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        AutoCompleteProps={{
          autoSelect: true,
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
                  onClick={() => {
                    removeItem(category);
                  }}
                >
                  <Typography>{category.name}</Typography>
                </GridSelectedItem>
              );
            })}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CategoryField;
