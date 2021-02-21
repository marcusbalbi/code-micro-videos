import {
  FormControl,
  FormHelperText,
  FormControlProps,
  Button,
} from "@material-ui/core";
import React, { MutableRefObject, useImperativeHandle, useRef } from "react";
import InputFile, { InputFileComponent } from "../../../components/InputFile";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
interface UploadFieldProps {
  accept: string;
  label: string;
  setValue: (value) => void;
  error?: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

export interface UploadFieldComponent {
  clear: () => void;
}

export const UploadField = React.forwardRef<
  UploadFieldComponent,
  UploadFieldProps
>((props, ref) => {
  const fileRef = useRef() as MutableRefObject<InputFileComponent>;
  const { disabled, error, setValue, label, accept } = props;
  useImperativeHandle(ref, () => {
    return {
      clear: () => fileRef.current.clear(),
    };
  });
  return (
    <FormControl
      margin="normal"
      fullWidth
      disabled={disabled === true}
      error={error !== undefined}
      {...props.formControlProps}
    >
      <InputFile
        ref={fileRef}
        TextFieldProps={{
          label: label,
          InputLabelProps: {
            shrink: true,
          },
          style: {
            backgroundColor: "#FFF",
          },
        }}
        InputFileProps={{
          accept: accept,
          onChange: (event) => {
            event.target.files &&
              event.target.files.length &&
              setValue(event.target.files[0]);
          },
        }}
        ButtonFile={
          <Button
            endIcon={<CloudUploadIcon />}
            variant="contained"
            color="primary"
            onClick={() => {
              fileRef.current.openWindow();
            }}
          >
            Adicionar
          </Button>
        }
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
});
