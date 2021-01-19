import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables";
import React from "react";
import { merge } from "lodash";

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

interface TableProps extends MUIDataTableProps {}

const Table: React.FC<TableProps> = (props) => {
  const newProps: MUIDataTableProps = merge(
    { options: defaultOptions } as MUIDataTableProps,
    props
  );
  return <MUIDataTable {...newProps}></MUIDataTable>;
};

export default Table;
