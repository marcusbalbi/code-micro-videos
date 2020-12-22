import { Chip } from "@material-ui/core";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";
import { httpVideo } from "../../util/http";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const columnsDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "nome",
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value === true) {
          return <Chip color="primary" label="SIM" />;
        }
        return <Chip color="secondary" label="NÃO" />;
      },
    },
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
      },
    },
  },
];

export const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo.get("categories/").then((response) => {
      setData(response.data.data);
    });
  }, []);

  return (
    <MUIDataTable
      data={data}
      title={"Listagem de Categorias"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
