import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import React, {
  MutableRefObject,
  RefAttributes,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface InputFileProps extends RefAttributes<InputFileComponent> {
  ButtonFile: React.ReactNode;
  InputFileProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  TextFieldProps?: TextFieldProps;
}
export interface InputFileComponent {
  openWindow: () => void;
  clear: () => void;
}

const InputFile = React.forwardRef<InputFileComponent, InputFileProps>(
  (props, ref) => {
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
    useImperativeHandle(ref, () => {
      return {
        openWindow: () => fileRef.current.click(),
        clear: () => setFilename(""),
      };
    });
    return (
      <>
        <input type="file" {...inputFileProps} />
        <TextField {...textFieldProps} />
      </>
    );
  }
);

export default InputFile;
