import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlProps,
} from "@material-ui/core";
import React from "react";
import Rating from "../../../components/Rating";

interface RatingFieldProps {
  value: string | undefined;
  setValue: (value) => void;
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

const ratings: FormControlLabelProps[] = [
  {
    value: "L",
    control: <Radio color="primary" />,
    label: <Rating rating={"L"} />,
    labelPlacement: "top",
  },
  {
    value: "10",
    control: <Radio color="primary" />,
    label: <Rating rating={"10"} />,
    labelPlacement: "top",
  },
  {
    value: "12",
    control: <Radio color="primary" />,
    label: <Rating rating={"12"} />,
    labelPlacement: "top",
  },
  {
    value: "14",
    control: <Radio color="primary" />,
    label: <Rating rating={"14"} />,
    labelPlacement: "top",
  },
  {
    value: "16",
    control: <Radio color="primary" />,
    label: <Rating rating={"16"} />,
    labelPlacement: "top",
  },
  {
    value: "18",
    control: <Radio color="primary" />,
    label: <Rating rating={"18"} />,
    labelPlacement: "top",
  },
];

export const RatingField: React.FC<RatingFieldProps> = (props) => {
  const { disabled, error, setValue, value } = props;
  return (
    <FormControl
      margin="normal"
      disabled={disabled === true}
      error={error !== undefined}
      {...props.formControlProps}
    >
      <FormLabel component="legend">Classificação</FormLabel>
      <Box paddingTop={1}>
        <RadioGroup
          name="rating"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value ? value : ""}
          row
        >
          {ratings.map((props, key) => {
            return <FormControlLabel key={key} {...props} />;
          })}
        </RadioGroup>
      </Box>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
