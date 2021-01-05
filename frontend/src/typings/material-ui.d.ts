import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";
import {
  PaletteColorOptions,
  PaletteOptions,
  Palette,
} from "@material-ui/core/styles/createPalette";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    success: PaletteColor;
  }
  interface PaletteOptions {
    success?: PaletteColorOptions;
  }
}
declare module "@material-ui/core/styles/overrides" {
  interface ComponentNameToClassKey {
    MUIDataTable: any;
    MUIDataTableToolbar: any;
    MUIDataTableHeadCell: any;
    MuiDataTableSortLabel: any;
    MUIDataTableSelectCell: any;
    MUIDataTableBodyCell: any;
    MUIDataTableToolbarSelect: any;
    MUIDataTableBodyRow: any;
    MUIDataTablePagination: any;
  }
}
