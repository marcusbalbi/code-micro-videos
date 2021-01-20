import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables";
import React from "react";
import { merge, omit, cloneDeep } from "lodash";
import {
  MuiThemeProvider,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
export interface TableColumns extends MUIDataTableColumn {
  width?: string;
}

interface TableProps extends MUIDataTableProps {
  columns: TableColumns[];
  loading?: boolean;
}

const defaultOptions: MUIDataTableOptions = {
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: "Nenhum registro encontrado",
      toolTip: "Classificar",
    },
    pagination: {
      next: "Próxima página",
      previous: "Página anterior",
      rowsPerPage: "Por pagina:",
      displayRows: "de",
    },
    toolbar: {
      search: "Busca",
      downloadCsv: "Download CSV",
      print: "Imprimir",
      viewColumns: "Ver colunas",
      filterTable: "Filtrar tabelas",
    },
    filter: {
      all: "Todos",
      title: "FILTROS",
      reset: "LIMPAR",
    },
    viewColumns: {
      title: "Ver colunas",
      titleAria: "Ver/Esconder colunas da tabela",
    },
    selectedRows: {
      text: "registro (s) selecionado (s)",
      delete: "Excluir",
      deleteAria: "Excluir registros selecionados",
    },
  },
};

const Table: React.FC<TableProps> = (props) => {
  function extranctMuiDataTableColumns(
    columns: TableColumns[]
  ): MUIDataTableColumn[] {
    setColumnsWidth(columns);
    return columns.map((item) => {
      return omit(item, "width");
    });
  }
  function setColumnsWidth(columns: TableColumns[]) {
    columns.forEach((column, key) => {
      if (column.width) {
        const overrides = theme.overrides as any;
        overrides.MUIDataTableHeadCell.fixedHeader[
          `&:nth-child(${key + 2})`
        ] = {
          width: column.width,
        };
      }
    });
  }
  const theme = cloneDeep<Theme>(useTheme());
  const isSmOrDOwn = useMediaQuery(theme.breakpoints.down("sm"));
  const newProps = merge({ options: cloneDeep(defaultOptions) }, props, {
    columns: extranctMuiDataTableColumns(props.columns),
  });
  function getOriginalMuiDataTableProps() {
    return omit(newProps, "loading");
  }
  function applyLoading() {
    const textLabels = (newProps.options as any).textLabels;
    textLabels.body.noMatch =
      newProps.loading === true ? "Carregando..." : textLabels.body.noMatch;
  }
  function applyResponsive() {
    newProps.options.responsive = isSmOrDOwn ? "standard" : "simple";
  }
  applyLoading();
  applyResponsive();

  const originalProps = getOriginalMuiDataTableProps();
  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...originalProps}></MUIDataTable>
    </MuiThemeProvider>
  );
};

export default Table;
