import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import React, { useRef, MutableRefObject, useState } from "react";

interface InputFileProps {
  ButtonFile: React.ReactNode;
  InputFileProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  TextFieldProps?: TextFieldProps;
}

const InputFile: React.FC<InputFileProps> = (props) => {
  const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [filename, setFilename] = useState("");

  const textFieldProps: TextFieldProps = {
    variant: "outlined",
    ...props.TextFieldProps,
    InputProps: {
      ...props.TextFieldProps?.InputProps,
      readOnly: true,
      endAdornment: (
        <InputAdornment position={"end"}>{props.ButtonFile}</InputAdornment>
      ),
    },
    value: filename,
  };

  const inputFileProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > = {
    ...props.InputFileProps,
    hidden: true,
    ref: fileRef,
    onChange: (event) => {
      const files = event.target.files;
      if (files && files.length) {
        setFilename(
          Array.from(files)
            .map((file) => file.name)
            .join(", ")
        );
      }
      if (props.InputFileProps && props.InputFileProps.onChange) {
        props.InputFileProps.onChange(event);
      }
    },
  };

  return (
    <>
      <input type="file" {...inputFileProps} />
      <TextField {...textFieldProps} />
    </>
  );
};

export default InputFile;
