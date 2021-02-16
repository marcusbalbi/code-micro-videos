import { createMuiTheme } from "@material-ui/core";
import { red, green } from "@material-ui/core/colors";
import {
  PaletteOptions,
  SimplePaletteColorOptions,
} from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
  primary: {
    main: "#79aec7",
    contrastText: "#FFF",
  },
  secondary: {
    main: "#4db5ab",
    contrastText: "#FFF",
    dark: "#055a52"
  },
  background: {
    default: "#fafafa",
  },
  success: {
    main: green["500"],
    contrastText: "#FFF",
  },
  error: {
    main: red["500"],
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
          color: (palette!.primary as SimplePaletteColorOptions).dark,
        },
      },
      iconActive: {
        color: (palette!.primary as SimplePaletteColorOptions).dark,
        "&:hover, &:active, &:focus": {
          color: (palette!.primary as SimplePaletteColorOptions).dark,
        },
      },
    },
    MUIDataTableHeadCell: {
      fixedHeader: {
        paddingTop: 8,
        paddingBotton: 8,
        backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
        color: "#FFF",
        "&[aria-sort]": {
          backgroundColor: "#459ac4",
        },
      },
      toolButton: {
        color: "#FFF"
      },
      sortActive: {
        color: "#FFF",
      },
      sortAction: {
        alignItems: "center",
      },
      sortLabelRoot: {
        "& svg": {
          color: "#FFF !important",
        },
      },
    },
    MUIDataTableSelectCell: {
      headerCell: {
        backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
        "& span": {
          color: "#FFF !important",
        },
      },
    },
    MUIDataTableBodyCell: {
      root: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
        "&:hover, &:active, &:focus": {
          color: (palette!.secondary as SimplePaletteColorOptions).main,
        },
      },
    },
    MUIDataTableToolbarSelect: {
      title: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
      iconButton: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
    },
    MUIDataTableBodyRow: {
      root: {
        color: (palette!.secondary as SimplePaletteColorOptions).main,
        "&:nth-child(odd)": {
          backgroundColor: palette!.background!.default,
        },
      },
    },
    MUIDataTablePagination: {
      root: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
    },
  },
});

export default theme;
