import { CircularProgress, TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

interface AsyncAutocompleteProps {
  fetchOptions: (searchText) => Promise<any>;
  TextFieldProps?: TextFieldProps;
  AutoCompleteProps: Omit<
    AutocompleteProps<any, any, any, any>,
    "renderInput" | "options"
  >;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const snackbar = useSnackbar();
  const { fetchOptions } = props;
  const { onOpen, onClose, onInputChange, freeSolo } = props.AutoCompleteProps;
  const textFieldProps: TextFieldProps = {
    margin: "normal",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps }),
  };

  const autocompleteProps: AutocompleteProps<any, any, any, any> = {
    loadingText: "Carregando...",
    noOptionsText: "Nenhum Item Encontrado",
    ...(props.AutoCompleteProps && { ...props.AutoCompleteProps }),
    open,
    loading,
    options,
    onOpen: (event) => {
      setOpen(true);
      onOpen && onOpen(event);
    },
    onClose: (event, reason) => {
      setOpen(false);
      onClose && onClose(event, reason);
    },
    onInputChange: (event, value, reason) => {
      setSearchText(value);
      onInputChange && onInputChange(event, value, reason);
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
  useEffect(() => {
    if (!open && !freeSolo) {
      setOptions([]);
    }
  }, [open, freeSolo]);

  useEffect(() => {
    console.log({ open, searchText, freeSolo });
    if (!open || (searchText === "" && freeSolo)) {
      return;
    }
    let isSubscribed = true;
    async function getData() {
      setLoading(true);
      try {
        const data = await fetchOptions(searchText);
        if (isSubscribed) {
          setOptions(data);
        }
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    getData();
    return () => {
      isSubscribed = false;
    };
  }, [snackbar, fetchOptions, searchText, open, freeSolo]);

  return <Autocomplete {...autocompleteProps} />;
};

export default AsyncAutocomplete;
