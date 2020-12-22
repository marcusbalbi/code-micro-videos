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
    name: "categories",
    label: "Categorias",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map((value: any) => value.name).join(", ");
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
    httpVideo.get("genres/").then((response) => {
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
