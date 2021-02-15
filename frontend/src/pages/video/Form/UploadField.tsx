import {
  FormControl,
  FormHelperText,
  FormControlProps,
  Button,
} from "@material-ui/core";
import React from "react";
import InputFile from "../../../components/InputFile";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
interface UploadFieldProps {
  accept: string;
  label: string;
  setValue: (value) => void;
  error?: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

export const UploadField: React.FC<UploadFieldProps> = (props) => {
  const { disabled, error, setValue, label, accept } = props;
  return (
    <FormControl
      margin="normal"
      fullWidth
      disabled={disabled === true}
      error={error !== undefined}
      {...props.formControlProps}
    >
      <InputFile
        TextFieldProps={{
          label: label,
          InputLabelProps: {
            shrink: true,
          },
          style: {
            backgroundColor: "#FFF"
          }
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
            onClick={() => {}}
          >
            Adicionar
          </Button>
        }
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
