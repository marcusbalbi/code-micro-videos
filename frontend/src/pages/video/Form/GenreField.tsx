import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import AsyncAutocomplete from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useCollectionManager from "../../../hooks/useCollectionManager";
import useHttpHandler from "../../../hooks/useHttpHandler";
import httpGenre from "../../../util/http/http-genre";

interface GenreFieldProps {
  genres: any[] | undefined;
  setGenres: (genres) => void;
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
  const { genres, setGenres } = props;
  const { addItem, removeItem } = useCollectionManager(genres || [], setGenres);
  const [ value, setValue ] = useState({ name: "" })
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
          freeSolo: true,
          value: value,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,

          onChange: (event, value) => {
            addItem(value);
            setValue({ name: "" })
          },
        }}
        TextFieldProps={{ label: "Gêneros" }}
      />
      <GridSelected>
        {genres &&
          genres.map((genre, key) => {
            return (
              <GridSelectedItem
                item
                key={key}
                xs={12}
                onClick={() => {
                  removeItem(genre);
                }}
              >
                <Typography>{genre.name}</Typography>
              </GridSelectedItem>
            );
          })}
      </GridSelected>
    </>
  );
};

export default GenreField;
