import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";
import { httpVideo } from "../../util/http";

const columnsDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "nome",
  },
  {
    name: "is_active",
    label: "Ativo?",
  },
  {
    name: "created_at",
    label: "Criado em",
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
