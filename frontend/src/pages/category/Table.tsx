import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React from "react";

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

const data = [
  { name: "teste1", is_active: true, created_at: "2009-12-12" },
  { name: "teste2", is_active: false, created_at: "2009-12-13" },
  { name: "teste3", is_active: true, created_at: "2009-12-13" },
  { name: "teste4", is_active: false, created_at: "2009-12-15" },
];

export const Table = () => {
  return (
    <MUIDataTable
      data={data}
      title={"Listagem de Categorias"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
