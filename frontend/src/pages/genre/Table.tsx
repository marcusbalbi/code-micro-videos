import React, { useEffect, useState } from "react";
import httpGenre from "../../util/http/http-genre";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import { Genre, ListResponse } from "../../util/dto";
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
    width: "20%",
  },
  {
    name: "categories",
    label: "Categorias",
    width: "20%",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map((value: any) => value.name).join(", ");
      },
    },
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: `4%`,
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
    width: `10%`,
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
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    let canLoad = true;
    (async function getGenres() {
      const { data } = await httpGenre.list<ListResponse<Genre>>();
      if (canLoad) {
        setGenres(data.data);
      }
    })();
    return () => {
      canLoad = false;
    };
  }, []);

  return (
    <DefaultTable
      data={genres}
      title={"Listagem de Generos"}
      columns={columnsDefinition}
    />
  );
};

export default Table;
