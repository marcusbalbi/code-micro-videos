import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables";
import {
  MuiThemeProvider,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { cloneDeep, merge, omit } from "lodash";
import DebouncedTableSearch from "./DebouncedTableSearch";
import React from "react";

export interface TableColumns extends MUIDataTableColumn {
  width?: string;
}

interface TableProps extends MUIDataTableProps {
  columns: TableColumns[];
  loading?: boolean;
  debouncedSearchTime?: number;
}

const defaultOptions = (debouncedSearchTime): MUIDataTableOptions => {
  return {
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
    customSearchRender: (searchText, handleSearch, hideSearch, options) => {
      return (
        <DebouncedTableSearch
          searchText={searchText}
          onHide={hideSearch}
          onSearch={handleSearch}
          options={options}
          debounceTime={debouncedSearchTime}
        />
      );
    },
  };
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
  const newProps = merge(
    { options: defaultOptions(props.debouncedSearchTime) },
    props,
    {
      columns: extranctMuiDataTableColumns(props.columns),
    }
  );
  function getOriginalMuiDataTableProps() {
    return omit({ ...newProps }, "loading", "debouncedSearchTime");
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
}

export default Table;
