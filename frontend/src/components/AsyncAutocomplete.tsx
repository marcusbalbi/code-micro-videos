import { CircularProgress, TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

interface AsyncAutocompleteProps {
  fetchOptions: (searchText) => Promise<any>;
  TextFieldProps?: TextFieldProps;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const snackbar = useSnackbar();
  const { fetchOptions } = props;
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

  useEffect(() => {
    let isSubscribed = false;
    async function getData() {
      setLoading(true);
      try {
        const { data } = await fetchOptions(searchText);
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
  }, [snackbar, fetchOptions, searchText]);

  return <Autocomplete {...autocompleteProps} />;
};

export default AsyncAutocomplete;
