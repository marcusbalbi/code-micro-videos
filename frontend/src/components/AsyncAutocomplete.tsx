import { CircularProgress, TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React, {
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDebounce } from "use-debounce/lib";

interface AsyncAutocompleteProps extends RefAttributes<AsyncAutocompleteProps> {
  fetchOptions: (searchText) => Promise<any>;
  debounceTime?: number;
  TextFieldProps?: TextFieldProps;
  AutoCompleteProps: Omit<
    AutocompleteProps<any, any, any, any>,
    "renderInput" | "options"
  >;
}

export interface AsyncAutoCompleteComponent {
  clear: () => void;
}

const AsyncAutocomplete = React.forwardRef<
  AsyncAutoCompleteComponent,
  AsyncAutocompleteProps
>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const { fetchOptions, debounceTime = 300 } = props;
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
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
    inputValue: searchText,
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
    if (!open || (debouncedSearchText === "" && freeSolo)) {
      return;
    }
    let isSubscribed = true;
    async function getData() {
      setLoading(true);
      try {
        const data = await fetchOptions(debouncedSearchText);
        if (isSubscribed) {
          setOptions(data);
        }
      } finally {
        setLoading(false);
      }
    }
    getData();
    return () => {
      isSubscribed = false;
    };
    //eslint-disable-next-line
  }, [debouncedSearchText, open, freeSolo]);
  useImperativeHandle(ref, () => {
    return {
      clear: () => {
        setSearchText("");
        setOptions([]);
      },
    };
  });
  return <Autocomplete {...autocompleteProps} />;
});

export default AsyncAutocomplete;
