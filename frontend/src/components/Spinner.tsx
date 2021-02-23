import React from "react";
import {
  Box,
  Container,
  LinearProgress,
  makeStyles,
  MuiThemeProvider,
  Theme,
  Typography,
} from "@material-ui/core";

function makeLocalTheme(theme: Theme): Theme {
  return {
    ...theme,
    palette: {
      ...theme.palette,
      primary: theme.palette.error,
      type: "dark",
    },
  };
}

const Spinner = () => {
  return (
    <MuiThemeProvider theme={makeLocalTheme}>
      <LinearProgress
        color={"primary"}
        style={{ position: "fixed", width: "100%", zIndex: 9999 }}
      />
    </MuiThemeProvider>
  );
};

export default Spinner;
