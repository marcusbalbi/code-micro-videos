import { createMuiTheme } from "@material-ui/core";
import { PaletteOptions, SimplePaletteColorOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
  primary: {
    main: "#79aec7",
    contrastText: "#FFF",
  },
  secondary: {
    main: "#4db5ab",
    contrastText: "#FFF",
  },
  background: {
    default: "#fafafa",
  },
};

const theme = createMuiTheme({
  palette,
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: "none",
      },
    },
    MUIDataTableToolbar: {
      root: {
        minHeight: "58px",
        backgroundColor: palette!.background!.default,
      },
      icon: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
        "&:hover, &:active, &:focus": {
          color: "#055a52",
        },
      },
      iconActive: {
        color: "#055a52",
        "&:hover, &:active, &:focus": {
          color: "#055a52",
        },
      },
    },
  },
});

export default theme;
