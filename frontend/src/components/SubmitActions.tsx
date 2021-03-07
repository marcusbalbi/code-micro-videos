import * as React from "react";
import { Box, Button, ButtonProps, Theme, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

interface SubmitActionProps {
  disableButtons: boolean;
  handleSave: () => {};
}

const SubmitActions: React.FC<SubmitActionProps> = (props) => {
  const classes = useStyles();
  const buttonProps: ButtonProps = {
    variant: "contained",
    size: "medium",
    className: classes.submit,
    color: "secondary",
    disabled: props.disableButtons  === undefined ? false : props.disableButtons,
  };
  return (
    <Box dir={"ltf"}>
      <Button {...buttonProps} onClick={props.handleSave}>
        Salvar
      </Button>
      <Button {...buttonProps} type="submit">
        Salvar e continuar editando
      </Button>
    </Box>
  );
};

export default SubmitActions;
