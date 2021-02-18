import { Typography } from "@material-ui/core";
import React from "react";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useHttpHandler from "../../../hooks/useHttpHandler";
import httpGenre from "../../../util/http/http-genre";

interface GenreFieldProps {}

const GenreField: React.FC<GenreFieldProps> = (props) => {
  const autoCompleteHttp = useHttpHandler();
  const fetchOptions = (searchText) =>
    autoCompleteHttp(
      httpGenre.list({
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
        TextFieldProps={{ label: "Gêneros" }}
      />
      <GridSelected>
        <GridSelectedItem xs={6} onClick={() => {}}>
          <Typography>Genero 1</Typography>
        </GridSelectedItem>
      </GridSelected>
    </>
  );
};

export default GenreField;
