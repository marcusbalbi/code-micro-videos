import { Typography } from "@material-ui/core";
import React, { useState } from "react";
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
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
  const { categories, setCategories, genres } = props;
  const { addItem, removeItem } = useCollectionManager(
    categories || [],
    setCategories
  );
  const [value, setValue] = useState({ name: "" });
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
          value: value,
          disabled: !genres || genres.length <= 0,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,
          onChange: (event, value) => {
            addItem(value);
            setValue({ name: "" });
          },
        }}
        TextFieldProps={{ label: "Categorias" }}
      />
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
    </>
  );
};

export default CategoryField;
