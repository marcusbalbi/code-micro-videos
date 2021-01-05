import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

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
