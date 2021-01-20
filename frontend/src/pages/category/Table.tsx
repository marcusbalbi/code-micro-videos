import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import httpCategory from "../../util/http/http-category";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import { Category, ListResponse } from "../../util/dto";
import DefaultTable, { TableColumns } from "../../components/Table";
const columnsDefinition: TableColumns[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
    },
  },
  {
    name: "name",
    label: "nome",
    width: "40%",
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: "4%",
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
    width: "10%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
      },
    },
  },
  {
    name: "actions",
    label: "Ações",
    width: `16%`,
    options: {
      sort: false,
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
    <DefaultTable
      data={categories}
      title={"Listagem de Categorias"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
