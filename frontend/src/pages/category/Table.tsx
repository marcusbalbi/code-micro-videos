import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCategory from "../../util/http/http-category";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import { Category, ListResponse } from "../../util/dto";

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
          return <BadgeYes />;
        }
        return <BadgeNo />;
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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let canLoad = true;
    (async function getCagegories() {
      const { data } = await httpCategory.list<ListResponse<Category>>();
      if (canLoad) {
        setCategories(data.data);
      }
    })();

    return () => {
      canLoad = false;
    };
  }, []);

  return (
    <MUIDataTable
      data={categories}
      title={"Listagem de Categorias"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
