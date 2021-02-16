import { CircularProgress, TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React, { useState } from "react";

interface AsyncAutocompleteProps {
  TextFieldProps?: TextFieldProps;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const textFieldProps: TextFieldProps = {
    margin: "normal",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps }),
  };

  const autocompleteProps: AutocompleteProps<any, false, false, false> = {
    open,
    loading,
    options,
    loadingText: "Carregando...",
    noOptionsText: "Nenhum Item Encontrado",
    getOptionLabel: (option) => option.nome,
    onOpen: () => {
      setOpen(true);
    },
    onClose: () => {
      setOpen(false);
    },
    onInputChange: (event, value) => {
      setSearchText(value);
    },
    renderInput: (params) => {
      return (
        <TextField
          {...params}
          {...textFieldProps}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color={"inherit"} size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      );
    },
  };

  return <Autocomplete {...autocompleteProps} />;
};

export default AsyncAutocomplete;
