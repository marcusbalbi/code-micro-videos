import {
  FormControl,
  FormControlProps,
  FormHelperText,
  Typography,
} from "@material-ui/core";
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
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
  const { genres, setGenres, error, disabled } = props;
  const { addItem, removeItem } = useCollectionManager(genres || [], setGenres);
  const [value, setValue] = useState({ name: "" });
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
          autoSelect: true,
          clearOnEscape: true,
          freeSolo: true,
          value: value,
          disabled,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,

          onChange: (event, value) => {
            addItem(value);
            setValue({ name: "" });
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
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default GenreField;
