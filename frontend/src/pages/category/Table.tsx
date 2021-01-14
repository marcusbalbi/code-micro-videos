import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCategory from "../../util/http/http-category";
import { BadgeNo, BadgeYes } from "../../components/Badge";

interface Category {
  name: string;
  is_active: boolean;
  created_at: string;
}

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
    (async function getCagegories() {
      const { data } = await httpCategory.list<{ data: Category[] }>();
      setCategories(data.data);
    })();
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
