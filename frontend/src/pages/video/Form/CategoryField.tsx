import { Typography } from "@material-ui/core";
import React from "react";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useHttpHandler from "../../../hooks/useHttpHandler";
import httpCategory from "../../../util/http/http-category";

interface CategoryFieldProps {}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
  const autoCompleteHttp = useHttpHandler();
  const fetchOptions = (searchText) =>
    autoCompleteHttp(
      httpCategory.list({
        queryParams: {
          search: searchText,
          all: "",
        },
      })
    )
      .then((data) => {
        return data.data;
      })
      .catch((error) => console.log(error));
  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        AutoCompleteProps={{
          freeSolo: false,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,
        }}
        TextFieldProps={{ label: "Categorias" }}
      />
      <GridSelected>
        <GridSelectedItem onClick={() => {}}>
          <Typography>Categoria 1</Typography>
        </GridSelectedItem>
      </GridSelected>
    </>
  );
};

export default CategoryField;
