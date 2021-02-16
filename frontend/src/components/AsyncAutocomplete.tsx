import { TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React, { useState } from "react";

interface AsyncAutocompleteProps {
  TextFieldProps?: TextFieldProps;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {
  const [open, setOpen] = useState(false);
  const textFieldProps: TextFieldProps = {
    margin: "normal",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && {...props.TextFieldProps})
  };

  const autocompleteProps: AutocompleteProps = {
    renderInput: (params) => <TextField {...params} {...textFieldProps} />,
  };

  return <Autocomplete {...autocompleteProps} />;
};

export default AsyncAutocomplete;
